import { Box } from "@chakra-ui/react";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { getUser, requiresAuth } from "~/utils/auth.server";
import { db } from "~/utils/db.server";
import ProfileSettings from "./_components/Profile";
import PasswordUpdate from "./_components/PasswordUpdate";
import { checkPassword, updatePassword } from "~/utils/user.server";
import { User } from "@prisma/client";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (user) return json({ user });
  return await requiresAuth(request);
}

export async function action({ request }: ActionFunctionArgs) {
  const user = (await getUser(request)) as User;
  if (!user) return await requiresAuth(request);
  const formdata = await request.formData();
  const _action = formdata.get("_action");

  switch (_action) {
    case "update_profile": {
      const { avatar_name, avatar_size, avatar_url, full_name } =
        Object.fromEntries(formdata) as {
          avatar_name: string;
          avatar_size: string;
          avatar_url: string;
          full_name: string;
        };

      if (!full_name) {
        return json(
          {
            error: "Invalid form data",
            errors: { full: "Full name is required" },
          },
          { status: 400 }
        );
      }

      await db.user.update({
        where: { id: user.id },
        data: {
          profile: {
            full_name,
            avatar: { name: avatar_name, size: +avatar_size, url: avatar_url },
          },
        },
      });

      return json({ message: "Success" });
    }

    case "update_password": {
      const { password, new_password } = Object.fromEntries(formdata) as {
        password: string;
        new_password: string;
      };
      const db_user = await db.user.findUnique({ where: { id: user.id } });
      console.log(db_user);
      if (db_user) {
        if (await checkPassword(db_user, password)) {
          await updatePassword(db_user, new_password);
          return json({ message: "Success" });
        }
        return json({ error: "Incorrect Password" }, { status: 400 });
      }
      return await requiresAuth(request);
    }

    default:
      return null;
  }
}

export default function AccountSettings() {
  return (
    <Box paddingBottom={10}>
      <ProfileSettings />
      <PasswordUpdate />
    </Box>
  );
}
