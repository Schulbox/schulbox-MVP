// app/lib/supabase.server.ts
import { createServerClient } from "@supabase/auth-helpers-remix";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const getSupabaseServerClient = (ctx: LoaderFunctionArgs): SupabaseClient => {
  const { request } = ctx;

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      request,
      response: new Response(), // optional, für Cookies wenn nötig
    }
  );
};
