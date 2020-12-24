import { Post } from "../entities/Post";
import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { MyContext } from "src/types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { orm: { PostRepository } }: MyContext): Promise<Post[]> {
    return PostRepository.find({});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id") id: number,
    @Ctx() { orm: { PostRepository } }: MyContext
  ): Promise<Post | undefined> {
    return PostRepository.findOne({ id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { orm: { PostRepository } }: MyContext
  ): Promise<Post> {
    return PostRepository.create({ title }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Ctx() { orm: { PostRepository } }: MyContext
  ): Promise<Post | null> {
    const matchedPost = await PostRepository.findOne({ id });
    if (!matchedPost) return null;
    matchedPost.title = title;
    await PostRepository.save(matchedPost);
    return matchedPost;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { orm: { PostRepository } }: MyContext
  ): Promise<boolean> {
    const { affected } = await PostRepository.delete({ id });
    if (affected && affected > 0) return true;
    return false;
  }
}
