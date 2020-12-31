import { Box } from "@chakra-ui/react";
import React from "react";
import NavBar from "../components/NavBar";
import Head from "next/head";

interface LayoutProps {
  showUser?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showUser = true }) => {
  return (
    <>
      <Head>
        <title>Post-Feed</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box w="100%">
        {showUser ? <NavBar /> : <NavBar showUser={false} />}
        <Box mx="auto" maxWidth={[null, null, 700]}>
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
