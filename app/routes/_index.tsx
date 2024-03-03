import { Box } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <Box height={"50%"} minHeight={"100%"}>
      Hallo
    </Box>
  );
}
