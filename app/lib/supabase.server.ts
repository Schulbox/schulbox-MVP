// app/lib/supabase.server.ts
import { createServerClient } from "@supabase/auth-helpers-remix";
import type { LoaderFunctionArgs } from "@remix-run/node";

export function getSupabaseServerClient(ctx: LoaderFunctionArgs, refresh_token?: string) {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      request: ctx.request,
      response: new Response(), // wird intern überschrieben
    }
  );
}
