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
  ObjectType,
  Int,
} from "type-graphql";
import { MyContext } from "src/types";
import { requireAuth } from "../middleware/requireAuth";
import { FieldError } from "./types";

@InputType()
class PostInput {
  @Field()
  title!: string;

  @Field()
  text!: string;
}

@ObjectType()
class PostResponse {
  // Field defines what types show up in GraphQL
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Post, { nullable: true })
  post?: Post | null;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(
    @Ctx() { orm: { PostRepository } }: MyContext,
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<Post[]> {
    const serverLimit = Math.min(100, limit);
    const postsQuery = await PostRepository.createQueryBuilder("posts")
      // double quote due to postgres being case sensitive
      .orderBy('"createdAt"', "DESC")
      .take(serverLimit);
    if (cursor)
      postsQuery.where('"createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    return postsQuery.getMany();
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id") id: number,
    @Ctx() { orm: { PostRepository } }: MyContext
  ): Promise<Post | undefined> {
    return PostRepository.findOne({ id });
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(requireAuth) // will throw if user session doesn't exist
  async createPost(
    @Arg("postInput") postInput: PostInput,
    @Ctx() { orm: { PostRepository }, req }: MyContext
  ): Promise<PostResponse> {
    if (postInput.title.length < 1)
      return {
        errors: [
          {
            field: "title",
            message: "title must be at least 2 chars",
          },
        ],
      };
    const newPost = await PostRepository.create({
      ...postInput,
      creatorId: req.session.userId,
    });
    await PostRepository.save(newPost);
    return { post: newPost };
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
