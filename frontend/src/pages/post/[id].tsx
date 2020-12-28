import { Box, Heading, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import createUrqlClient from "../../utils/createUrqlClient";

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
  const router = useRouter();
  const [{ data: postData, fetching: postFetching }] = usePostQuery({
    variables: { id: parseInt(router.query.id as string) },
  });
  if (!postFetching && postData?.post) {
    const { title, text } = postData.post;
    return (
      <Layout>
        <Box>
          <Heading>{title}</Heading>
          <Text>{text}</Text>
        </Box>
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
