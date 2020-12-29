import { EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BiDownvote, BiUpvote } from "react-icons/bi";
import Layout from "../../components/Layout";
import {
  useMeQuery,
  usePostQuery,
  useVoteMutation,
  VoteMutationVariables,
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

  const [{ fetching: voteFetching }, vote] = useVoteMutation();

  const [currentVoteVars, setCurrentVoteVars] = useState<
    Partial<VoteMutationVariables>
  >({});

  const submitVote = ({ postId, value }: VoteMutationVariables) => {
    setCurrentVoteVars({ postId, value });
    vote({ postId, value });
  };

  const [{ data: meData }] = useMeQuery();

  if (!postFetching && postData?.post) {
    const { id, title, text, points, creator, vote } = postData.post;
    return (
      <Layout>
        {id ? (
          <Box mx={[2, 2, 0]} p={4} shadow="md" borderWidth="1px">
            {meData?.me && meData.me.id == creator.id ? (
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
            <Flex justifyContent="space-between" mt={4}>
              <Flex>
                <Text>posted by</Text>
                <Text ml={1} as="span" textColor="purple.500" fontWeight="bold">
                  {creator.username}
                </Text>
              </Flex>
              <Flex>
                <Text as="span" textColor="purple.500" fontWeight="bold">
                  {points}
                </Text>
                <Text ml={1}>point{points == 1 ? "" : "s"}</Text>
              </Flex>
            </Flex>
            <Text mt={4}>{text}</Text>
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
