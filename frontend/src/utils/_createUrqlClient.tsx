import { Cache, cacheExchange, QueryInput } from "@urql/exchange-graphcache";
import Router from "next/router";
import { dedupExchange, Exchange, fetchExchange } from "urql";
import { pipe, tap } from "wonka";
import {
  CreatePostMutation,
  LoginUserMutation,
  LogoutUserMutation,
  MeDocument,
  MeQuery,
  PostsDocument,
  PostsQuery,
  RegisterUserMutation,
} from "../generated/graphql";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      // creates a "global" error handler to route to Login if user is not authenticated
      if (error) {
        if (error.message.includes("not authenticated")) {
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
                if (result.registerUser.errors) {
                  return query;
                } else {
                  return {
                    me: result.registerUser.user,
                  };
                }
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
                if (result.loginUser.errors) {
                  return query;
                } else {
                  return {
                    me: result.loginUser.user,
                  };
                }
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
          // createPost: (_result, args, cache, info) => {
          //   typedUpdateQuery<CreatePostMutation, PostsQuery>(
          //     cache,
          //     {
          //       query: PostsDocument,
          //       variables: { limit: 10 },
          //     },
          //     _result,
          //     (result, query) => {
          //       // query might be null when redirected back to createPost from useRequireAuth
          //       if (
          //         !result.createPost.errors &&
          //         result.createPost.post &&
          //         query
          //       ) {
          //         query.posts.unshift(result.createPost.post);
          //         return query;
          //       } else {
          //         return query;
          //       }
          //     }
          //   );
          // },
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
