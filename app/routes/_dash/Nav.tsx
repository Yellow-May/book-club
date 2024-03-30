import { Link as RemixLink, useMatches } from "@remix-run/react";
import { Flex, GridItem, Link, VStack } from "@chakra-ui/react";
import { FaBook, FaHome, FaJediOrder } from "react-icons/fa";

const navlinks = [
  { to: "/home", label: "Home", Icon: FaHome },
  { to: "/my-books", label: "My Books", Icon: FaBook },
  { to: "/genres", label: "Genres", Icon: FaJediOrder },
];

export default function Nav() {
  const matches = useMatches();

  return (
    <GridItem py="5" bg="blue.400" area={"nav"} as="aside">
      <VStack alignItems={"flex-start"} gap={3.5} as="nav">
        {navlinks.map(({ Icon, label, to }, idx) => {
          const pathname = matches.at(-1)?.pathname;
          const active = pathname?.startsWith(to);

          return (
            <Link
              key={idx}
              as={RemixLink}
              to={to}
              fontSize={{ base: "1em" }}
              color={active ? "white" : "blue.800"}
              textTransform={"uppercase"}
              fontWeight={active ? "700" : "500"}
              width={"100%"}
              pl={"10"}
              py={"1"}
              borderLeftWidth={active ? "10px" : ""}
              borderColor={"white"}
              transition={"all 0.2s ease-in-out"}
              _hover={{ textDecoration: "none" }}
            >
              <Flex alignItems={"center"} justifyContent={"flex-start"} gap={3}>
                <Icon />
                <Flex
                  height={"max-content"}
                  lineHeight={"normal"}
                  alignItems={"center"}
                >
                  {label}
                </Flex>
              </Flex>
            </Link>
          );
        })}
      </VStack>
    </GridItem>
  );
}
