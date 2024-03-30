import { useEffect, useState } from "react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  HStack,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { Genre } from "@prisma/client";
import { db } from "~/utils/db.server";
import GenreBadge from "./_components/GenreBadge";

export async function loader() {
  const genres = await db.genre.findMany();
  return json({ data: genres }, { status: 200 });
}

export async function action({ request }: ActionFunctionArgs) {
  const formdata = await request.formData();
  const { genre, genre_id, _action } = Object.fromEntries(formdata) as {
    genre?: string;
    genre_id?: string;
    _action?: string;
  };

  if (_action === "create_genre") {
    if (!genre) {
      return json(
        {
          error: "Invalid form data",
          errors: { genre: "Genre name is required" },
        },
        { status: 400 }
      );
    }

    const genre_exists = await db.genre.findFirst({
      where: { name: { contains: genre } },
    });

    if (genre_exists) {
      return json(
        {
          error: "Invalid form data",
          errors: { genre: "Genre already exists" },
        },
        { status: 400 }
      );
    }

    await db.genre.create({ data: { name: genre } });

    return json({ message: "Success" }, { status: 202 });
  }

  if (_action === "delete_genre") {
    await db.genre.delete({ where: { id: genre_id } });
    return json({ message: "Success" }, { status: 202 });
  }

  return null;
}

export default function Genres() {
  const loaderData = useLoaderData<any>();
  const fetcher = useFetcher();
  const toast = useToast();
  const loading = fetcher.state === "submitting";
  const fetcherData = fetcher.data as any;
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (fetcherData?.error && fetcherData?.error === "Invalid form data") {
      Object.values(fetcherData.errors).forEach((error) => {
        if (error) {
          toast({
            title: "Genre create error",
            description: error as string,
            status: "error",
          });
        }
      });
    }
    if (fetcherData?.message) {
      toast({
        title: "Genre created",
        description: fetcherData.message,
        status: "success",
      });
      setInputValue("");
    }
  }, [fetcherData]);

  return (
    <Box>
      <Box>
        <Heading as={"h1"} size="sm" marginBottom={2}>
          Add New Genre
        </Heading>
        <Box
          as={fetcher.Form}
          method="POST"
          action="/genres?action=create"
          marginBottom={8}
        >
          <Flex>
            <FormControl id="genre">
              <Input
                type="text"
                name="genre"
                id="genre"
                placeholder="Genre name"
                bg={"white"}
                borderRightRadius={"none"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              borderLeftRadius={"none"}
              paddingX={8}
              lineHeight={1}
              display={"flex"}
              alignItems={"center"}
              value={"create_genre"}
              name="_action"
              disabled={loading}
              isLoading={loading}
              loadingText={"Submitting new genre request.."}
            >
              Create Genre
            </Button>
          </Flex>
        </Box>
      </Box>

      <Box>
        <Heading as={"h2"} size="sm" marginBottom={2}>
          All Genres
        </Heading>

        <HStack>
          {loaderData.data.map((g: Genre) => {
            return <GenreBadge key={g.id} genre={g} />;
          })}
        </HStack>
      </Box>
    </Box>
  );
}
