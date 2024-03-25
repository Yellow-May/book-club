import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, Outlet, useMatches } from "@remix-run/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Flex,
  Grid,
  GridItem,
  Spacer,
} from "@chakra-ui/react";
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
  const matches = useMatches();
  const paths = matches
    .at(-1)
    ?.pathname.split("/")
    .filter((e) => e);

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

      <GridItem
        p="5"
        bg="gray.200"
        area={"main"}
        as="main"
        position={"relative"}
      >
        <Flex alignItems={"center"} marginBottom={5} height={30}>
          <Breadcrumb fontWeight="600" fontSize="xs">
            {paths?.map((item, index) => {
              const to = paths
                .slice(0, index + 1)
                .reduce((a, b) => a + "/" + b, "");

              return (
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink
                    as={Link}
                    to={to ?? "/"}
                    isCurrentPage={index === paths.length - 1}
                    textTransform={"capitalize"}
                  >
                    {item.replaceAll("-", " ")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              );
            })}
          </Breadcrumb>

          <Spacer />
        </Flex>
        <Outlet />
      </GridItem>
    </Grid>
  );
}
