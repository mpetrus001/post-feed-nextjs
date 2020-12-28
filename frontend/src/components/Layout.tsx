import { Box, Container } from "@chakra-ui/react";
import React from "react";
import NavBar from "../components/NavBar";

interface LayoutProps {
  showUser?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showUser = true }) => {
  return (
    <Box mx="auto" w="100%">
      {showUser ? <NavBar /> : <NavBar showUser={false} />}
      {children}
    </Box>
  );
};

export default Layout;
