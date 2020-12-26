import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class UpVote extends BaseEntity {
  @PrimaryColumn()
  userId!: number;

  @ManyToMany(() => User, (user) => user.upvotes)
  user: User;

  @PrimaryColumn()
  postId!: number;

  @ManyToMany(() => Post, (post) => post.upvotes)
  post: Post;

  @Column({ type: "int" })
  value!: number;
}
