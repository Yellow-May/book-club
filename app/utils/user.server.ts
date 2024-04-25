import { User } from "@prisma/client";
import { db } from "./db.server";
import { RegisterForm } from "./types.server";
import bcryptjs from "bcryptjs";

export async function createUser(user: RegisterForm) {
  const password_hash = await bcryptjs.hash(user.password, 10);
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

export async function updatePassword(user: User, new_password: string) {
  const password_hash = await bcryptjs.hash(new_password, 10);
  await db.user.update({
    where: { id: user.id },
    data: { password: password_hash },
  });
}

export async function checkPassword(
  user: User,
  password: string
): Promise<boolean> {
  return bcryptjs.compare(password, user.password);
}
