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
 * ✅ Speichert nur noch den Supabase Refresh Token in der Session
 */
export async function setSupabaseSessionCookie(
  request: Request,
  refresh_token: string
) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("supabaseRefreshToken", refresh_token);
  
  // Debug-Log
  console.log("[setSupabaseSessionCookie] Token gespeichert:", refresh_token.substring(0, 10) + "...");
  
  return await commitSession(session, {
    path: "/", // wichtig!
  });
}  

/**
 * ✅ Holt den Refresh Token aus der Session (z. B. im Loader)
 */
export async function getSupabaseTokensFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const refresh_token = session.get("supabaseRefreshToken") as string | null;
  
  // Debug-Log
  if (refresh_token) {
    console.log("[getSupabaseTokensFromSession] Token gefunden:", refresh_token.substring(0, 10) + "...");
  } else {
    console.log("[getSupabaseTokensFromSession] Kein Token in der Session gefunden");
  }
  
  return {
    refresh_token
  };
}
