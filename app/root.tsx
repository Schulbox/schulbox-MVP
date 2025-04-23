// app/root.tsx
import {
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSupabaseTokensFromSession } from "~/lib/session.server"; // 👈 hinzugefügt
import { getSupabaseServerClient } from "~/lib/supabase.server";
import Header from "~/components/Header";
import "./tailwind.css";

// 💡 Typ für das User-Profil
export type User = {
  vorname?: string;
  nachname?: string;
  role?: string;
  email: string;
} | null;

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&display=swap",
  },
];

// ✅ Loader lädt user-Daten
export async function loader(ctx: LoaderFunctionArgs) {
  const { request } = ctx;
  const { refresh_token } = await getSupabaseTokensFromSession(request);
  const supabase = getSupabaseServerClient(ctx, refresh_token ?? undefined);
  
  

  const { data: { user } } = await supabase.auth.getUser();
  console.log("[loader] Eingeloggter User:", user);

  let profile: User = null;

  if (user?.id) {
    const { data, error } = await supabase
      .from("benutzer")
      .select("vorname, nachname, role")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("[loader] Fehler beim Laden des Profils:", error.message);
    } else {
      profile = {
        email: user.email ?? "unbekannt",
        ...data,
      };
    }
  } else {
    console.warn("[loader] Kein user.id verfügbar!");
  }

  console.log("[loader] Fertiges Profil:", profile);
  return json({ user: profile });
}

// ✅ Finale App mit HTML-Wrapper, Header und Outlet
export default function App() {
  const { user } = useLoaderData<typeof loader>();

  console.log("📦 [App] useLoaderData() gibt zurück:", user);

  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Schulbox</title>
        <Links />
      </head>
      <body className="bg-white text-gray-900 font-sans">
        <Header user={user} />
        <main>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}