import { Post } from "../entities/Post";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  InputType,
  Field,
  UseMiddleware,
} from "type-graphql";
import { MyContext } from "src/types";
import { requireAuth } from "../middleware/requireAuth";

@InputType()
class PostInput {
  @Field()
  title!: string;

  @Field()
  text!: string;
}

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
  @UseMiddleware(requireAuth)
  async createPost(
    @Arg("postInput") postInput: PostInput,
    @Ctx() { orm: { PostRepository }, req }: MyContext
  ): Promise<Post> {
    return PostRepository.create({
      ...postInput,
      creatorId: req.session.userId,
    }).save();
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
