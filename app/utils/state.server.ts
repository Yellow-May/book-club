import { createCookie } from "@remix-run/node";

export const prefs = createCookie("prefs");

export async function getPrefs(request: Request) {
  return (await prefs.parse(request.headers.get("Cookie"))) || {};
}
