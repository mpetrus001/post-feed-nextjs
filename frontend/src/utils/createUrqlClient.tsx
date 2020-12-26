import { Cache, cacheExchange, QueryInput } from "@urql/exchange-graphcache";
import Router from "next/router";
import { dedupExchange, Exchange, fetchExchange } from "urql";
import { pipe, tap } from "wonka";
import {
  LoginUserMutation,
  LogoutUserMutation,
  MeDocument,
  MeQuery,
  RegisterUserMutation,
} from "../generated/graphql";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      // creates a "global" error handler to route to Login if user is not authenticated
      if (error) {
        if (error.message.includes("must be authenticated")) {
          return Router.replace("/login");
        }
      }
    })
  );
};

const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: { credentials: "include" as const },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      updates: {
        Mutation: {
          registerUser: (_result, args, cache, info) => {
            typedUpdateQuery<RegisterUserMutation, MeQuery>(
              cache,
              {
                query: MeDocument,
              },
              _result,
              (result, query) => {
                return {
                  me: result.registerUser,
                };
              }
            );
          },
          loginUser: (_result, args, cache, info) => {
            typedUpdateQuery<LoginUserMutation, MeQuery>(
              cache,
              {
                query: MeDocument,
              },
              _result,
              (result, query) => {
                return {
                  me: result.loginUser,
                };
              }
            );
          },
          logoutUser: (_result, args, cache, info) => {
            typedUpdateQuery<LogoutUserMutation, MeQuery>(
              cache,
              {
                query: MeDocument,
              },
              _result,
              (result, query) => {
                return {
                  me: null,
                };
              }
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});

export default createUrqlClient;

// added for improved typing
function typedUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}
