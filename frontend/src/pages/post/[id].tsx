import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
import NextLink from "next/link";

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
  const router = useRouter();
  const [{ data: postData, fetching: postFetching }] = usePostQuery({
    variables: {
      id: typeof router.query.id === "string" ? parseInt(router.query.id) : -1,
    },
  });

  const [{ data: meData }] = useMeQuery();

  if (!postFetching && postData?.post) {
    const { id, title, text, points, creatorId } = postData.post;
    return (
      <Layout>
        {id ? (
          <Box mx={2} p={4} shadow="md" borderWidth="1px">
            {meData?.me && meData.me.id == creatorId ? (
              <Flex justifyContent="flex-end">
                <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
                  <Button
                    as="a"
                    leftIcon={<EditIcon />}
                    colorScheme="purple"
                    size="sm"
                    variant="outline"
                  >
                    edit post
                  </Button>
                </NextLink>
              </Flex>
            ) : null}
            <Heading textAlign="center" mt={2}>
              {title}
            </Heading>
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
