import { Box, Button, Container } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import InputField from "../components/InputField";

interface RegisterProps {}

interface FormData {
  username: string;
}

const Register: React.FC<RegisterProps> = ({}) => {
  const { handleSubmit, errors, register, formState } = useForm<FormData>();

  function onSubmit(values) {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        resolve(true);
      }, 1000);
    });
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
