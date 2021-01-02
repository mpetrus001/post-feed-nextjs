import {
  Box,
  Button,
  Flex,
  Link,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
// import { useResetPasswordMutation } from "../generated/graphql";
// import { addServerErrors } from "../utils/addServerErrors";
import createUrqlClient from "../utils/createUrqlClient";

interface ResetPasswordProps {}

interface FormData {
  username: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({}) => {
  const router = useRouter();
  const toast = useToast();
  const {
    handleSubmit,
    errors,
    register,
    setError,
    formState,
  } = useForm<FormData>();

  async function onSubmit(values: FormData) {
    // Removed ability to reset password for security reasons
    toast({
      title: "Action disabled.",
      description:
        "The ability to reset passwords has been disabled for security reasons. Thank you for trying!",
      status: "warning",
      duration: 8000,
      isClosable: true,
      position: "top",
    });
    setTimeout(() => {
      router.replace("/");
    }, 8500);
  }

  const { isSubmitting } = formState;

  return (
    <Layout>
      <Box mt={8} maxWidth={400} mx={"auto"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="username"
            register={register}
            errors={errors}
            variant="username"
          />
          <Flex mt={2} alignItems={"baseline"}>
            <Spacer />
            <Text mr={4}>
              remember now?{" "}
              <NextLink href="/login">
                <Link>login</Link>
              </NextLink>
            </Text>
            <Button
              mt={4}
              colorScheme="purple"
              color="whitesmoke"
              isLoading={isSubmitting}
              type="submit"
            >
              reset
            </Button>
          </Flex>
        </form>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ResetPassword);
