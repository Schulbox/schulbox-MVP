// app/lib/supabase.server.ts
import { createServerClient } from "@supabase/auth-helpers-remix";
import type { LoaderFunctionArgs } from "@remix-run/node";

export function getSupabaseServerClient(ctx: LoaderFunctionArgs, refresh_token?: string) {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      request: ctx.request,
      response: new Response(), // Dummy
      cookies: {
        get(name: string) {
          if (name === "sb-refresh-token" && refresh_token) {
            console.log("[supabase.server] Verwende übergebenen refresh_token für", name);
            return refresh_token;
          }
          
          // Extrahiere den spezifischen Cookie-Wert aus dem Cookie-Header
          const cookieHeader = ctx.request.headers.get("Cookie") || "";
          const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            if (key) acc[key] = value;
            return acc;
          }, {} as Record<string, string>);
          
          const value = cookies[name] || "";
          console.log("[supabase.server] Cookie angefragt:", name, "Wert gefunden:", value ? "ja" : "nein");
          return value;
        },
      },
    } as any
  );
}
