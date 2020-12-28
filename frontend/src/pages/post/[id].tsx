import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import {
  useDeletePostMutation,
  useMeQuery,
  usePostQuery,
} from "../../generated/graphql";
import createUrqlClient from "../../utils/createUrqlClient";

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
  const router = useRouter();
  const [{ data: postData, fetching: postFetching }] = usePostQuery({
    variables: {
      id: typeof router.query.id === "string" ? parseInt(router.query.id) : -1,
    },
  });

  const [{ data: meData }] = useMeQuery();

  const [
    { data: deleteResponse, fetching: deleteFetching },
    deletePost,
  ] = useDeletePostMutation();

  const handleDeletePost = async (id: number) => {
    const response = await deletePost({ id });
    if (response.data?.deletePost) {
      router.push("/");
    } else {
      console.error("post failed to delete");
    }
  };

  if (!postFetching && postData?.post) {
    const { id, title, text, points, creatorId } = postData.post;
    return (
      <Layout>
        {id ? (
          <Box mx={2} p={4} shadow="md" borderWidth="1px">
            {meData?.me && meData.me.id == creatorId ? (
              <Flex justifyContent="flex-end">
                <Button
                  leftIcon={<DeleteIcon />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeletePost(id)}
                >
                  delete post
                </Button>
              </Flex>
            ) : null}
            <Heading textAlign="center">{title}</Heading>
            <Flex>
              <Text>{points} points</Text>
            </Flex>

            <Text mt={4}>{text}</Text>
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

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
