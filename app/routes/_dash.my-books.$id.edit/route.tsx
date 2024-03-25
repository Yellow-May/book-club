import { useLoaderData } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Box, Heading, Text } from "@chakra-ui/react";
import { getUser, requiresAuth } from "~/utils/auth.server";
import { db } from "~/utils/db.server";
import { FormErrorType, FormType } from "../_dash.my-books.create/_form/types";
import BookForm from "../_dash.my-books.create/_form";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await getUser(request);
  const followers = await db.relationship.findMany({
    where: { user_id: user?.id },
  });
  const genres = await db.genre.findMany();
  const book = await db.book.findUnique({ where: { id: params.id } });
  return json({ genres, followers, params, book }, { status: 200 });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await getUser(request);
  const form = await request.formData();
  const { title, synopsis, genres_ids } = Object.fromEntries(form);
  const values = {
    title,
    synopsis,
    collaborators_ids: [],
    genres_ids: JSON.parse(genres_ids as string),
  } as unknown as FormType;
  const errors = {
    title: "",
    synopsis: "",
    genres_ids: "",
  } as FormErrorType;

  Object.keys(values).forEach((key) => {
    const v = values[key as keyof FormType];
    if (typeof v === "string" && !v) {
      errors[key as keyof FormErrorType] = `${key.replaceAll(
        "_ids",
        ""
      )} is required`;
    }
    if (key === "genres_ids" && v.length <= 0) {
      errors[key as keyof FormErrorType] = `at least 1 genre is required`;
    }
  });

  const has_error = Object.keys(errors).reduce((a, b) => {
    return Boolean(errors?.[b as keyof FormErrorType]) || a;
  }, false);

  if (has_error) {
    return json(
      { error: "Invalid form data", errors, fields: values },
      { status: 400 }
    );
  }

  if (user) {
    const book = await db.book.update({
      where: { id: params.id },
      data: {
        user_id: user.id,
        title: values.title,
        synopsis: values.synopsis,
        genres_ids: values.genres_ids,
        collaborators_ids: [],
        cover: {
          url: "undefined",
          name: "undefined",
          size: 0,
        },
      },
    });

    json({ book }, { status: 200 });
    return redirect(`/my-books/${params.id}`);
  }

  await requiresAuth(request);
}

export default function EditMyBook() {
  const { params, book } = useLoaderData<any>();

  return (
    <Box>
      <Heading
        size={"md"}
        marginBottom={5}
        paddingBottom={1}
        borderBottom={"1px solid white"}
      >
        Update Book : <Text as="span">{params.id}</Text>
      </Heading>
      <BookForm pre_data={book} />
    </Box>
  );
}
