import { Box, Container, Heading } from "@chakra-ui/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useLocation } from "@remix-run/react";
import { getUser } from "~/utils/auth.server";

export function meta() {
  return [{ title: "Auth | Book Club" }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);

  if (user) {
    return redirect("/home");
  }

  if (new URL(request.url).pathname === "/auth") {
    return redirect("/auth/login");
  }

  return null;
}

export default function AuthLayout() {
  const location = useLocation();
  const auth_page = location.pathname.split("/")[2];

  return (
    <>
      <Container
        height={"100%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        maxWidth={"65ch"}
      >
        <Box
          bg="blue.700"
          width={"100%"}
          padding={{ base: "1em 0.75em", md: "2em 1.5em" }}
          borderRadius={{ base: "0.5em", md: "0.7em" }}
          className="shadow-2xl"
        >
          <Heading
            as={"h1"}
            color="white"
            fontSize={"1.5em"}
            fontWeight={"700"}
            textTransform={"uppercase"}
            paddingBottom={"0.5em"}
            borderBottomWidth={"1px"}
            borderStyle={"solid"}
            borderColor={"white"}
            marginBottom={"1em"}
          >
            {auth_page}
          </Heading>
          <Outlet />
        </Box>
      </Container>
    </>
  );
}
