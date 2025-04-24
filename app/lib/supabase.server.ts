import { createServerClient } from "@supabase/auth-helpers-remix";
import type { LoaderFunctionArgs } from "@remix-run/node";

export function getSupabaseServerClient(
  ctx: LoaderFunctionArgs,
  refresh_token: string,
  access_token?: string
) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

  // 🆕 Access-Token über Cookie-Header "faken"
  const headers = new Headers(ctx.request.headers);
  if (access_token) {
    headers.set("cookie", `sb-access-token=${access_token}`);
    console.log("[supabase.server] Nutze Cookie-Hack mit sb-access-token");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    request: new Request(ctx.request.url, {
      headers,
    }),
    response: new Response(),
  });
}
