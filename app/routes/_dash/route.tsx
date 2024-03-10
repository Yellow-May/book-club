import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useFetcher, useMatches } from "@remix-run/react";
import { requiresAuth } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return await requiresAuth(request);
}

export default function DashboardLayout() {
  const matches = useMatches();
  const fetcher = useFetcher();

  return (
    <div>
      <h1>Dashboard Layout</h1>
      <fetcher.Form method="post">
        <input
          type="hidden"
          name="pathname"
          value={matches.at(-1)?.pathname ?? ""}
        />
        <button type="submit" name="_action" value="logout">
          Logout
        </button>
      </fetcher.Form>
      <Outlet />
    </div>
  );
}
