// app/lib/session.server.ts
import { createCookieSessionStorage } from "@remix-run/node";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET!],
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

export async function getSupabaseTokensFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const refresh_token = session.get("supabaseRefreshToken");
  const access_token = session.get("supabaseAccessToken");
  console.log("[getSupabaseTokensFromSession] Tokens:", { refresh_token, access_token });
  return { refresh_token, access_token };
}

export async function setSupabaseSessionCookie(
  request: Request,
  refresh_token: string,
  access_token: string
) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("supabaseRefreshToken", refresh_token);
  session.set("supabaseAccessToken", access_token);
  return commitSession(session, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 Tage
  });
}
