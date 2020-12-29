import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { BiDownvote, BiUpvote } from "react-icons/bi";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import Layout from "../components/Layout";
import {
  PostsQueryVariables,
  usePostsQuery,
  useVoteMutation,
  VoteMutationVariables,
} from "../generated/graphql";
import createUrqlClient from "../utils/createUrqlClient";
import NextLink from "next/link";

interface IndexProps {}

const limit = 15;

const Index = () => {
  const [pageVariables, setPageVariables] = useState([
    {
      limit,
      cursor: null as null | string,
    },
  ]);

  return (
    <Layout>
      {pageVariables.map((variables, i) => {
        return (
          <Page
            key={"" + variables.cursor}
            variables={variables}
            isLastPage={i === pageVariables.length - 1}
            onLoadMore={(cursor) =>
              setPageVariables([...pageVariables, { cursor, limit }])
            }
          />
        );
      })}
    </Layout>
  );
};

// incorporated from Ben Awad's improved pagination approach
type PageProps = {
  variables: PostsQueryVariables;
  isLastPage: boolean;
  onLoadMore: (cursor: string) => void;
};

const Page = ({ variables, isLastPage, onLoadMore }: PageProps) => {
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  const [{ fetching: voteFetching }, vote] = useVoteMutation();

  const [currentVoteVars, setCurrentVoteVars] = useState<
    Partial<VoteMutationVariables>
  >({});

  const submitVote = ({ postId, value }: VoteMutationVariables) => {
    setCurrentVoteVars({ postId, value });
    vote({ postId, value });
  };

  return (
    <>
      <Stack spacing={6} mb={6} px={[2, 2, 0]}>
        {data?.posts.posts.map(
          ({ id, title, textSnippet, creator, points, vote }) =>
            !id ? null : (
              <Box key={id} p={4} shadow="md" borderWidth="1px">
                <Text fontSize="sm">@{creator.username}</Text>
                <NextLink href="/post/[id]" as={`/post/${id}`}>
                  <Heading
                    fontSize="xl"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                  >
                    {title}
                  </Heading>
                </NextLink>
                <Text mt={2}>{textSnippet}</Text>
                <Flex mt={4} alignItems="center" alignContent="center">
                  <IconButton
                    icon={<BiDownvote />}
                    variant="outline"
                    colorScheme={vote?.value == -1 ? "red" : "purple"}
                    size="xs"
                    aria-label="down vote"
                    onClick={() => submitVote({ postId: id, value: -1 })}
                    isLoading={
                      voteFetching &&
                      currentVoteVars.postId == id &&
                      currentVoteVars.value == -1
                    }
                  ></IconButton>
                  <Text mx={2}>{points}</Text>
                  <IconButton
                    icon={<BiUpvote />}
                    variant="outline"
                    colorScheme={vote?.value == 1 ? "green" : "purple"}
                    size="xs"
                    aria-label="up vote"
                    onClick={() => submitVote({ postId: id, value: 1 })}
                    isLoading={
                      voteFetching &&
                      currentVoteVars.postId == id &&
                      currentVoteVars.value == 1
                    }
                  ></IconButton>
                </Flex>
              </Box>
            )
        )}
      </Stack>
      {(isLastPage && fetching) || (isLastPage && data?.posts.hasMore) ? (
        <Flex>
          <Button
            onClick={() => {
              if (data?.posts) {
                onLoadMore(
                  data.posts.posts[data.posts.posts.length - 1].createdAt
                );
              }
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
