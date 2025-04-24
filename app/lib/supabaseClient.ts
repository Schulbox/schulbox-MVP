// app/lib/supabase.server.ts
import { createServerClient } from "@supabase/auth-helpers-remix";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { createBrowserClient } from "@supabase/auth-helpers-remix";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);

export function getSupabaseServerClient(
  ctx: LoaderFunctionArgs,
  refresh_token?: string,
  access_token?: string
) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

  // Erstelle eine neue Request mit modifizierten Cookies
  const request = new Request(ctx.request);
  const cookieHeader = request.headers.get("Cookie") || "";
  
  // Füge die Tokens als Cookies hinzu, wenn sie vorhanden sind
  let newCookieHeader = cookieHeader;
  if (refresh_token) {
    newCookieHeader += `; sb-refresh-token=${refresh_token}`;
  }
  if (access_token) {
    newCookieHeader += `; sb-access-token=${access_token}`;
  }
  
  // Setze den modifizierten Cookie-Header
  request.headers.set("Cookie", newCookieHeader);

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      request,
      response: new Response(),
    }
  );
}
