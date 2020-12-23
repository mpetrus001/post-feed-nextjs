import { Box, Button, Flex, Spacer } from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import InputField from "../../components/InputField";
import { FieldError, useChangePasswordMutation } from "../../generated/graphql";
import createUrqlClient from "../_createUrqlClient";

interface ChangePasswordProps {
  token: string;
}

interface FormData {
  password: string;
}

const ChangePassword: NextPage<ChangePasswordProps> = ({ token }) => {
  const router = useRouter();
  const {
    handleSubmit,
    errors,
    register,
    setError,
    formState,
  } = useForm<FormData>();
  const [, changePassword] = useChangePasswordMutation();

  async function onSubmit(values: FormData) {
    // TODO add flash messages to show success/fail states
    const response = await changePassword({ password: values.password, token });
    if (response.data?.changePassword.errors) {
      // TODO flash on errors that are not part of FormData
      addServerErrors(response.data.changePassword.errors, setError);
    } else if (response.data?.changePassword.user) {
      router.push("/");
    }
  }

  const { isSubmitting } = formState;

  return (
    <Box mt={8} maxWidth={400} mx={"auto"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="password"
          register={register}
          errors={errors}
          variant="password"
        />
        <Flex mt={2} alignItems={"baseline"}>
          <Spacer />
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

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

// implement fix of this "as React.FC" when types are fixed
export default withUrqlClient(createUrqlClient)(ChangePassword as React.FC);

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
