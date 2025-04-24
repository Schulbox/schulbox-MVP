// app/lib/supabase.server.ts
import { createServerClient } from "@supabase/auth-helpers-remix";
import type { LoaderFunctionArgs } from "@remix-run/node";

export function getSupabaseServerClient(
  ctx: LoaderFunctionArgs,
  refresh_token?: string,
  access_token?: string
) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

  const headers = new Headers(ctx.request.headers);

  // Fake die Tokens über den Cookie-Header
  const existing = headers.get("cookie") ?? "";
  const cookies: string[] = [];
  if (refresh_token) cookies.push(`sb-refresh-token=${refresh_token}`);
  if (access_token) cookies.push(`sb-access-token=${access_token}`);
  headers.set("cookie", [existing, ...cookies].filter(Boolean).join("; "));

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    request: new Request(ctx.request.url, { headers }),
    response: new Response(),
  });
}
