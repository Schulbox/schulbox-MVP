// app/routes/logout.tsx
import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { clearSupabaseSession } from "~/lib/session.server";

export async function action({ request }: ActionFunctionArgs) {
  // Lösche Server-seitige Session (Cookies)
  const cookie = await clearSupabaseSession(request);
  
  // Leite zur Startseite weiter
  return redirect("/", {
    headers: {
      "Set-Cookie": cookie
    }
  });
}

export default function Logout() {
  return null;
}
