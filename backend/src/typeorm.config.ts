import { __prod__ } from "./constants";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export default {
  type: "postgres" as const,
  host: process.env.POSTGRES_HOST ?? "localhost",
  username: process.env.POSTGRES_USER ?? "admin",
  password: process.env.POSTGRES_PASSWORD ?? "admin",
  database: process.env.POSTGRES_DB ?? "db",
  entities: [path.join(__dirname, "./entities/*")],
  migrations: [path.join(__dirname, "./migrations/*")],
  logging: !__prod__,
  synchronize: !__prod__,
};
