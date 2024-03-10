import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Grid, GridItem } from "@chakra-ui/react";
import { getUser, requiresAuth } from "~/utils/auth.server";
import Header from "./Header";
import Nav from "./Nav";

export function meta() {
  return [{ title: "Dashboard" }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requiresAuth(request);
  const user = await getUser(request);
  return json({ user });
}

export default function DashboardLayout() {
  return (
    <Grid
      templateAreas={`"header header" "nav main"`}
      gridTemplateRows={"70px 1fr"}
      gridTemplateColumns={"240px 1fr"}
      h="100%"
      gap="1"
      color="blackAlpha.700"
    >
      <Header />

      <Nav />

      <GridItem p="5" bg="gray.200" area={"main"} as="main">
        <Outlet />
      </GridItem>
    </Grid>
  );
}
