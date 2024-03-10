import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";

interface Props {
  id: string;
  error: string | null;
  label: string;
  loading: boolean;
  type: string;
}

export default function FormInput({ error, label, loading, ...field }: Props) {
  const [error_message, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(error);
    return () => {
      setError(null);
    };
  }, [error]);

  return (
    <FormControl
      key={field.id}
      isInvalid={Boolean(error_message)}
      className="md:grid grid-cols-12 items-center"
    >
      <FormLabel
        gridColumn={{ md: "1/4" }}
        color={"white"}
        margin={{ md: 0 }}
        htmlFor={field.id}
      >
        {label}
      </FormLabel>
      <Box gridColumn={{ md: "4/13" }}>
        <Input
          bg={"white"}
          {...field}
          name={field.id}
          disabled={loading}
          onChange={() => {
            setError(null);
          }}
        />
        <FormErrorMessage textTransform={"capitalize"}>
          {error_message}
        </FormErrorMessage>
      </Box>
    </FormControl>
  );
}
