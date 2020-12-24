import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./constants";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import cors from "cors";
import { createConnection } from "typeorm";
import ormconfig from "./typeorm.config";
import { User } from "./entities/User";
import { Post } from "./entities/Post";

const main = async () => {
  // typeorm interfaces with the postgres database
  // and creates database tables based on the Entities in the config
  console.log(ormconfig);
  const dbConnection = await createConnection(ormconfig);
  const UserRepository = dbConnection.getRepository(User);
  const PostRepository = dbConnection.getRepository(Post);

  const app = express();

  app.use(
    cors({
      origin: /localhost/,
      credentials: true,
    })
  );

  // express-session connects to Redis to store user information
  const RedisStore = connectRedis(session);
  const redisClient = new Redis();

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      name: COOKIE_NAME,
      // TODO change to env variable
      secret: "__secret-redis__",
      resave: false,
      saveUninitialized: false,
      // redis also stores cookie config which is set with express-session
      // cookies are stored in the browser and auto-added to requests
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // one year
        httpOnly: true, // can't access cookie client-side
        secure: __prod__, // only works in https
        sameSite: "lax",
      },
    })
  );

  // Apollo receives the GraphQL requests and maps them to resolvers
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    // context is available in each resolver
    context: ({ req, res }): MyContext => ({
      orm: { UserRepository, PostRepository },
      redis: redisClient,
      req,
      res,
    }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server listening on port 4000");
  });
};

main();
