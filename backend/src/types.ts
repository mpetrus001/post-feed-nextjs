import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
import Redis from "ioredis";

export type MyContext = {
  orm: EntityManager<IDatabaseDriver<Connection>>;
  redis: Redis.Redis;
  req: Request;
  res: Response;
};

declare module "express-session" {
  interface Session {
    userId: number;
  }
}
