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
 * Speichert Supabase-Zugangsdaten in der Session
 */
export async function setSupabaseSessionCookie(
  request: Request,
  access_token: string,
  refresh_token: string
) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("supabaseAccessToken", access_token);
  session.set("supabaseRefreshToken", refresh_token);

  return await commitSession(session);
}

/**
 * Holt Tokens aus der Session (optional für Supabase-Client)
 */
export async function getSupabaseTokensFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return {
    access_token: session.get("supabaseAccessToken") as string | null,
    refresh_token: session.get("supabaseRefreshToken") as string | null,
  };
}
