import { createServerClient } from "@supabase/auth-helpers-remix";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const getSupabaseServerClient = (
  ctx: LoaderFunctionArgs
): SupabaseClient => {
  const { request } = ctx;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Supabase ENV fehlt:", { supabaseUrl, supabaseKey });
    throw new Error("Supabase-Umgebungsvariablen fehlen");
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    request,
    response: new Response(),
  });
};
