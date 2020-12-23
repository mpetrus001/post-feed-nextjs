import { Box, Button, Flex, Link, Spacer, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import InputField from "../components/InputField";
import { FieldError, useResetPasswordMutation } from "../generated/graphql";
import createUrqlClient from "./_createUrqlClient";

interface ResetPasswordProps {}

interface FormData {
  email: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({}) => {
  const router = useRouter();
  const {
    handleSubmit,
    errors,
    register,
    setError,
    formState,
  } = useForm<FormData>();
  const [, resetPassword] = useResetPasswordMutation();

  async function onSubmit(values: FormData) {
    const response = await resetPassword(values);
    if (response.data?.resetPassword.errors) {
      addServerErrors(response.data.resetPassword.errors, setError);
    } else {
      router.push("/");
    }
  }

  const { isSubmitting } = formState;

  return (
    <Box mt={8} maxWidth={400} mx={"auto"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="email"
          register={register}
          errors={errors}
          variant="email"
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
            bg="purple.500"
            color="whitesmoke"
            isLoading={isSubmitting}
            type="submit"
          >
            reset
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default withUrqlClient(createUrqlClient)(ResetPassword);

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
