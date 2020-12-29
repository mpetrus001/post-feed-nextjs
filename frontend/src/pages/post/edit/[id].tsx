import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Spacer,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Layout from "../../../components/Layout";
import {
  useDeletePostMutation,
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { addServerErrors } from "../../../utils/addServerErrors";
import createUrqlClient from "../../../utils/createUrqlClient";
import useRequireAuth from "../../../utils/useRequireAuth";

interface PostEditProps {}

interface FormData {
  id: string;
  title: string;
  text: string;
}

const PostEdit: React.FC<PostEditProps> = ({}) => {
  // will redirect if user is not logged in
  useRequireAuth();

  const router = useRouter();
  const [{ data: postData, fetching: postFetching }] = usePostQuery({
    variables: {
      id: typeof router.query.id === "string" ? parseInt(router.query.id) : -1,
    },
  });

  const {
    handleSubmit,
    errors,
    register,
    setError,
    formState,
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    reset({
      id: postData?.post?.id.toString(),
      title: postData?.post?.title,
      text: postData?.post?.text,
    });
  }, [postData]);

  const [{ fetching: deleteFetching }, deletePost] = useDeletePostMutation();

  const [, updatePost] = useUpdatePostMutation();

  const handleDeletePost = async (id: number) => {
    const response = await deletePost({ id });
    if (response.data?.deletePost) {
      router.push("/");
    } else {
      console.error("post failed to delete");
    }
  };

  async function onSubmit(values: FormData) {
    const { id, ...postValues } = values;
    const response = await updatePost({
      id: parseInt(id),
      postInput: postValues,
    });
    if (response.error?.graphQLErrors[0].extensions?.fieldErrors) {
      addServerErrors(
        response.error.graphQLErrors[0].extensions.fieldErrors,
        setError
      );
    } else if (response.data?.updatePost) {
      router.push(postData?.post?.id ? `/post/${postData?.post?.id}` : "/");
    } else {
      console.error("Received an error: ", response.error);
    }
  }

  if (!postFetching && postData?.post) {
    const { id } = postData.post;
    return (
      <Layout>
        {id ? (
          <Box mx={[2, 2, 0]} p={4} shadow="md" borderWidth="1px">
            <Flex justifyContent="flex-end">
              <Button
                leftIcon={<DeleteIcon />}
                colorScheme="red"
                size="sm"
                onClick={() => handleDeletePost(id)}
                isLoading={deleteFetching}
              >
                delete post
              </Button>
            </Flex>

            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={!!errors["id"]}>
                <FormLabel htmlFor="id" hidden={true}>
                  id
                </FormLabel>
                <Input
                  name="id"
                  init={id}
                  isReadOnly={true}
                  hidden={true}
                  ref={register({
                    required: true,
                  })}
                />
                <FormErrorMessage>
                  {!!errors["id"] && errors["id"].message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors["title"]}>
                <FormLabel htmlFor="title">title</FormLabel>
                <Input
                  name="title"
                  ref={register({
                    minLength: {
                      value: 1,
                      message: "Minimum length is 1",
                    },
                  })}
                />
                <FormErrorMessage>
                  {!!errors["title"] && errors["title"].message}
                </FormErrorMessage>
              </FormControl>
              <Box mt={4}>
                <FormControl isInvalid={!!errors["text"]}>
                  <FormLabel htmlFor="text">text</FormLabel>
                  <Textarea
                    name="text"
                    ref={register({
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
                  <NextLink
                    href={
                      postData?.post?.id ? `/post/${postData?.post?.id}` : "/"
                    }
                  >
                    <Link>cancel</Link>
                  </NextLink>
                </Text>
                <Button
                  mt={4}
                  colorScheme="purple"
                  color="whitesmoke"
                  isLoading={formState.isSubmitting}
                  type="submit"
                >
                  update
                </Button>
              </Flex>
            </form>
          </Box>
        ) : null}
      </Layout>
    );
  }
  if (postFetching && !postData?.post) {
    return (
      <Layout>
        <Box>
          <Text>loading...</Text>
        </Box>
      </Layout>
    );
  }
  return (
    <Layout>
      <Box>
        <Text>error occured</Text>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(PostEdit);
