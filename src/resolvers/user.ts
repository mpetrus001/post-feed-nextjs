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

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Query(() => User, { nullable: true })
  user(@Arg("id") id: number, @Ctx() { em }: MyContext): Promise<User | null> {
    return em.findOne(User, { id });
  }

  @Mutation(() => User)
  async registerUser(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { em }: MyContext
  ): Promise<User> {
    const hash = await argon2.hash(password);
    const newUser = em.create(User, { username, password: hash });
    await em.persistAndFlush(newUser);
    return newUser;
  }

  // TODO change errors to be less revealing
  @Mutation(() => UserResponse)
  async loginUser(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const matchedUser = await em.findOne(User, { username });
    if (!matchedUser)
      return {
        errors: [
          {
            field: "username",
            message: "username could not be found",
          },
        ],
      };
    const isMatchingPassword = await argon2.verify(
      matchedUser.password,
      password
    );
    if (isMatchingPassword) return { user: matchedUser };
    return {
      errors: [
        {
          field: "password",
          message: "passwords did not match",
        },
      ],
    };
  }

  // @Mutation(() => User, { nullable: true })
  // async loginUser(
  //   @Arg("username") username: string,
  //   @Arg("password") password: string,
  //   @Ctx() { em }: MyContext
  // ): Promise<User | null> {
  //   const matchedUser = await em.findOne(User, { username });
  //   if (!matchedUser) return null;
  //   const isMatchingPassword = await argon2.verify(
  //     matchedUser.password,
  //     password
  //   );
  //   if (isMatchingPassword) return matchedUser;
  //   return null;
  // }

  // @Mutation(() => User, { nullable: true })
  // async updateUser(
  //   @Arg("id") id: number,
  //   @Arg("title") title: string,
  //   @Ctx() { em }: MyContext
  // ): Promise<User | null> {
  //   const matchedUser = await em.findOne(User, { id });
  //   if (!matchedUser) return null;
  //   matchedUser.title = title;
  //   await em.persistAndFlush(matchedUser);
  //   return matchedUser;
  // }

  @Mutation(() => Boolean)
  async deleteUser(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    const deletes = await em.nativeDelete(User, { id });
    if (deletes > 0) return true;
    return false;
  }
}
