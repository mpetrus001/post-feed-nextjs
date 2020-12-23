import { Box, Button, Text, Link, Flex, Spacer } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import InputField from "../components/InputField";
import { FieldError, useLoginUserMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import NextLink from "next/link";

interface LoginProps {}

interface FormData {
  username: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter();
  const {
    handleSubmit,
    errors,
    register,
    setError,
    formState,
  } = useForm<FormData>();
  const [, loginUser] = useLoginUserMutation();

  async function onSubmit(values: FormData) {
    const response = await loginUser(values);
    if (response.data?.loginUser.errors) {
      addServerErrors(response.data.loginUser.errors, setError);
    } else if (response.data?.loginUser.user) {
      router.push("/");
    }
  }

  const { isSubmitting } = formState;

  return (
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
            label="password"
            register={register}
            errors={errors}
            variant="password"
          />
        </Box>
        <Flex mt={2} alignItems={"baseline"}>
          <Spacer />
          <Text mr={4}>
            not a user?{" "}
            <NextLink href="/register">
              <Link>register</Link>
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
  );
};

export default Login;

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
