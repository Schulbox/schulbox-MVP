// app/lib/session.server.ts
import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: [process.env.SESSION_SECRET || "default_secret"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 Tage
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

/**
 * ✅ Speichert beide Tokens (in kleineren Keys)
 */
export async function setSupabaseSessionCookie(
  request: Request,
  refresh_token: string,
  access_token: string
) {
  const session = await getSession(request.headers.get("Cookie"));

  // Kürzere Schlüssel: spart wertvolle Cookie-Bytes
  session.set("sbt", refresh_token); // sbt = Supabase Refresh Token
  session.set("sat", access_token);  // sat = Supabase Access Token

  console.log("[setSupabaseSessionCookie] Tokens gespeichert:", 
    refresh_token.substring(0, 10) + "...", 
    access_token.substring(0, 10) + "..."
  );

  return await commitSession(session); // keine extra Optionen notwendig
}

/**
 * ✅ Holt Tokens aus der Session (z. B. im Loader)
 */
export async function getSupabaseTokensFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const refresh_token = session.get("sbt") as string | null;
  const access_token = session.get("sat") as string | null;

  if (refresh_token) {
    console.log("[getSupabaseTokensFromSession] Refresh-Token gefunden:", refresh_token.substring(0, 10) + "...");
  } else {
    console.log("[getSupabaseTokensFromSession] Kein Refresh-Token in der Session gefunden");
  }

  if (access_token) {
    console.log("[getSupabaseTokensFromSession] Access-Token gefunden:", access_token.substring(0, 10) + "...");
  } else {
    console.log("[getSupabaseTokensFromSession] Kein Access-Token in der Session gefunden");
  }

  return {
    refresh_token,
    access_token
  };
}
