import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";

export const requireAuth: MiddlewareFn<MyContext> = async (
  { context: { req } },
  next
) => {
  if (!req.session.userId)
    return {
      errors: [
        {
          // TODO change to an attempt response when handling is completed client side
          field: "title",
          message: "not logged in",
        },
      ],
    };
  return next();
};
