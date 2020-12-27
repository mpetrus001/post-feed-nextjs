import { Request, Response } from "express";
import Redis from "ioredis";
import { Connection, Repository } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export type MyContext = {
  orm: MyOrm;
  redis: Redis.Redis;
  req: Request;
  res: Response;
};

declare module "express-session" {
  interface Session {
    userId: number;
  }
}

type MyOrm = {
  DB: Connection;
  UserRepository: Repository<User>;
  PostRepository: Repository<Post>;
};
