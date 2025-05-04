// app/routes/logout.tsx
import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { clearSupabaseSession } from "~/lib/session.server";

export async function action({ request }: ActionFunctionArgs) {
  // Serverseitige Session löschen (Cookie zurücksetzen)
  const cookie = await clearSupabaseSession(request);

  // Redirect zur Startseite mit Set-Cookie Header
  return redirect("/", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
}

export default function Logout() {
  return null;
}
