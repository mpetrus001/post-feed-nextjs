import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import createUrqlClient from "../utils/_createUrqlClient";
import { isServer } from "../utils/_isServer";

interface IndexProps {}

const Index: React.FC<IndexProps> = ({}) => {
  const [{ data: meData, fetching: meFetching }] = useMeQuery({
    pause: isServer(),
  });
  const [postsQueryVars, setPostsQueryArgs] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data: postsData, fetching: postsFetching }, posts] = usePostsQuery({
    variables: { ...postsQueryVars },
  });
  return (
    <Layout>
      {!meFetching && meData?.me ? (
        <NextLink href="/create-post">
          <Link>+create post</Link>
        </NextLink>
      ) : null}

      <Stack mt={2} mb={6}>
        {postsFetching && !postsData?.posts && (
          <Box p={4} shadow="md" borderWidth="1px">
            <Text mt={4}>Loading...</Text>
          </Box>
        )}
        {!postsFetching && !postsData?.posts && (
          <Box p={4} shadow="md" borderWidth="1px">
            <Text mt={4}>something failed 😢</Text>
          </Box>
        )}
        {!postsFetching &&
          postsData?.posts &&
          postsData?.posts.map(({ id, title, textSnippet }) => (
            <Box key={id} p={4} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{title}</Heading>
              <Text mt={4}>{textSnippet}</Text>
            </Box>
          ))}
      </Stack>
      {postsData?.posts && (
        <Flex justifyContent="center" mb={6}>
          <Button
            isLoading={postsFetching}
            colorScheme="purple"
            color="whitesmoke"
            onClick={() =>
              setPostsQueryArgs({
                limit: 10,
                cursor: postsData.posts[postsData.posts.length - 1].createdAt,
              })
            }
          >
            load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
