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
  type = "text",
  registerOptions,
  register,
  errors,
}) => (
  <FormControl isInvalid={!!errors[label]}>
    <FormLabel htmlFor={label}>{label}</FormLabel>
    <Input
      name={label}
      placeholder={label}
      ref={register(registerOptions)}
      type={type}
    />
    <FormErrorMessage>
      {!!errors[label] && errors[label].message}
    </FormErrorMessage>
  </FormControl>
);

export default InputField;

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  registerOptions?: RegisterOptions;
  register: (registerOptions: RegisterOptions) => RefReturn;
  // TODO find better type for errors as it relies on FormData
  errors: any;
}

type RefReturn =
  | string
  | ((instance: HTMLInputElement | null) => void)
  | React.RefObject<HTMLInputElement>
  | null
  | undefined;
