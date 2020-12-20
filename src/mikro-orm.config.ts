import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export default {
  user: process.env.POSTGRES_USER ?? "user",
  password: process.env.POSTGRES_PASSWORD ?? "password",
  dbName: process.env.POSTGRES_DB ?? "db",
  debug: !__prod__,
  type: "postgresql",
  entities: [Post],
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
} as Parameters<typeof MikroORM.init>[0];
