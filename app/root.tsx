// app/root.tsx
import {
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
  useRouteError,
} from "@remix-run/react";
import { useEffect } from "react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSupabaseTokensFromSession, setSupabaseSessionCookie } from "~/lib/session.server";
import { getSupabaseServerClient } from "~/lib/supabase.server";
import Header from "~/components/Header";
import AuthErrorBoundary from "~/components/AuthErrorBoundary";
import "./tailwind.css";
import { createBrowserClient } from "@supabase/auth-helpers-remix";

export type User = {
  vorname?: string;
  nachname?: string;
  role?: string;
  email?: string;
} | null;

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&display=swap",
  },
];

function env() {
  return {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  };
}

export async function loader(ctx: LoaderFunctionArgs) {
  const { request } = ctx;
  const { refresh_token, access_token } = await getSupabaseTokensFromSession(request);

  if (!refresh_token || !access_token) {
    console.log("[root.loader] Keine vollständigen Tokens, User ist nicht eingeloggt");
    return json({ user: null, ENV: env() });
  }

  const supabase = getSupabaseServerClient(ctx, refresh_token, access_token);

  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token });

    if (error || !data.session || !data.user) {
      console.error("[root.loader] Fehler beim Session-Refresh:", error?.message);
      return json({ user: null, ENV: env() });
    }

    const cookieHeader = await setSupabaseSessionCookie(
      request,
      data.session.refresh_token,
      data.session.access_token
    );

    const refreshedSupabase = getSupabaseServerClient(
      ctx,
      data.session.refresh_token,
      data.session.access_token
    );

    console.log("[root.loader] Supabase-User-ID:", data.user.id);

    const { data: benutzerProfilRPC, error: rpcError } = await refreshedSupabase
      .rpc('get_benutzer_profil', { user_id_param: data.user.id });

    console.log("[root.loader] RPC-Abfrageergebnis:", benutzerProfilRPC);
    console.log("[root.loader] RPC-Abfragefehler:", rpcError);

    if (!benutzerProfilRPC || benutzerProfilRPC.length === 0) {
      console.log("[root.loader] Kein Profil gefunden, erstelle ein neues Profil");

      const { data: neuesBenutzerProfil, error: upsertError } = await refreshedSupabase.rpc('upsert_benutzer_profil', {
        user_id_param: data.user.id,
        email_param: data.user.email,
        role_param: 'lehrkraft',
      });

      console.log("[root.loader] Ergebnis der Profilerstellung:", neuesBenutzerProfil);
      console.log("[root.loader] Fehler bei Profilerstellung:", upsertError);

      if (neuesBenutzerProfil && neuesBenutzerProfil.length > 0) {
        return json({
          user: {
            email: data.user.email,
            role: neuesBenutzerProfil[0].role,
            vorname: neuesBenutzerProfil[0].vorname,
            nachname: neuesBenutzerProfil[0].nachname,
          },
          ENV: env(),
        }, {
          headers: { "Set-Cookie": cookieHeader }
        });
      }

      // Fallback wenn Profilerstellung fehlschlägt
      return json({
        user: {
          email: data.user.email || "unbekannt",
          role: "lehrkraft",
        },
        ENV: env(),
      }, {
        headers: { "Set-Cookie": cookieHeader }
      });
    }

    const benutzerProfil = benutzerProfilRPC[0];

    return json({
      user: {
        email: data.user.email,
        role: benutzerProfil.role,
        vorname: benutzerProfil.vorname,
        nachname: benutzerProfil.nachname,
      },
      ENV: env(),
    }, {
      headers: { "Set-Cookie": cookieHeader }
    });

  } catch (error) {
    console.error("[root.loader] Schwerwiegender Fehler im Loader:", error);
    return json({ user: null, ENV: env() });
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
  const revalidator = useRevalidator();

  useEffect(() => {
    const supabase = createBrowserClient(ENV.SUPABASE_URL!, ENV.SUPABASE_ANON_KEY!);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      console.log("[App] Auth geändert:", event);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        revalidator.revalidate();
      }
    });

    return () => subscription.unsubscribe();
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
