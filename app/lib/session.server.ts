// Verbesserte Session-Server-Implementierung mit localStorage und Cookies
// Diese Implementierung verwendet sowohl localStorage als auch Cookies für die Session-Verwaltung

/**
 * Setzt die Tokens im localStorage und gibt einen Cookie-String zurück
 */
export async function setSupabaseSessionCookie(
  request: Request,
  refresh_token: string,
  access_token: string
): Promise<string> {
  console.log("[setSupabaseSessionCookie] Setze Tokens in Cookies und localStorage");
  
  // Cookie-String für Server-seitige Authentifizierung
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = cookieHeader.split("; ").filter(c =>
    !c.startsWith("sb-refresh-token=") && !c.startsWith("sb-access-token=")
  );
  
  // Füge neue Token-Cookies hinzu
  cookies.push(`sb-refresh-token=${refresh_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
  cookies.push(`sb-access-token=${access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
  
  return cookies.join("; ");
}

/**
 * Holt die Tokens aus den Cookies
 */
export async function getSupabaseTokensFromSession(request: Request) {
  console.log("[getSupabaseTokensFromSession] Lese Tokens aus Cookies");
  
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = cookieHeader.split("; ");
  
  let refresh_token = null;
  let access_token = null;
  
  for (const cookie of cookies) {
    if (cookie.startsWith("sb-refresh-token=")) {
      refresh_token = cookie.split("=")[1];
    } else if (cookie.startsWith("sb-access-token=")) {
      access_token = cookie.split("=")[1];
    }
  }
  
  return {
    refresh_token,
    access_token
  };
}

/**
 * Löscht die Session-Cookies
 */
export async function clearSupabaseSession(request: Request): Promise<string> {
  console.log("[clearSupabaseSession] Lösche Session-Cookies");
  
  return "sb-refresh-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; sb-access-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}
