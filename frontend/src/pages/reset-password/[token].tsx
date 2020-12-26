import { Box, Button, Flex, Spacer } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import InputField from "../../components/InputField";
import Layout from "../../components/Layout";
import { useChangePasswordMutation } from "../../generated/graphql";
import { addServerErrors } from "../../utils/addServerErrors";
import createUrqlClient from "../../utils/_createUrqlClient";

interface ChangePasswordProps {}

interface FormData {
  password: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = () => {
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
    const response = await changePassword({
      password: values.password,
      token: typeof router.query.token === "string" ? router.query.token : "",
    });
    if (response.error?.graphQLErrors[0].extensions?.fieldErrors) {
      addServerErrors(
        response.error.graphQLErrors[0].extensions.fieldErrors,
        setError
      );
    } else if (response.data?.changePassword) {
      router.push("/");
    } else {
      console.error("Received an error: ", response.error);
    }
  }

  const { isSubmitting } = formState;

  return (
    <Layout>
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

export default withUrqlClient(createUrqlClient)(ChangePassword);
