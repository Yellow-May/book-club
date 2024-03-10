import { useEffect } from "react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  Link as RouteLink,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { Box, Button, Link, Text, useToast } from "@chakra-ui/react";
import type { LoginForm } from "~/utils/types.server";
import { login } from "~/utils/auth.server";
import { login_fields } from "../auth/config";
import FormInput from "../auth/_components/FormInput";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const { email, password } = Object.fromEntries(form);
  const values = { email, password } as LoginForm;
  const errors = { email: "", password: "" } as LoginForm;

  Object.keys(values).forEach((key) => {
    if (!values[key as keyof LoginForm]) {
      errors[key as keyof LoginForm] = `${key} is required`;
    }
  });

  const has_error = Object.keys(errors).reduce(
    (_, b) => Boolean(errors?.[b as keyof LoginForm]),
    false
  );

  if (has_error) {
    return json(
      { error: "Invalid form data", errors, fields: values },
      { status: 400 }
    );
  }

  const redirect_to = new URL(request.url).searchParams.get("redirect_to");

  return await login(values, redirect_to ?? undefined);
}

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const navigation = useNavigation();
  const actionData = useActionData<any>();
  const loading = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.error && actionData.error !== "Invalid form data") {
      toast({
        title: "Login error",
        description: actionData.error,
        status: "error",
      });
    }
  }, [actionData]);

  return (
    <Box as={Form} method="post">
      <Box className="space-y-5">
        {login_fields.map((field) => {
          let error = null;

          if (actionData?.error === "Invalid form data") {
            error = actionData.errors?.[field.id as keyof LoginForm];
          }

          return <FormInput key={field.id} {...{ error, loading, ...field }} />;
        })}
      </Box>

      <Box margin={"1.25em 0"} display={"flex"} justifyContent={"flex-end"}>
        <Text color={"white"}>
          Don't have an account?{" "}
          <Link
            as={RouteLink}
            to={`/auth/register?${searchParams}`}
            color="orange.200"
            textDecor={"underline"}
          >
            register
          </Link>
        </Text>
      </Box>

      <Button
        type="submit"
        colorScheme="blue"
        width={"100%"}
        disabled={loading}
        isLoading={loading}
        loadingText={"Logging in..."}
      >
        Login
      </Button>
    </Box>
  );
}
