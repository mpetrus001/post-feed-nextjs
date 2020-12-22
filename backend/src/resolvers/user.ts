import { User } from "../entities/User";
import {
  Resolver,
  Query,
  Mutation,
  Ctx,
  Arg,
  ObjectType,
  Field,
} from "type-graphql";
import { MyContext } from "src/types";
import argon2 from "argon2";

// set up custom types for server responses
@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  // Field defines what types show up in GraphQL
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

// set up the GraphQL resolvers
@Resolver()
export class UserResolver {
  // checks to see if a user is logged in
  @Query(() => User, { nullable: true })
  async me(@Ctx() { orm, req }: MyContext): Promise<User | null> {
    const id = req.session.userId;
    if (!id) return null;
    return orm.findOne(User, { id });
  }

  // returns all users
  @Query(() => [User])
  users(@Ctx() { orm }: MyContext): Promise<User[]> {
    return orm.find(User, {});
  }

  // returns a single user by id
  @Query(() => User, { nullable: true })
  user(@Arg("id") id: number, @Ctx() { orm }: MyContext): Promise<User | null> {
    return orm.findOne(User, { id });
  }

  // adds a new user
  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { orm, req }: MyContext
  ): Promise<UserResponse> {
    let errors: FieldError[] = [];
    if (username.length < 2)
      errors.push({
        field: "username",
        message: "length of username must be at least 2 chars",
      });
    if (password.length < 6)
      errors.push({
        field: "password",
        message: "length of password must be at least 6 chars",
      });
    if (errors.length > 0) return { errors };

    try {
      const hash = await argon2.hash(password);
      const newUser = orm.create(User, { username, password: hash });
      // persist and flush will save the entity and clear with identity map
      await orm.persistAndFlush(newUser);
      // create a session for the new user and sends a cookie
      req.session.userId = newUser.id;
      return { user: newUser };
    } catch (error) {
      if (
        error.detail.includes("username") &&
        error.detail.includes("already exists")
      )
        return {
          errors: [
            {
              field: "username",
              message: "username already exists",
            },
          ],
        };
    }
    return {
      errors: [
        {
          field: "unknown",
          message: "you shouldn't get here",
        },
      ],
    };
  }

  // logs in an existing user
  @Mutation(() => UserResponse)
  async loginUser(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { orm, req }: MyContext
  ): Promise<UserResponse> {
    const matchedUser = await orm.findOne(User, { username });
    if (!matchedUser)
      return {
        errors: [
          {
            field: "username",
            message: "login attempt failed",
          },
        ],
      };
    const isMatchingPassword = await argon2.verify(
      matchedUser.password,
      password
    );
    if (isMatchingPassword) {
      // create a session for the logged in user and sends a cookie
      req.session.userId = matchedUser.id;
      return { user: matchedUser };
    }
    return {
      errors: [
        {
          field: "username",
          message: "login attempt failed",
        },
      ],
    };
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
  @Mutation(() => Boolean)
  async deleteUser(
    @Arg("id") id: number,
    @Ctx() { orm }: MyContext
  ): Promise<boolean> {
    const deletes = await orm.nativeDelete(User, { id });
    if (deletes > 0) return true;
    return false;
  }
}
