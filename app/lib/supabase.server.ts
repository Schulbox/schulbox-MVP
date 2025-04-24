// app/lib/supabase.server.ts
import { createServerClient } from "@supabase/auth-helpers-remix";
import type { LoaderFunctionArgs } from "@remix-run/node";

export function getSupabaseServerClient(
  ctx: LoaderFunctionArgs,
  refresh_token?: string
) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

  const response = new Response();

  // Optionaler Workaround: Wenn du den refresh_token erzwingen willst
  if (refresh_token) {
    ctx.request.headers.set("Cookie", `sb-refresh-token=${refresh_token}`);
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      request: ctx.request,
      response,
    }
  );
}
