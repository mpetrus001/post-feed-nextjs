import { AuthenticationError, UserInputError } from "apollo-server-express";
import argon2 from "argon2";
import { nanoid } from "nanoid";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { COOKIE_NAME } from "../constants";
import { User } from "../entities/User";
import { requireAuth } from "../middleware/requireAuth";
import { sendEmail } from "../utils/sendEmail";
import { FieldError } from "./types";

@InputType()
class UserInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

// set up the GraphQL resolvers
@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext): string {
    // protects the user's email from access by other users
    if (req.session.userId === user.id) return user.email;
    return "";
  }

  // checks to see if a user is logged in
  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { req, orm: { UserRepository } }: MyContext
  ): Promise<User | null> {
    const id = req.session.userId;
    if (!id) return null;
    const user = await UserRepository.findOne({ id });
    if (!user) return null;
    return user;
  }

  // returns all users
  @Query(() => [User]) // sets the type-graphql return type
  @UseMiddleware(requireAuth) // will throw if user session doesn't exist
  users(@Ctx() { orm: { UserRepository } }: MyContext): Promise<User[]> {
    return UserRepository.find({});
  }

  // returns a single user by id
  @Query(() => User, { nullable: true })
  @UseMiddleware(requireAuth)
  async user(
    @Arg("id", () => Int) id: number,
    @Ctx() { orm: { UserRepository } }: MyContext
  ): Promise<User | null> {
    const user = await UserRepository.findOne({ id });
    // typeorm would return undefined, but i prefer null
    return user ? user : null;
  }

  // adds a new user
  @Mutation(() => User)
  async registerUser(
    @Arg("userInput") { username, email, password }: UserInput,
    @Ctx() { req, orm: { UserRepository } }: MyContext
  ): Promise<User> {
    // validate each of the inputs
    let errors: FieldError[] = [];
    if (username.length < 2)
      errors.push({
        field: "username",
        message: "username must be at least 2 chars",
      });
    if (username.includes("@"))
      errors.push({
        field: "username",
        message: "username cannot contain an @ symbol",
      });
    if (password.length < 6)
      errors.push({
        field: "password",
        message: "password must be at least 6 chars",
      });
    if (email.length < 6)
      errors.push({
        field: "email",
        message: "email must be at least 6 chars",
      });
    if (!email.includes("@"))
      errors.push({
        field: "email",
        message: "email must contain an @ symbol",
      });
    if (errors.length > 0) {
      let fields = errors.reduce(
        (acc, error) => [...acc, error.field],
        [] as string[]
      );
      throw new UserInputError(
        `${JSON.stringify(fields)} did not pass format validation`,
        {
          fieldErrors: errors,
        }
      );
    }

    // if all validation passes then proceed with register
    try {
      const hash = await argon2.hash(password);
      const newUser = UserRepository.create({
        username,
        email,
        password: hash,
      });
      await UserRepository.save(newUser);
      // create a session for the new user and sends a cookie
      req.session.userId = newUser.id;
      return newUser;
    } catch (error) {
      if (
        error.detail.includes("username") &&
        error.detail.includes("already exists")
      ) {
        throw new UserInputError("username already exists", {
          fieldErrors: [
            {
              field: "username",
              message: "username already exists",
            },
          ],
        });
      }
      if (
        error.detail.includes("email") &&
        error.detail.includes("already exists")
      ) {
        throw new UserInputError("email already exists", {
          fieldErrors: [
            {
              field: "email",
              message: "email already exists",
            },
          ],
        });
      }
      throw error;
    }
  }

  // logs in an existing user
  @Mutation(() => User)
  async loginUser(
    @Arg("username") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req, orm: { UserRepository } }: MyContext
  ): Promise<User> {
    const matchedUser = await UserRepository.findOne(
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    if (!matchedUser)
      throw new UserInputError("username could not be found", {
        fieldErrors: [
          {
            field: "username",
            message: "username could not be found",
          },
        ],
      });
    const isMatchingPassword = await argon2.verify(
      matchedUser.password,
      password
    );
    if (isMatchingPassword) {
      // create a session for the logged in user and sends a cookie
      req.session.userId = matchedUser.id;
      return matchedUser;
    } else {
      throw new UserInputError("password did not match", {
        fieldErrors: [
          {
            field: "password",
            message: "password did not match",
          },
        ],
      });
    }
  }

  // logs user out of the session
  @Mutation(() => Boolean)
  async logoutUser(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          resolve(false);
        }
        res.clearCookie(COOKIE_NAME);
        resolve(true);
      })
    );
  }

  // sends password reset and logs user out of the session
  @Mutation(() => Boolean)
  async resetPassword(
    @Ctx() { redis, req, res, orm: { UserRepository } }: MyContext,
    @Arg("username") usernameOrEmail: string
  ): Promise<boolean> {
    const matchedUser = await UserRepository.findOne(
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    if (!matchedUser)
      throw new UserInputError("username could not be found", {
        fieldErrors: [
          {
            field: "username",
            message: "username could not be found",
          },
        ],
      });

    // set a token for matching the user in the password reset email
    const token = nanoid();
    await redis.set(
      `reset-password-${token}`,
      matchedUser.id,
      "ex",
      1000 * 60 * 60 * 8 // 8 hours
    );

    // send the password reset email with link
    sendEmail({
      to: matchedUser.email,
      subject: "Password Reset Link - Post-Feed",
      html: `<a href="http://localhost:3000/reset-password/${token}">Reset password</a>`,
    });

    // log the user out of the client side and remove their session
    req.session.destroy((err) => {
      if (err) console.log(err);
    });
    res.clearCookie(COOKIE_NAME);

    return true;
  }

  // change a users password
  @Mutation(() => User)
  async changePassword(
    @Arg("password") password: string,
    @Arg("token") token: string,
    @Ctx() { redis, orm: { UserRepository } }: MyContext
  ): Promise<User> {
    // check if the reset token is valid
    const storedId = await redis.get(`reset-password-${token}`);
    if (!storedId)
      throw new AuthenticationError(
        "a valid token must be included in request"
      );
    if (password.length < 6)
      // stringifying as a string to match earlier format validation response
      throw new UserInputError(
        `${JSON.stringify(["password"])} did not pass format validation`,
        {
          fieldErrors: [
            {
              field: "password",
              message: "password must be at least 6 chars",
            },
          ],
        }
      );

    // if all validation passes then proceed with reset
    // redis stores strings but postgres ids are type int
    const id = parseInt(storedId);
    const matchedUser = await UserRepository.findOne({ id });
    if (!matchedUser)
      throw new AuthenticationError(
        "a valid token must be included in request"
      );
    const hash = await argon2.hash(password);
    matchedUser.password = hash;
    await UserRepository.save(matchedUser);
    // remove the reset-password token from the session
    redis.del(`reset-password-${token}`);
    return matchedUser;
  }

  // @Mutation(() => User, { nullable: true })
  // async updateUser(
  //   @Arg("id") id: number,
  //   @Arg("title") title: string,
  //   @Ctx() { orm }: MyContext
  // ): Promise<User | null> {
  //   const matchedUser = await orm.findOne(User, { id });
  //   if (!matchedUser) return null;
  //   matchedUser.title = title;
  //   await orm.persistAndFlush(matchedUser);
  //   return matchedUser;
  // }

  // delete a single user by id
  // @Mutation(() => Boolean)
  // async deleteUser(
  //   @Arg("id") id: number,
  //   @Ctx() { orm: { UserRepository } }: MyContext
  // ): Promise<boolean> {
  //   const { affected } = await UserRepository.delete({ id });
  //   if (affected && affected > 0) return true;
  //   return false;
  // }
}
