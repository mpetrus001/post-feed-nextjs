import { Post } from "../entities/Post";
import { Resolver, Query, Mutation, Ctx, Arg } from "type-graphql";
import { MyContext } from "src/types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { orm }: MyContext): Promise<Post[]> {
    return orm.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number, @Ctx() { orm }: MyContext): Promise<Post | null> {
    return orm.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { orm }: MyContext
  ): Promise<Post> {
    const newPost = orm.create(Post, { title });
    await orm.persistAndFlush(newPost);
    return newPost;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Ctx() { orm }: MyContext
  ): Promise<Post | null> {
    const matchedPost = await orm.findOne(Post, { id });
    if (!matchedPost) return null;
    matchedPost.title = title;
    await orm.persistAndFlush(matchedPost);
    return matchedPost;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { orm }: MyContext
  ): Promise<boolean> {
    const deletes = await orm.nativeDelete(Post, { id });
    if (deletes > 0) return true;
    return false;
  }
}
