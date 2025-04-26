// localStorage-only Session-Server-Implementierung ohne Cookies
// Diese Implementierung verwendet ausschließlich localStorage für die Session-Verwaltung

/**
 * Setzt die Tokens im localStorage und gibt einen leeren Cookie-String zurück
 * (um Kompatibilität mit der bestehenden API zu gewährleisten)
 */
export async function setSupabaseSessionCookie(
  request: Request,
  refresh_token: string,
  access_token: string
): Promise<string> {
  // Wir setzen kein Cookie, sondern geben nur einen leeren String zurück
  // Die eigentliche Token-Speicherung erfolgt client-seitig im localStorage
  console.log("[setSupabaseSessionCookie] Verwende localStorage-only Ansatz (kein Cookie)");
  
  // Leerer Cookie-String für Kompatibilität mit bestehender API
  return "";
}

/**
 * Gibt immer null zurück, da wir keine Tokens aus Cookies lesen
 * Die Tokens werden ausschließlich client-seitig aus dem localStorage gelesen
 */
export async function getSupabaseTokensFromSession(request: Request) {
  console.log("[getSupabaseTokensFromSession] Verwende localStorage-only Ansatz (kein Cookie-Check)");
  
  // Wir geben immer null zurück, da wir keine Tokens aus Cookies lesen
  // Die Tokens werden ausschließlich client-seitig aus dem localStorage gelesen
  return {
    refresh_token: null,
    access_token: null
  };
}

/**
 * Gibt einen leeren Cookie-String zurück (um Kompatibilität mit der bestehenden API zu gewährleisten)
 * Die eigentliche Token-Löschung erfolgt client-seitig im localStorage
 */
export async function clearSupabaseSession(request: Request): Promise<string> {
  console.log("[clearSupabaseSession] Verwende localStorage-only Ansatz (kein Cookie-Löschen)");
  
  // Leerer Cookie-String für Kompatibilität mit bestehender API
  return "";
}
