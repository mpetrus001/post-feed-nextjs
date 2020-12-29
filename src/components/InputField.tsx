import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
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
        <InputGroup>
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
        </InputGroup>
        <FormErrorMessage>
          {!!errors[label] && errors[label].message}
        </FormErrorMessage>
      </FormControl>
    );
  } else if (variant === "password") {
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
          {!!errors[label] && errors[label].message + "."}
          {!!errors[label] && errors[label].message.includes("token") && (
            <NextLink href="/reset-password">
              <Link ml={1} color={"purple.500"}>
                try again?
              </Link>
            </NextLink>
          )}
        </FormErrorMessage>
      </FormControl>
    );
  } else if (variant === "email") {
    return (
      <FormControl isInvalid={!!errors[label]}>
        <FormLabel htmlFor={label}>{label}</FormLabel>
        <Input
          name={label}
          placeholder={label}
          ref={register({
            required: {
              value: true,
              message: "email is required",
            },
            minLength: {
              value: 6,
              message: "Minimum length is 6",
            },
          })}
          type="email"
        />
        <FormErrorMessage>
          {!!errors[label] && errors[label].message}
        </FormErrorMessage>
      </FormControl>
    );
  } else {
    return (
      <FormControl isInvalid={!!errors[label]}>
        <FormLabel htmlFor={label}>{label}</FormLabel>
        <Input
          name={label}
          placeholder={label}
          ref={register({
            required: {
              value: true,
              message: "field is required",
            },
            minLength: {
              value: 1,
              message: "Minimum length is 1",
            },
          })}
        />
        <FormErrorMessage>
          {!!errors[label] && errors[label].message}
        </FormErrorMessage>
      </FormControl>
    );
  }
};

export default InputField;

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: (registerOptions: RegisterOptions) => RefReturn;
  // TODO find better type for errors as it relies on FormData
  errors: any;
  variant?: "username" | "password" | "email";
}

type RefReturn =
  | string
  | ((instance: HTMLInputElement | null) => void)
  | React.RefObject<HTMLInputElement>
  | null
  | undefined;
