import { Link, useFetcher, useLoaderData, useMatches } from "@remix-run/react";
import {
  Avatar,
  Button,
  Flex,
  GridItem,
  HStack,
  Heading,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  VStack,
} from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";
import { loader } from "./route";

export default function Header() {
  const fetcher = useFetcher();
  const matches = useMatches();
  const data = useLoaderData<typeof loader>();
  const user = data?.user;

  return (
    <GridItem px={10} bg="white" area={"header"} as="header">
      <Flex alignItems={"center"} justifyContent={"space-between"} h={"100%"}>
        <Heading
          as={Link}
          to={"/"}
          size={"md"}
          textTransform={"uppercase"}
          fontWeight={"900"}
        >
          Book Club
        </Heading>

        <HStack>
          <Popover>
            <PopoverTrigger>
              <Avatar
                name={user?.profile.full_name}
                src="https://bit.ly/broken-link"
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>{user?.profile.full_name}</PopoverHeader>
              <PopoverBody>
                <VStack alignItems={"flex-start"}>
                  <fetcher.Form method="post">
                    <input
                      type="hidden"
                      name="pathname"
                      value={matches.at(-1)?.pathname ?? ""}
                    />
                    <Button
                      type="submit"
                      name="_action"
                      value="logout"
                      colorScheme="red"
                      leftIcon={<Icon as={FaSignOutAlt} />}
                    >
                      Logout
                    </Button>
                  </fetcher.Form>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
      </Flex>
    </GridItem>
  );
}
