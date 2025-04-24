// app/root.tsx
import {
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
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

  if (!refresh_token || !access_token) {
    console.log("[root.loader] Tokens nicht vollständig, User ist nicht eingeloggt");
    return json({ user: null });
  }

  const supabase = getSupabaseServerClient(ctx, refresh_token, access_token);

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("[root.loader] Fehler bei auth.getUser():", userError?.message);

      const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession({
        refresh_token,
      });

      if (sessionError || !sessionData.session) {
        console.error("[root.loader] Session-Refresh fehlgeschlagen:", sessionError?.message);
        return json({ user: null });
      }

      const newCookie = await setSupabaseSessionCookie(
        request,
        sessionData.session.refresh_token,
        sessionData.session.access_token
      );

      const refreshedSupabase = getSupabaseServerClient(
        ctx,
        sessionData.session.refresh_token,
        sessionData.session.access_token
      );

      const {
        data: { user: refreshedUser },
        error: refreshedError,
      } = await refreshedSupabase.auth.getUser();

      if (refreshedError || !refreshedUser) {
        console.error("[root.loader] Fehler nach Session-Refresh:", refreshedError?.message);
        return json({ user: null }, { headers: { "Set-Cookie": newCookie } });
      }

      let profile: User = {
        email: refreshedUser.email ?? "unbekannt",
      };

      try {
        const { data, error } = await refreshedSupabase
          .from("benutzer")
          .select("vorname, nachname, role")
          .eq("user_id", refreshedUser.id)
          .single();

        if (!error && data) {
          profile = { email: refreshedUser.email!, ...data };
        }
      } catch (err) {
        console.warn("[root.loader] Fehler beim Laden des Profils:", err);
      }

      return json({ user: profile }, { headers: { "Set-Cookie": newCookie } });
    }

    let profile: User = {
      email: user.email ?? "unbekannt",
    };

    try {
      const { data, error } = await supabase
        .from("benutzer")
        .select("vorname, nachname, role")
        .eq("user_id", user.id)
        .single();

      if (!error && data) {
        profile = { email: user.email!, ...data };
      }
    } catch (err) {
      console.warn("[root.loader] Fehler beim Laden des Profils:", err);
    }

    return json({ user: profile });
  } catch (error) {
    console.error("[root.loader] Unbehandelte Exception:", error);
    return json({ user: null });
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

type LoaderData = {
  user: User;
};

export default function App() {
  const { user } = useLoaderData<LoaderData>();

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
