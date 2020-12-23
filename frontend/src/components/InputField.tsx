import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import React, { InputHTMLAttributes } from "react";
import { RegisterOptions } from "react-hook-form";

const InputField: React.FC<InputFieldProps> = ({
  label,
  register,
  errors,
  variant,
}) => {
  if (variant === "username") {
    return (
      <FormControl isInvalid={!!errors[label]}>
        <FormLabel htmlFor={label}>{label}</FormLabel>
        <Input
          name={label}
          placeholder={label}
          ref={register({
            required: {
              value: true,
              message: "Username is required",
            },
            minLength: {
              value: 2,
              message: "Minimum length is 2",
            },
          })}
        />
        <FormErrorMessage>
          {!!errors[label] && errors[label].message}
        </FormErrorMessage>
      </FormControl>
    );
  }
  if (variant === "password") {
    return (
      <FormControl isInvalid={!!errors[label]}>
        <FormLabel htmlFor={label}>{label}</FormLabel>
        <Input
          name={label}
          placeholder={label}
          ref={register({
            required: {
              value: true,
              message: "Password is required",
            },
            minLength: {
              value: 6,
              message: "Minimum length is 6",
            },
          })}
          type="password"
        />
        <FormErrorMessage>
          {!!errors[label] && errors[label].message}
        </FormErrorMessage>
      </FormControl>
    );
  }
  return (
    <FormControl isInvalid={!!errors[label]}>
      <FormLabel htmlFor={label}>{label}</FormLabel>
      <Input name={label} placeholder={label} ref={register({})} />
      <FormErrorMessage>
        {!!errors[label] && errors[label].message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default InputField;

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: (registerOptions: RegisterOptions) => RefReturn;
  // TODO find better type for errors as it relies on FormData
  errors: any;
  variant?: "username" | "password";
}

type RefReturn =
  | string
  | ((instance: HTMLInputElement | null) => void)
  | React.RefObject<HTMLInputElement>
  | null
  | undefined;
