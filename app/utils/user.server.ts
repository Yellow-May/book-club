import { db } from "./db.server";
import { RegisterForm } from "./types.server";
import bcrypt from "bcrypt";

export async function createUser(user: RegisterForm) {
  const password_hash = await bcrypt.hash(user.password, 10);
  const new_user = await db.user.create({
    data: {
      email: user.email,
      password: password_hash,
      profile: {
        full_name: user.full_name,
      },
      prefrences: {
        book_author_name: "full_name",
      },
    },
  });

  return new_user;
}

export async function checkPassword(
  user: { password: string },
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, user.password);
}
