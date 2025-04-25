// app/routes/logout.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  // Tokens entfernen
  session.unset("supabaseRefreshToken");
  session.unset("supabaseAccessToken");

  const cookie = await destroySession(session);

  console.log("[logout] Tokens entfernt und Session zerstört.");

  return redirect("/login", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
}

export const action = loader; // falls jemand ein POST-Logout senden will
