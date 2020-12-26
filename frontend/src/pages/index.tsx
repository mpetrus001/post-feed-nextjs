import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import Layout from "../components/Layout";
import { PostsQueryVariables, usePostsQuery } from "../generated/graphql";
import createUrqlClient from "../utils/_createUrqlClient";

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

type PageProps = {
  variables: PostsQueryVariables;
  isLastPage: boolean;
  onLoadMore: (cursor: string) => void;
};

const Page = ({ variables, isLastPage, onLoadMore }: PageProps) => {
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  return (
    <>
      <Stack spacing={8} mb={8}>
        {data?.posts.posts.map((post) =>
          !post ? null : (
            <Box key={post.id} p={4} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
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

// const Index: React.FC<IndexProps> = ({}) => {
//   const [postsPageInfo, setpostsPageInfo] = useState({
//     skip: 0,
//     take: 10,
//   });
//   const [{ data: postsData, fetching: postsFetching }] = usePostsQuery({
//     variables: { ...postsPageInfo },
//   });
//   return (
//     <Layout>
//       <Stack mt={2} mb={6}>
//         {postsFetching && !postsData?.posts && (
//           <Box p={4} shadow="md" borderWidth="1px">
//             <Text>loading...</Text>
//           </Box>
//         )}
//         {!postsFetching && !postsData?.posts && (
//           <Box p={4} shadow="md" borderWidth="1px">
//             <Text>something failed 😢</Text>
//           </Box>
//         )}
//         {!postsFetching &&
//           postsData?.posts &&
//           postsData?.posts.map(({ id, title, textSnippet }) => (
//             <Box key={id} p={4} shadow="md" borderWidth="1px">
//               <Heading fontSize="xl">{title}</Heading>
//               <Text mt={4}>{textSnippet}</Text>
//             </Box>
//           ))}
//       </Stack>
//       <Flex justifyContent="center" mb={6}>
//         <Button
//           isLoading={postsFetching}
//           colorScheme="purple"
//           color="whitesmoke"
//           onClick={() =>
//             setpostsPageInfo({
//               skip: postsPageInfo.skip + postsPageInfo.take,
//               take: 10,
//             })
//           }
//         >
//           load more
//         </Button>
//       </Flex>
//     </Layout>
//   );
// };

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
