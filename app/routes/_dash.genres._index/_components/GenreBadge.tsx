import { useEffect, useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Genre } from "@prisma/client";
import { useFetcher } from "@remix-run/react";

interface Props {
  genre: Genre;
}

export default function GenreBadge({ genre }: Props) {
  const fetcher = useFetcher();
  const fetcherData = fetcher.data as any;
  const loading = fetcher.state === "submitting";
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  useEffect(() => {
    if (!loading && fetcherData?.message === "Success") {
      onClose();
    }
  }, [fetcherData]);

  return (
    <>
      <Flex
        key={genre.id}
        width={"max-content"}
        maxWidth={"320px"}
        alignItems={"center"}
        bg="white"
        borderRadius={"base"}
      >
        <Text
          flexGrow={1}
          px={2}
          fontSize={"small"}
          fontWeight={"500"}
          noOfLines={1}
        >
          {genre.name}
        </Text>
        <Button
          colorScheme="red"
          size={"sm"}
          position={"relative"}
          onClick={() => setIsOpen(true)}
        >
          <CloseIcon fontSize={"smaller"} color={"white"} />
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Genre?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this genre?</Text>
            <Text>Action cannot be undone.</Text>
          </ModalBody>

          <ModalFooter gap={4}>
            <Button
              colorScheme="blue"
              variant={"outline"}
              onClick={onClose}
              disabled={loading}
            >
              Close
            </Button>
            <fetcher.Form method="post">
              <input value={genre.id} name="genre_id" type="hidden" />
              <Button
                type="submit"
                colorScheme="red"
                value={"delete_genre"}
                name="_action"
                disabled={loading}
                loadingText={"Deleting..."}
              >
                Delete
              </Button>
            </fetcher.Form>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
