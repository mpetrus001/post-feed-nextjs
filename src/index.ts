import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import express from "express";

const main = async () => {
  const orm = await MikroORM.init(); // uses config from src/mikro-orm.config.ts
  await orm.getMigrator().up(); // runs the latest migration

  const app = express();

  app.get("/", (_, res) => {
    res.end("hello, world!");
  });

  app.listen(4000, () => {
    console.log("server listening on port 4000");
  });
};

main();
