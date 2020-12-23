import { Box, Flex, Heading, Link, Text, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();

  return (
    <Flex
      bg="purple.500"
      p={4}
      ml={"auto"}
      justifyContent={"space-between"}
      alignItems={"center"}
      color={"whitesmoke"}
    >
      <Heading>Reddit-Clone</Heading>
      {!!fetching ? null : data?.me ? (
        <Flex>
          <Text>Hello, {data.me.username}</Text>
          <Button variant="link" ml={2}>
            logout
          </Button>
        </Flex>
      ) : (
        <Box>
          <NextLink href="/login">
            <Link>Login</Link>
          </NextLink>
        </Box>
      )}
    </Flex>
  );
};

export default NavBar;
