import { ObjectType, Field } from "type-graphql";

// set up custom types for server responses
@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}
