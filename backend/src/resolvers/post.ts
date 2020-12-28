import { UserInputError } from "apollo-server-express";
import { UpVote } from "../entities/UpVote";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
// import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
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
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 150);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(requireAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req, orm: { PostRepository } }: MyContext
  ): Promise<boolean> {
    value = value > 0 ? 1 : -1;
    const currentVote = await UpVote.findOne({
      postId,
      userId: req.session.userId,
    });
    if (!currentVote) {
      const newVote = UpVote.create({
        postId,
        userId: req.session.userId,
        value,
      });
      if (value < 0) {
        await PostRepository.decrement({ id: postId }, "points", 1);
      } else {
        await PostRepository.increment({ id: postId }, "points", 1);
      }
      await UpVote.save(newVote);
      return true;
    }

    // my current vote is up and I change it to up: do nothing
    if (currentVote.value > 0 && value > 0) return false;
    // my current vote is down and I change it to down: do nothing
    if (currentVote.value < 0 && value < 0) return false;
    // my current vote is up and I send down: remove one point
    if (currentVote.value >= 0 && value < 0) {
      await PostRepository.decrement({ id: postId }, "points", 1);
    }
    // my current vote is down and I send up: add one point
    if (currentVote.value <= 0 && value > 0) {
      await PostRepository.increment({ id: postId }, "points", 1);
    }
    currentVote.value = currentVote.value + value;
    await UpVote.save(currentVote);
    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req, orm: { PostRepository } }: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const postsQuery = await PostRepository.createQueryBuilder("post")
      // typeorm orderBy expects property name, not column name
      .orderBy("post.createdAt", "DESC")
      .take(reaLimitPlusOne)
      .leftJoinAndSelect("post.creator", "user");

    if (req.session.userId) {
      postsQuery.leftJoinAndMapOne(
        "post.vote",
        "post.upvotes",
        "vote",
        "vote.userId = :userId",
        { userId: req.session.userId }
      );
    }

    if (cursor) {
      postsQuery.where("post.createdAt < :cursor", {
        cursor: new Date(parseInt(cursor)),
      });
    }

    const posts = await postsQuery.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === reaLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id", () => Int) id: number,
    @Ctx() { orm: { PostRepository } }: MyContext
  ): Promise<Post | null> {
    const post = await PostRepository.findOne({ id });
    if (!post) return null;
    return post;
  }

  @Mutation(() => Post)
  @UseMiddleware(requireAuth) // will throw if user session doesn't exist
  async createPost(
    @Arg("postInput") postInput: PostInput,
    @Ctx() { orm: { PostRepository }, req }: MyContext
  ): Promise<Post> {
    // validate each of the inputs
    // structured in a way to add other validation later
    let errors: FieldError[] = [];
    if (postInput.title.length < 1)
      errors.push({
        field: "title",
        message: "title must be at least 1 char",
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

    const newPost = await PostRepository.create({
      ...postInput,
      creatorId: req.session.userId,
    });
    await PostRepository.save(newPost);
    return newPost;
  }

  // @Mutation(() => Post, { nullable: true })
  // async updatePost(
  //   @Arg("id") id: number,
  //   @Arg("title") title: string,
  //   @Ctx() { orm: { PostRepository } }: MyContext
  // ): Promise<Post | null> {
  //   const matchedPost = await PostRepository.findOne({ id });
  //   if (!matchedPost) return null;
  //   matchedPost.title = title;
  //   await PostRepository.save(matchedPost);
  //   return matchedPost;
  // }

  // @Mutation(() => Boolean)
  // async deletePost(
  //   @Arg("id") id: number,
  //   @Ctx() { orm: { PostRepository } }: MyContext
  // ): Promise<boolean> {
  //   const { affected } = await PostRepository.delete({ id });
  //   if (affected && affected > 0) return true;
  //   return false;
  // }
}
