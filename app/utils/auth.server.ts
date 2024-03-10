import { json, createCookieSessionStorage, redirect } from "@remix-run/node";
import { db } from "./db.server";
import { LoginForm, RegisterForm } from "./types.server";
import { checkPassword, createUser } from "./user.server";

const SESSION_NAME = "BOOK_CLUB_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "SECRET";
const AUTH_UID = "AUTH_UID";

if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: SESSION_NAME,
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

async function createUserSession(user_id: string, redirect_to: string = "/") {
  const session = await storage.getSession();
  session.set(AUTH_UID, user_id);
  return redirect(redirect_to, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

// auth actions
export async function register(form: RegisterForm, redirect_to?: string) {
  const { email } = form;

  const exist = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (exist) {
    return json(
      { error: "User already exists with that email" },
      { status: 400 }
    );
  }

  const res = await createUser(form);

  if (!res) {
    return json(
      {
        error: "Something went wrong",
        fields: form,
      },
      { status: 400 }
    );
  }

  return createUserSession(res.id, redirect_to);
}

export async function login(form: LoginForm, redirect_to?: string) {
  const { email, password } = form;

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return json({ error: "No user found with that email" }, { status: 400 });
  }

  if (!(await checkPassword(user, password))) {
    return json({ error: "Incorrect password" }, { status: 400 });
  }

  return createUserSession(user.id, redirect_to);
}

export async function logout(
  request: Request,
  redirect_to: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const search_params = new URLSearchParams([["redirect_to", redirect_to]]);

  return redirect(`/auth/login?${search_params}`, {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function getUser(request: Request) {
  const session = await getUserSession(request);
  const user_id = session.get(AUTH_UID);

  if (!user_id) return null;

  try {
    const user = await db.user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        email: true,
        profile: true,
      },
    });
    return user;
  } catch (error) {
    throw logout(request);
  }
}

export async function requiresAuth(
  request: Request,
  redirect_to: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const user_id = session.get(AUTH_UID);

  if (
    (!user_id || typeof user_id !== "string") &&
    !["auth"].includes(new URL(request.url).pathname)
  ) {
    const search_params = new URLSearchParams([["redirect_to", redirect_to]]);
    throw redirect(`/auth/login?${search_params}`);
  }

  return null;
}
