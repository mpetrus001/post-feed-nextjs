import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import { Post } from "./entities/Post";

const main = async () => {
  const orm = await MikroORM.init();
  await orm.getMigrator().up(); // runs the latest migration
  const newPost = orm.em.create(Post, { title: "Hello, World" });
  await orm.em.persistAndFlush(newPost);
};

main();
