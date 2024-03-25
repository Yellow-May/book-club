import { Box, Heading } from "@chakra-ui/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { getUser, requiresAuth } from "~/utils/auth.server";
import { db } from "~/utils/db.server";
import { FormErrorType, FormType } from "./_form/types";
import BookForm from "./_form";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  const followers = await db.relationship.findMany({
    where: { user_id: user?.id },
  });
  const genres = await db.genre.findMany();
  return json({ genres, followers });
}

export async function action({ request }: ActionFunctionArgs) {
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
    const book = await db.book.create({
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

    json({ book }, { status: 204 });
    return redirect("/my-books");
  }

  await requiresAuth(request);
}

export default function CreateNewBook() {
  return (
    <Box>
      <Heading
        size={"md"}
        marginBottom={5}
        paddingBottom={1}
        borderBottom={"1px solid white"}
      >
        Create New Book
      </Heading>
      <BookForm />
    </Box>
  );
}
