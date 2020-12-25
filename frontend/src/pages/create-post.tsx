import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Link,
  Spacer,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { FieldError, useCreatePostMutation } from "../generated/graphql";
import createUrqlClient from "../utils/_createUrqlClient";
import useRequireAuth from "../utils/_useRequireAuth";

interface CreatePostProps {}

interface FormData {
  title: string;
  text: string;
}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
  const router = useRouter();
  // will redirect if user is not logged in
  useRequireAuth();
  const {
    handleSubmit,
    errors,
    register,
    setError,
    formState,
  } = useForm<FormData>();
  const [, createPost] = useCreatePostMutation();

  async function onSubmit(values: FormData) {
    const response = await createPost({ postInput: values });
    console.log(response.data);
    if (response.data?.createPost.errors) {
      addServerErrors(response.data.createPost.errors, setError);
    } else if (response.data?.createPost.post) {
      router.push("/");
    }
  }

  const { isSubmitting } = formState;

  return (
    <Layout>
      <Box mt={8} maxWidth={400} mx={"auto"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField label="title" register={register} errors={errors} />
          <Box mt={4}>
            <FormControl isInvalid={!!errors["text"]}>
              <FormLabel htmlFor="text">text</FormLabel>
              <Textarea
                name="text"
                placeholder="enter text for your post"
                ref={register({
                  required: {
                    value: true,
                    message: "field is required",
                  },
                  minLength: {
                    value: 1,
                    message: "Minimum length is 1",
                  },
                })}
              />
              <FormErrorMessage>
                {!!errors["text"] && errors["text"].message}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Flex mt={2} alignItems={"baseline"}>
            <Spacer />
            <Text mr={4}>
              <NextLink href="/">
                <Link>cancel</Link>
              </NextLink>
            </Text>
            <Button
              mt={4}
              colorScheme="purple"
              color="whitesmoke"
              isLoading={isSubmitting}
              type="submit"
            >
              create
            </Button>
          </Flex>
        </form>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);

function addServerErrors<T>(
  errors: FieldError[],
  setError: (
    fieldName: keyof T,
    error: { type: string; message: string }
  ) => void
) {
  return errors.forEach(({ field, message }) => {
    setError(field as keyof T, {
      type: "server",
      message: message,
    });
  });
}
