import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import dotenv from "dotenv";

dotenv.config();

export default {
  type: "postgres" as const,
  host: "localhost",
  port: 5432,
  username: process.env.POSTGRES_USER ?? "admin",
  password: process.env.POSTGRES_PASSWORD ?? "admin",
  database: process.env.POSTGRES_DB ?? "db",
  entities: [Post, User],
  logging: !__prod__,
  synchronize: !__prod__,
};
