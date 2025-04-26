// app/root.tsx - Vereinfachte Version
import {
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSupabaseTokensFromSession } from "~/lib/session.server";
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

  // Wenn kein Session-Marker gefunden wurde, ist der Benutzer nicht eingeloggt
  if (!refresh_token || !access_token) {
    console.log("[root.loader] Keine Session gefunden, User ist nicht eingeloggt");
    return json({ user: null, ENV: env() });
  }

  // Hier wird nur geprüft, ob der Session-Marker vorhanden ist
  // Die eigentlichen Tokens werden clientseitig aus localStorage geholt
  console.log("[root.loader] Session-Marker gefunden, User ist eingeloggt");
  
  // Wir geben nur die ENV-Variablen zurück, der Rest wird clientseitig gehandhabt
  return json({ 
    user: null, // Wird clientseitig gefüllt
    ENV: env() 
  });
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
  const { ENV } = useLoaderData<typeof loader>();
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    // Hole Tokens aus localStorage
    const refresh_token = localStorage.getItem('sb-refresh-token');
    const access_token = localStorage.getItem('sb-access-token');
    
    if (!refresh_token || !access_token) {
      console.log("[App] Keine Tokens im localStorage gefunden");
      return;
    }
    
    console.log("[App] Tokens aus localStorage geladen");
    
    // Erstelle Supabase-Client mit den Tokens aus localStorage
    const supabase = createBrowserClient(ENV.SUPABASE_URL!, ENV.SUPABASE_ANON_KEY!);
    
    // Setze die Tokens im Supabase-Client
    supabase.auth.setSession({
      refresh_token,
      access_token
    });
    
    // Hole Benutzerdaten
    const fetchUserData = async () => {
      try {
        // Hole Benutzer-ID
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) {
          console.error("[App] Kein Benutzer gefunden");
          return;
        }
        
        console.log("[App] Benutzer-ID:", authData.user.id);
        
        // Hole Benutzerprofil mit RPC
        const { data: benutzerProfilRPC, error: rpcError } = await supabase
          .rpc('get_benutzer_profil', { user_id_param: authData.user.id });
        
        console.log("[App] RPC-Abfrageergebnis:", benutzerProfilRPC);
        
        if (rpcError) {
          console.error("[App] RPC-Abfragefehler:", rpcError);
          return;
        }
        
        if (!benutzerProfilRPC || benutzerProfilRPC.length === 0) {
          console.log("[App] Kein Profil gefunden, erstelle ein neues Profil");
          
          const { data: neuesBenutzerProfil, error: upsertError } = await supabase
            .rpc('upsert_benutzer_profil', {
              user_id_param: authData.user.id,
              email_param: authData.user.email,
              role_param: 'lehrkraft',
            });
          
          console.log("[App] Ergebnis der Profilerstellung:", neuesBenutzerProfil);
          
          if (upsertError) {
            console.error("[App] Fehler bei Profilerstellung:", upsertError);
            return;
          }
          
          if (neuesBenutzerProfil && neuesBenutzerProfil.length > 0) {
            setUser({
              email: authData.user.email,
              role: neuesBenutzerProfil[0].role,
              vorname: neuesBenutzerProfil[0].vorname,
              nachname: neuesBenutzerProfil[0].nachname,
            });
            return;
          }
          
          // Fallback wenn Profilerstellung fehlschlägt
          setUser({
            email: authData.user.email || "unbekannt",
            role: "lehrkraft",
          });
          return;
        }
        
        const benutzerProfil = benutzerProfilRPC[0];
        
        setUser({
          email: authData.user.email,
          role: benutzerProfil.role,
          vorname: benutzerProfil.vorname,
          nachname: benutzerProfil.nachname,
        });
      } catch (error) {
        console.error("[App] Fehler beim Laden der Benutzerdaten:", error);
      }
    };
    
    fetchUserData();
    
    // Auth-Zustandsänderungen überwachen
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      console.log("[App] Auth geändert:", event);
      
      if (event === "SIGNED_OUT") {
        // Lösche Tokens aus localStorage
        localStorage.removeItem('sb-refresh-token');
        localStorage.removeItem('sb-access-token');
        setUser(null);
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
        
        {/* Meta-Tags für Supabase-Tokens */}
        {document.querySelector('meta[name="x-supabase-refresh-token"]')?.getAttribute('content') && (
          <meta 
            name="x-supabase-refresh-token" 
            content={document.querySelector('meta[name="x-supabase-refresh-token"]')?.getAttribute('content') || ""}
          />
        )}
        {document.querySelector('meta[name="x-supabase-access-token"]')?.getAttribute('content') && (
          <meta 
            name="x-supabase-access-token" 
            content={document.querySelector('meta[name="x-supabase-access-token"]')?.getAttribute('content') || ""}
          />
        )}
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
