import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";

export type MyContext = {
  orm: EntityManager<IDatabaseDriver<Connection>>;
  req: Request;
  res: Response;
};

declare module "express-session" {
  interface Session {
    userId: number;
  }
}
