import { useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Book } from "@prisma/client";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { MAX_WORDS, calculateWords } from "./utils";
import { loader } from "../route";

interface Props {
  pre_data?: Book | null;
}

export default function BookForm({ pre_data = null }: Props) {
  const [form_data, setFormData] = useState<{
    title: string;
    synopsis: string;
    collaborators: string[];
    genres: string[];
  }>({
    title: "",
    synopsis: "",
    collaborators: [],
    genres: [],
  });
  const { genres, followers } = useLoaderData<typeof loader>();
  const toast = useToast();
  const navigation = useNavigation();
  const actionData = useActionData<any>();
  const loading = navigation.state === "submitting";

  useEffect(() => {
    if (pre_data) {
      setFormData({
        title: pre_data.title,
        synopsis: pre_data.synopsis,
        collaborators: pre_data.collaborators_ids,
        genres: pre_data.genres_ids,
      });
    }
  }, [pre_data]);

  useEffect(() => {
    if (actionData?.error && actionData.error !== "Invalid form data") {
      toast({
        title: "Book create error",
        description: actionData.error,
        status: "error",
      });
    } else if (actionData?.error === "Invalid form data") {
      Object.values(actionData.errors).forEach((error) => {
        if (error) {
          toast({
            title: "Book create error",
            description: error as string,
            status: "error",
          });
        }
      });
    }
  }, [actionData]);

  return (
    <>
      <Box as={Form} method="post">
        <FormControl id="title" marginBottom={5}>
          <FormLabel htmlFor="title" marginBottom={0}>
            Book Title
          </FormLabel>
          <Input
            bg={"white"}
            name="title"
            id="title"
            placeholder="What is the title of the book?"
            value={form_data.title}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, title: e.target.value }));
            }}
          />
        </FormControl>

        <FormControl id="synopsis" marginBottom={5}>
          <FormLabel htmlFor="synopsis" marginBottom={0}>
            Book Synopsis
          </FormLabel>
          <Textarea
            bg={"white"}
            placeholder="What is the book about?"
            name="synopsis"
            id="synopsis"
            resize={"vertical"}
            value={form_data.synopsis}
            onChange={(e) => {
              const { value } = e.target;
              const words = calculateWords(value);
              if (words < MAX_WORDS) {
                setFormData((prev) => ({ ...prev, synopsis: value }));
              } else if (words === MAX_WORDS) {
                setFormData((prev) => ({ ...prev, synopsis: value.trim() }));
              }
            }}
          />
          <FormHelperText marginTop={0.5}>
            <Box as="span" color={"black"}>
              {calculateWords(form_data.synopsis)}
            </Box>
            <Box as="span">/</Box>
            <Box as="span" fontWeight={"medium"}>
              {MAX_WORDS}
            </Box>
          </FormHelperText>
        </FormControl>

        {/* <FormControl id="collaborators" marginBottom={5}>
          <FormLabel htmlFor="collaborators" marginBottom={0}>
            Book Collaborators
          </FormLabel>
          <Select placeholder="Select colloaborators from followers" bg="white">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
          <Flex
            gap={2}
            py={0.5}
            display={collaborators.length > 0 ? "flex" : "none"}
          >
            {collaborators.map((collaborator, index) => {
              return (
                <Flex
                  key={index}
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
                    One is toooo teded This book is about a boy named Kratos,
                    the soon to be god of war. A true spartan to his
                  </Text>
                  <Button colorScheme="red" size={"sm"} position={"relative"}>
                    <CloseIcon fontSize={"smaller"} color={"white"} />
                  </Button>
                </Flex>
              );
            })}
          </Flex>
          <FormErrorMessage textTransform={"capitalize"}>
            There is an error
          </FormErrorMessage>
        </FormControl> */}

        <FormControl id="genres" marginBottom={5}>
          <FormLabel htmlFor="genres" marginBottom={0}>
            Book Genres
          </FormLabel>
          <Select
            placeholder="Select genres from followers"
            bg="white"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                genres: [...prev.genres, e.target.value],
              }));
            }}
            fontSize={"small"}
            fontWeight={"500"}
            id="genres"
          >
            {genres.map((genre, index) => {
              return (
                <option
                  key={index}
                  value={genre.id}
                  disabled={form_data.genres.includes(genre.id)}
                  className="disabled:bg-gray-200 disabled:text-gray-600"
                >
                  {genre.name}
                </option>
              );
            })}
          </Select>
          <Flex
            gap={2}
            py={0.5}
            display={form_data.genres.length > 0 ? "flex" : "none"}
          >
            {form_data.genres.map((genre, index) => {
              return (
                <Flex
                  key={index}
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
                    {genres.find((e) => e.id === genre)?.name}
                  </Text>
                  <Button
                    colorScheme="red"
                    size={"sm"}
                    position={"relative"}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        genres: prev.genres.filter((e) => e !== genre),
                      }))
                    }
                  >
                    <CloseIcon fontSize={"smaller"} color={"white"} />
                  </Button>
                </Flex>
              );
            })}
          </Flex>
        </FormControl>

        <input
          type="hidden"
          name="genres_ids"
          value={JSON.stringify(form_data.genres)}
        />

        <Flex justifyContent={"flex-end"}>
          <Button
            colorScheme="blue"
            type="submit"
            name={pre_data ? "update" : "create"}
            disabled={loading}
            isLoading={loading}
            loadingText={
              pre_data
                ? "Submitting book update request.."
                : "Submitting book creation request.."
            }
          >
            Submit
          </Button>
        </Flex>
      </Box>
    </>
  );
}
