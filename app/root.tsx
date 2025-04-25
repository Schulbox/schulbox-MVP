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
import { getSupabaseTokensFromSession, setSupabaseSessionCookie } from "~/lib/session.server";
import { getSupabaseServerClient } from "~/lib/supabase.server";
import Header from "~/components/Header";
import AuthErrorBoundary from "~/components/AuthErrorBoundary";
import "./tailwind.css";

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

export async function loader(ctx: LoaderFunctionArgs) {
  const { request } = ctx;
  const { refresh_token, access_token } = await getSupabaseTokensFromSession(request);

  console.log("[root.loader] Tokens aus Session:",
    refresh_token ? "Refresh-Token vorhanden" : "kein Refresh-Token",
    access_token ? "Access-Token vorhanden" : "kein Access-Token"
  );

  if (!refresh_token || !access_token) {
    console.log("[root.loader] Keine vollständigen Tokens, User ist nicht eingeloggt");
    return json({
      user: null,
      ENV: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
      }
    });
  }

  const supabase = getSupabaseServerClient(ctx, refresh_token, access_token);

  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token });

    if (error) {
      console.error("[root.loader] Fehler beim Session-Refresh:", error.message);
      return json({
        user: null,
        ENV: {
          SUPABASE_URL: process.env.SUPABASE_URL,
          SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
        }
      });
    }

    if (!data.session || !data.user) {
      console.error("[root.loader] Session-Refresh erfolgreich, aber keine Benutzerdaten");
      return json({
        user: null,
        ENV: {
          SUPABASE_URL: process.env.SUPABASE_URL,
          SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
        }
      });
    }

    console.log("[root.loader] Session erfolgreich refreshed:", data.user.id);

    const newCookie = await setSupabaseSessionCookie(
      request,
      data.session.refresh_token,
      data.session.access_token
    );

    const refreshedSupabase = getSupabaseServerClient(
      ctx,
      data.session.refresh_token,
      data.session.access_token
    );

    try {
      const { data: profileData, error: profileError } = await refreshedSupabase
        .from("benutzer")
        .select("vorname, nachname, role")
        .eq("user_id", data.user.id)
        .single();

      if (profileError || !profileData) {
        console.log("[root.loader] Kein Profil gefunden, erstelle neues Profil");

        const { data: insertedProfile, error: insertError } = await refreshedSupabase
          .from("benutzer")
          .insert({
            user_id: data.user.id,
            email: data.user.email,
            vorname: "Vorname",
            nachname: "Nachname",
            role: "lehrkraft"
          })
          .select()
          .single();
        
        if (insertError || !insertedProfile) {
          console.warn("[root.loader] Fehler beim Einfügen, fallback auf Basis-Profil");
          return json({
            user: {
              email: data.user.email || "unbekannt",
              role: "lehrkraft"
            },
            ENV: {
              SUPABASE_URL: process.env.SUPABASE_URL,
              SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
            }
          }, {
            headers: { "Set-Cookie": newCookie }
          });
        }
        
        console.log("[root.loader] Neues Profil erstellt:", insertedProfile);
        
        return json({
          user: insertedProfile,
          ENV: {
            SUPABASE_URL: process.env.SUPABASE_URL,
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
          }
        }, {
          headers: { "Set-Cookie": newCookie }
        });
        
      }

      const profile = {
        email: data.user.email || "unbekannt",
        ...profileData
      };

      console.log("[root.loader] Fertiges Profil:", profile);

      return json({
        user: profile,
        ENV: {
          SUPABASE_URL: process.env.SUPABASE_URL,
          SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
        }
      }, {
        headers: { "Set-Cookie": newCookie }
      });

    } catch (err) {
      console.error("[root.loader] Exception beim Laden des Profils:", err);

      const { data: newProfile, error: insertError } = await refreshedSupabase
        .from("benutzer")
        .insert({
          user_id: data.user.id,
          email: data.user.email,
          vorname: "Neuer",
          nachname: "Benutzer",
          role: "lehrkraft"
        })
        .select()
        .single();

      if (insertError) {
        console.error("[root.loader] Fehler beim Erstellen des Profils:", insertError.message);

        return json({
          user: {
            email: data.user.email || "unbekannt",
            role: "lehrkraft"
          },
          ENV: {
            SUPABASE_URL: process.env.SUPABASE_URL,
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
          }
        }, {
          headers: { "Set-Cookie": newCookie }
        });
      } else {
        console.log("[root.loader] Neues Profil erstellt:", newProfile);
        return json({
          user: newProfile,
          ENV: {
            SUPABASE_URL: process.env.SUPABASE_URL,
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
          }
        }, {
          headers: { "Set-Cookie": newCookie }
        });
      }
    }
  } catch (error) {
    console.error("[root.loader] Schwerwiegender Fehler im Loader:", error);
    return json({
      user: null,
      ENV: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
      }
    });
  }
}

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

export default function App() {
  const { ENV, user } = useLoaderData<typeof loader>();
  const [clientUser, setClientUser] = useState<any>(user);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.ENV = ENV;
      const supabase = createBrowserClient(ENV.SUPABASE_URL!, ENV.SUPABASE_ANON_KEY!);

      supabase.auth.getUser().then(({ data, error }) => {
        if (data?.user) {
          setClientUser((prev: User | null) => prev || data.user);
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
        <Header user={clientUser} />
        <main>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
