import { Link } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React from "react";
import Layout from "../components/Layout";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import createUrqlClient from "../utils/_createUrqlClient";
import { isServer } from "../utils/_isServer";

interface IndexProps {}

const Index: React.FC<IndexProps> = ({}) => {
  const [{ data: meData, fetching: meFetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ data: postsData, fetching: postsFetching }, posts] = usePostsQuery({
    variables: { limit: 10 },
  });
  return (
    <Layout>
      {!meFetching && meData?.me ? (
        <NextLink href="/create-post">
          <Link>+create post</Link>
        </NextLink>
      ) : null}

      {postsFetching && <div>loading...</div>}
      {postsData?.posts &&
        postsData?.posts.map(({ id, title, text }) => (
          <div key={id}>
            {title}: {text}
          </div>
        ))}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
