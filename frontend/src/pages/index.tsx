import { Link } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React from "react";
import Layout from "../components/Layout";
import NavBar from "../components/NavBar";
import { isServer } from "../components/_isServer";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import createUrqlClient from "./_createUrqlClient";

interface IndexProps {}

const Index: React.FC<IndexProps> = ({}) => {
  const [{ data: meData, fetching: meFetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ data: postsData, fetching: postsFetching }, posts] = usePostsQuery();
  return (
    <Layout>
      {!!meFetching ? null : meData?.me ? (
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
