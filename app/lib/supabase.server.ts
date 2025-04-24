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

  // 🧠 Letzter Versuch, korrekt mit Header-Manipulation statt nicht unterstütztem cookie-Override
  const headers = new Headers(ctx.request.headers);

  if (refresh_token) {
    headers.append("cookie", `sb-refresh-token=${refresh_token}`);
  }
  if (access_token) {
    headers.append("cookie", `sb-access-token=${access_token}`);
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    request: new Request(ctx.request.url, {
      method: ctx.request.method,
      headers,
    }),
    response: new Response(),
  });
}
