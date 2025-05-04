// app/utils/auth.server.ts
import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "~/lib/supabase.server";
import { getAccessToken } from "~/lib/shopify/auth.server";


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

export async function authenticate(request: Request) {
  const token = await getAccessToken(); // deine bestehende Methode
  if (!token) {
    throw new Response("Nicht authentifiziert", { status: 401 });
  }
  return true;
}


export async function requireLehrkraft(ctx: LoaderFunctionArgs) {
  const supabase = getSupabaseServerClient(ctx);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw redirect("/login");

  // Hole user-Daten aus "benutzer"-Tabelle
  const { data, error } = await supabase
    .from("benutzer")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (error || data?.role !== "lehrkraft") {
    throw redirect("/");
  }

  return user;
}
