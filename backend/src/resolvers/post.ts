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
  Int,
  FieldResolver,
  Root,
  ObjectType,
} from "type-graphql";
import { MyContext } from "src/types";
import { requireAuth } from "../middleware/requireAuth";
import { FieldError } from "./types";
import { UserInputError } from "apollo-server-express";
import { getConnection } from "typeorm";

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

  // borrowed from Ben Awad's lireddit
  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    // 20 -> 21
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;

    const replacements: any[] = [reaLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
    select p.*
    from post p
    ${cursor ? `where p."createdAt" < $2` : ""}
    order by p."createdAt" DESC
    limit $1
    `,
      replacements
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === reaLimitPlusOne,
    };
  }

  // @Query(() => [Post])
  // async posts(
  //   @Ctx() { orm: { PostRepository } }: MyContext,
  //   @Arg("skip", () => Int, { nullable: true })
  //   skip?: number,
  //   @Arg("take", () => Int, { nullable: true })
  //   take?: number
  // ): Promise<Post[]> {
  //   skip = skip ?? 0;
  //   take = take ?? 10;
  //   const serverLimit = Math.min(50, take);
  //   const posts = await PostRepository.createQueryBuilder("posts")
  //     // double quote due to postgres being case sensitive
  //     .orderBy('"createdAt"', "DESC")
  //     .skip(skip)
  //     .take(serverLimit)
  //     .getMany();

  //   return posts;
  // }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id") id: number,
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
