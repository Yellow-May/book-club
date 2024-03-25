import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Tag,
  TagLabel,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Genre, User } from "@prisma/client";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getUser, requiresAuth } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { id } = params;
  const user = await getUser(request);
  if (!user) return await requiresAuth(request);

  const my_book = await db.book.findUnique({
    where: { id, user_id: user.id },
    include: { user: true, collaborators: true, genres: true },
  });

  if (!my_book) return json({ error: "Book not found" }, { status: 404 });

  return json({ params, my_book }, { status: 200 });
}

export default function MyBook() {
  const loader = useLoaderData<any>();
  const [isOpen, setIsOpen] = useState(false);

  function onClose() {
    setIsOpen(false);
  }

  if (loader.error)
    return (
      <Box>
        <Text>{loader.error}</Text>
      </Box>
    );

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
        <HStack>
          <Button
            as={Link}
            to={`/my-books/${loader.params.id}/edit`}
            colorScheme="blue"
            title="Edit Book"
            size={"sm"}
          >
            <Icon as={FaEdit} />
          </Button>

          <Button colorScheme="red" title="Delete Book" size={"sm"}>
            <Icon as={FaTrash} />
          </Button>
        </HStack>
      </Flex>

      <Box>
        <Heading
          marginBottom={6}
          borderBottom={"1px solid"}
          size={"md"}
          paddingBottom={2}
        >
          {loader.my_book.title}
        </Heading>
        <Grid templateColumns={"repeat(12, 1fr)"} gap={8}>
          <GridItem colSpan={8}>
            <Box>
              <Heading
                as="h2"
                fontSize={"xs"}
                fontWeight={"700"}
                textTransform={"uppercase"}
                marginBottom={2}
                color={"gray.900"}
              >
                Synopsis
              </Heading>
              <Text as="blockquote" fontSize={"sm"} textAlign={"justify"}>
                {loader.my_book.synopsis}
              </Text>
            </Box>
          </GridItem>
          <GridItem colSpan={4}>
            <Box marginBottom={8}>
              <Heading
                as="h3"
                fontSize={"xs"}
                fontWeight={"700"}
                textTransform={"uppercase"}
                marginBottom={2}
                color={"gray.900"}
              >
                Genres
              </Heading>
              <HStack>
                {loader.my_book.genres.map((genre: Genre) => {
                  return (
                    <Tag key={genre.id} colorScheme="blue">
                      {genre.name}
                    </Tag>
                  );
                })}
              </HStack>
            </Box>

            <Box>
              <Heading
                as="h4"
                fontSize={"xs"}
                fontWeight={"700"}
                textTransform={"uppercase"}
                marginBottom={2}
                color={"gray.900"}
              >
                Collaborators
              </Heading>
              {loader.my_book.collaborators.length > 0 ? (
                <HStack>
                  {loader.my_book.collaborators.map((collaborator: User) => {
                    return (
                      <Tag key={collaborator.id} colorScheme="blue">
                        <Avatar
                          src="https://bit.ly/sage-adebayo"
                          size="xs"
                          name="Segun Adebayo"
                          ml={-1}
                          mr={2}
                        />
                        <TagLabel>{collaborator.profile.full_name}</TagLabel>
                      </Tag>
                    );
                  })}
                </HStack>
              ) : (
                <Text>No collaborators</Text>
              )}
            </Box>
          </GridItem>
        </Grid>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Book?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this book?</Text>
            <Text>Action cannot be undone.</Text>
          </ModalBody>

          <ModalFooter gap={4}>
            <Button colorScheme="blue" variant={"outline"} onClick={onClose}>
              Close
            </Button>
            <Button type="button" colorScheme="red">
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
