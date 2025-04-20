// app/utils/auth.server.ts
import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "~/lib/supabase.server";

export async function requireUser(ctx: LoaderFunctionArgs) {
  const supabase = getSupabaseServerClient(ctx);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect("/login");
  }

  return user;
}

export async function requireLehrkraft(ctx: LoaderFunctionArgs) {
  const supabase = getSupabaseServerClient(ctx);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw redirect("/login");

  // Hole user-Daten aus "users"-Tabelle
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (error || data?.role !== "lehrkraft") {
    throw redirect("/");
  }

  return user;
}
