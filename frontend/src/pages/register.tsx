import { Box, Button, Flex, Link, Spacer, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { useRegisterUserMutation } from "../generated/graphql";
import { addServerErrors } from "../utils/addServerErrors";
import createUrqlClient from "../utils/createUrqlClient";

interface RegisterProps {}

interface FormData {
  username: string;
  email: string;
  password: string;
}

const Register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter();
  const {
    handleSubmit,
    errors,
    register,
    setError,
    formState,
  } = useForm<FormData>();
  const [, registerUser] = useRegisterUserMutation();

  async function onSubmit(values: FormData) {
    const response = await registerUser({ userInput: values });
    if (response.error?.graphQLErrors[0].extensions?.fieldErrors) {
      addServerErrors(
        response.error.graphQLErrors[0].extensions.fieldErrors,
        setError
      );
    } else if (response.data?.registerUser) {
      router.push("/");
    } else {
      console.error("Received an error: ", response.error);
    }
  }

  const { isSubmitting } = formState;

  return (
    <Layout showUser={false}>
      <Box mt={8} maxWidth={400} mx={"auto"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="username"
            register={register}
            errors={errors}
            variant="username"
          />
          <Box mt={4}>
            <InputField
              label="email"
              register={register}
              errors={errors}
              variant="email"
            />
          </Box>
          <Box mt={4}>
            <InputField
              label="password"
              register={register}
              errors={errors}
              variant="password"
            />
          </Box>
          <Flex mt={2} alignItems={"baseline"}>
            <Spacer />
            <Text mr={4}>
              already registered?{" "}
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
              login
            </Button>
          </Flex>
        </form>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
