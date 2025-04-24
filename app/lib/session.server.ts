// app/lib/session.server.ts
import { createCookieSessionStorage } from "@remix-run/node";

// Session-Name & Key
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session", // Session-Name (wichtig für Vercel + Supabase-Flow)
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET!],
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;


// ✅ Tokens aus der Session extrahieren
export async function getSupabaseTokensFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const refresh_token = session.get("supabaseRefreshToken") as string | null;
  return { refresh_token };
}

// ✅ Token in Session speichern
export async function setSupabaseSessionCookie(
  request: Request,
  refresh_token: string
) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("supabaseRefreshToken", refresh_token);

  console.log("[setSupabaseSessionCookie] Token gespeichert:", refresh_token.substring(0, 10) + "...");

  return await commitSession(session, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 Tage
  });
}

// Optional: Session löschen
export async function destroySupabaseSessionCookie(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return destroySession(session);
}
