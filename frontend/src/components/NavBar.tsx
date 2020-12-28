import { Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutUserMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {
  showUser?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ showUser = true }) => {
  const [{ data: meData, fetching: meFetching }] = useMeQuery();
  const [
    { fetching: logoutUserFetching },
    logoutUser,
  ] = useLogoutUserMutation();

  return (
    <Flex
      bg="purple.500"
      p={4}
      ml={"auto"}
      justifyContent={"space-between"}
      alignItems={"center"}
      color={"whitesmoke"}
      mb={4}
    >
      <NextLink href="/">
        <Heading cursor="pointer">Reddit-Clone</Heading>
      </NextLink>
      {!showUser || !!meFetching ? null : meData?.me ? (
        <Flex>
          <Text>{meData.me.username}</Text>
          <NextLink href="/create-post">
            <Link ml={2}>+create post</Link>
          </NextLink>
          <Button
            variant="link"
            ml={2}
            onClick={() => logoutUser()}
            isLoading={logoutUserFetching}
          >
            logout
          </Button>
        </Flex>
      ) : (
        <NextLink href="/login">
          <Link>Login</Link>
        </NextLink>
      )}
    </Flex>
  );
};

export default NavBar;
