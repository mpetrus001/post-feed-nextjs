import { withUrqlClient } from "next-urql";
import React from "react";
import NavBar from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import createUrqlClient from "./_createUrqlClient";

interface IndexProps {}

const Index: React.FC<IndexProps> = ({}) => {
  const [{ data: postsData, fetching: postsFetching }, posts] = usePostsQuery();
  return (
    <>
      <NavBar />
      {postsFetching && <div>loading...</div>}
      {postsData?.posts.map(({ id, title }) => (
        <div key={id}>{title}</div>
      ))}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
