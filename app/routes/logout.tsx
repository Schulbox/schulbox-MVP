import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  session.unset("supabaseRefreshToken");
  session.unset("supabaseAccessToken");
  const sessionCookie = await destroySession(session);

  console.log("[logout] Benutzer erfolgreich ausgeloggt");

  return redirect("/login", {
    headers: {
      "Set-Cookie": [
        sessionCookie,
        "sb-access-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax",
        "sb-refresh-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax",
      ].join(", "),
    },
  });
}
