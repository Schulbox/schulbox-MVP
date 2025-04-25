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
 * ✅ Speichert beide Tokens (Refresh Token und Access Token) in der Session
 */
export async function setSupabaseSessionCookie(
  request: Request,
  refresh_token: string,
  access_token: string
) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("supabaseRefreshToken", refresh_token);
  session.set("supabaseAccessToken", access_token);
  
  // Debug-Log
  console.log("[setSupabaseSessionCookie] Tokens gespeichert:", 
    refresh_token.substring(0, 10) + "...",
    access_token.substring(0, 10) + "..."
  );
  
  return await commitSession(session, {
    path: "/", // wichtig!
  });
}  

/**
 * ✅ Holt beide Tokens aus der Session (z. B. im Loader)
 */
export async function getSupabaseTokensFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const refresh_token = session.get("supabaseRefreshToken") as string | null;
  const access_token = session.get("supabaseAccessToken") as string | null;
  
  // Debug-Log
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
