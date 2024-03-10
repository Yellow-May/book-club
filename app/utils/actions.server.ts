import { redirect } from "@remix-run/node";

export function redirectBack(request: Request) {
  const previous_page = request.headers.get("referer") || "/";
  return redirect(previous_page);
}
