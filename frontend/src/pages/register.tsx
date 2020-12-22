import { Box, Button, Container } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import InputField from "../components/InputField";
import { FieldError, useRegisterUserMutation } from "../generated/graphql";

interface RegisterProps {}

interface FormData {
  username: string;
  password: string;
}

const Register: React.FC<RegisterProps> = ({}) => {
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
    }
    return response.data?.registerUser.user;
  }

  const { isSubmitting } = formState;

  return (
    <Container mt={8}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="username"
          register={register}
          errors={errors}
          registerOptions={{
            required: true,
            minLength: {
              value: 2,
              message: "Minimum length is 2",
            },
          }}
        />
        <Box mt={4}>
          <InputField
            label="password"
            register={register}
            errors={errors}
            registerOptions={{
              required: true,
              minLength: {
                value: 6,
                message: "Minimum length is 6",
              },
            }}
            type="password"
          />
        </Box>
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;

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
