import { Box, Button, Flex, Link, Spacer, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { FieldError, useRegisterUserMutation } from "../generated/graphql";
import createUrqlClient from "../utils/_createUrqlClient";

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
    const response = await registerUser(values);
    if (response.data?.registerUser.errors) {
      addServerErrors(response.data.registerUser.errors, setError);
    } else if (response.data?.registerUser.user) {
      router.push("/");
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
              bg="purple.500"
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

function addServerErrors<T>(
  errors: FieldError[],
  setError: (
    fieldName: keyof T,
    error: { type: string; message: string }
  ) => void
) {
  return errors.forEach(({ field, message }) => {
    setError(field as keyof T, {
      type: "server",
      message: message,
    });
  });
}
