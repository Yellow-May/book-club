import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  const my_books = await db.book.findMany({
    where: { user_id: user?.id },
    include: { genres: true, user: true },
  });
  return json({ my_books }, { status: 200 });
}

export default function MyBooks() {
  const { my_books } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <>
      <Flex
        alignItems={"center"}
        position={"absolute"}
        top={5}
        right={5}
        height={30}
      >
        <Spacer />
        <Button
          as={Link}
          to="/my-books/create"
          leftIcon={<Icon as={FaPlus} />}
          colorScheme="blue"
          size={"sm"}
          fontSize={"small"}
        >
          Publish Book
        </Button>
      </Flex>
      <Box>
        <TableContainer>
          <Table variant="simple" colorScheme="blue" bg={"white"}>
            <Thead>
              <Tr bg={"blue.400"}>
                <Th color={"white"}>Title</Th>
                <Th isNumeric color={"white"}>
                  Genres
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {my_books.map((book) => {
                return (
                  <Tr
                    key={book.id}
                    cursor={"pointer"}
                    _hover={{ bg: "blue.50" }}
                    onClick={() => navigate(`/my-books/${book.id}`)}
                  >
                    <Td>{book.title}</Td>
                    <Td isNumeric>
                      {book.genres.map((genre) => genre.name).join(", ")}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
