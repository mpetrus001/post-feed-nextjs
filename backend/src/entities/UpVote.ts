import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity()
export class UpVote extends BaseEntity {
  @PrimaryColumn()
  userId!: number;

  @Field()
  @ManyToOne(() => User, (user) => user.upvotes)
  user: User;

  @PrimaryColumn()
  postId!: number;

  @Field()
  @ManyToOne(() => Post, (post) => post.upvotes)
  post: Post;

  @Field()
  @Column({ type: "int" })
  value!: number;
}
