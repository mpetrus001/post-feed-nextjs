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
  FieldResolver,
  Root,
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

@InputType()
class PageInfoInput {
  @Field(() => Boolean, { nullable: true })
  hasNextPage?: boolean;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => String, { nullable: true })
  cursor?: string;
}

@ObjectType()
class PageInfoOutput {
  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Int)
  limit: number;

  @Field(() => String)
  cursor: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field(() => PageInfoOutput)
  pageInfo: PageInfoOutput;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 150);
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Ctx() { orm: { PostRepository } }: MyContext,
    @Arg("pageInfo", () => PageInfoInput)
    pageInfo: PageInfoInput
  ): Promise<PaginatedPosts> {
    const limit = pageInfo.limit ?? 10;
    const cursor = pageInfo.cursor ?? Date.now().toString();
    const serverLimit = Math.min(50, limit) + 1;
    const posts = await PostRepository.createQueryBuilder("posts")
      // double quote due to postgres being case sensitive
      .orderBy('"createdAt"', "DESC")
      .take(serverLimit)
      .where('"createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor)),
      })
      .getMany();

    return {
      // slice to remove the extra added for hasNextPage
      posts: posts.slice(0, serverLimit - 1),
      pageInfo: {
        hasNextPage: posts.length === serverLimit,
        limit,
        // convert the Date back to an int, then to a string
        cursor: posts[posts.length - 1].createdAt.valueOf().toString(),
      },
    };
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
