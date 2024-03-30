import {
  Link as RouterLink,
  useFetcher,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
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
  Link,
} from "@chakra-ui/react";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
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
          as={RouterLink}
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
                src={user?.profile.avatar?.url}
                cursor={"pointer"}
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader fontWeight={600} noOfLines={1}>
                {user?.profile.full_name}
              </PopoverHeader>
              <PopoverBody>
                <VStack alignItems={"flex-start"} gap={2}>
                  <Link
                    as={RouterLink}
                    to={"/profile"}
                    width={"100%"}
                    padding={"4px 0"}
                    fontSize={"sm"}
                    display={"flex"}
                    alignItems={"center"}
                    gap={2}
                    borderBottom={"thin solid"}
                    borderBottomColor={"gray.200"}
                  >
                    <Icon as={FaUser} />
                    Profile
                  </Link>
                  <Link
                    as={RouterLink}
                    to={"/settings"}
                    width={"100%"}
                    padding={"4px 0"}
                    fontSize={"sm"}
                    display={"flex"}
                    alignItems={"center"}
                    gap={2}
                    borderBottom={"thin solid"}
                    borderBottomColor={"gray.200"}
                  >
                    <Icon as={FaGear} />
                    Settings
                  </Link>
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
                      size={"sm"}
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
