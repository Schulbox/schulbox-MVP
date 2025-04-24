// app/root.tsx
import {
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSupabaseTokensFromSession } from "~/lib/session.server";
import { getSupabaseServerClient } from "~/lib/supabase.server";
import Header from "~/components/Header";
import AuthErrorBoundary from "~/components/AuthErrorBoundary";
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

  const { refresh_token }: { refresh_token: string | null } = await getSupabaseTokensFromSession(request);

  if (typeof refresh_token === "string") {
    console.log("[root.loader] Starte Loader mit refresh_token:", refresh_token.substring(0, 10));
  } else {
    console.log("[root.loader] Kein gültiger refresh_token");
  }

  const supabase = getSupabaseServerClient(
    ctx,
    typeof refresh_token === "string" ? refresh_token : undefined
  );

  if (typeof refresh_token === "string") {
    await supabase.auth.setSession({
      refresh_token,
      access_token: "",
    });
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;
  console.log("[loader] Eingeloggter User:", user);

  let profile: any = null;

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

  return json({
    
    ENV: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  });
}



// ✅ Fehlerbehandlung für die gesamte App
export function ErrorBoundary() {
  const error = useRouteError();
  console.error("[ErrorBoundary] App-Fehler:", error);
  
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Fehler - Schulbox</title>
        <Links />
      </head>
      <body className="bg-white text-gray-900 font-sans">
        <Header user={null} />
        <main className="p-6 max-w-4xl mx-auto">
          <AuthErrorBoundary error={error instanceof Error ? error : undefined}>
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
              <h1 className="text-2xl font-bold text-red-700 mb-4">Ein Fehler ist aufgetreten</h1>
              <p className="mb-4">
                Es tut uns leid, aber bei der Verarbeitung Ihrer Anfrage ist ein Fehler aufgetreten.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Seite neu laden
              </button>
            </div>
          </AuthErrorBoundary>
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// ✅ Finale App mit HTML-Wrapper, Header und Outlet
export default function App() {
  const { ENV } = useLoaderData<typeof loader>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.ENV = ENV;

      // Supabase-Client erstellen und User holen
      const supabase = createBrowserClient(ENV.SUPABASE_URL!, ENV.SUPABASE_ANON_KEY!);

      supabase.auth.getUser().then(({ data, error }) => {
        if (data?.user) {
          setUser(data.user);
          console.log("[App] Clientseitig eingeloggter User:", data.user);
        } else {
          console.warn("[App] Kein User aus getUser():", error);
        }
      });
    }
  }, [ENV]);

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