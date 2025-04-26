// Verbesserte Version der Root-Komponente mit robusterer Benutzerprofilabfrage
import {
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useState, useCallback } from "react";
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
    return json({ user: null, ENV: env(), isLoggedIn: false });
  }

  // Hier wird nur geprüft, ob der Session-Marker vorhanden ist
  // Die eigentlichen Tokens werden clientseitig aus localStorage geholt
  console.log("[root.loader] Session-Marker gefunden, User ist eingeloggt");
  
  // Wir geben nur die ENV-Variablen zurück, der Rest wird clientseitig gehandhabt
  return json({ 
    user: null, // Wird clientseitig gefüllt
    ENV: env(),
    isLoggedIn: true
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
  const { ENV, isLoggedIn } = useLoaderData<typeof loader>();
  const [user, setUser] = useState<User>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Verbesserte Funktion zum Speichern von Tokens im localStorage
  const saveTokensToLocalStorage = useCallback((refresh_token: string, access_token: string) => {
    try {
      localStorage.setItem('sb-refresh-token', refresh_token);
      localStorage.setItem('sb-access-token', access_token);
      localStorage.setItem('sb-auth-timestamp', Date.now().toString());
      console.log("[App] Tokens erfolgreich im localStorage gespeichert");
      return true;
    } catch (error) {
      console.error("[App] Fehler beim Speichern der Tokens im localStorage:", error);
      return false;
    }
  }, []);

  // Verbesserte Funktion zum Laden von Tokens aus localStorage
  const loadTokensFromLocalStorage = useCallback(() => {
    try {
      const refresh_token = localStorage.getItem('sb-refresh-token');
      const access_token = localStorage.getItem('sb-access-token');
      const timestamp = localStorage.getItem('sb-auth-timestamp');
      
      if (!refresh_token || !access_token) {
        console.log("[App] Keine Tokens im localStorage gefunden");
        return null;
      }
      
      console.log("[App] Tokens aus localStorage geladen, gespeichert am:", timestamp);
      return { refresh_token, access_token };
    } catch (error) {
      console.error("[App] Fehler beim Laden der Tokens aus localStorage:", error);
      return null;
    }
  }, []);

  // Effekt zum Laden der Tokens aus localStorage und Abrufen der Benutzerdaten
  useEffect(() => {
    // Prüfe, ob wir im Browser sind
    if (typeof window === 'undefined') {
      return; // Nicht im Browser, beende frühzeitig
    }
    
    const initializeAuth = async () => {
      try {
        // Wenn der Server sagt, dass wir nicht eingeloggt sind, aber wir haben Tokens im localStorage,
        // versuchen wir trotzdem, die Tokens zu verwenden
        const tokens = loadTokensFromLocalStorage();
        
        if (!tokens && !isLoggedIn) {
          console.log("[App] Nicht eingeloggt und keine Tokens im localStorage");
          setIsInitialized(true);
          return;
        }
        
        if (!tokens && isLoggedIn) {
          console.log("[App] Server sagt eingeloggt, aber keine Tokens im localStorage - inkonsistenter Zustand");
          setIsInitialized(true);
          return;
        }
        
        // Ab hier haben wir Tokens
        const { refresh_token, access_token } = tokens!;
        
        // Erstelle Supabase-Client mit den Tokens aus localStorage
        const supabase = createBrowserClient(ENV.SUPABASE_URL!, ENV.SUPABASE_ANON_KEY!);
        
        // Setze die Tokens im Supabase-Client
        const { error: sessionError } = await supabase.auth.setSession({
          refresh_token,
          access_token
        });
        
        if (sessionError) {
          console.error("[App] Fehler beim Setzen der Session:", sessionError);
          // Tokens sind möglicherweise ungültig, entferne sie
          localStorage.removeItem('sb-refresh-token');
          localStorage.removeItem('sb-access-token');
          localStorage.removeItem('sb-auth-timestamp');
          localStorage.removeItem('user-profile-cache');
          localStorage.removeItem('user-profile-cache-time');
          setIsInitialized(true);
          return;
        }
        
        // Hole Benutzerdaten
        await fetchUserData(supabase);
        setIsInitialized(true);
        
        // Auth-Zustandsänderungen überwachen
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event) => {
          console.log("[App] Auth geändert:", event);
          
          if (event === "SIGNED_OUT") {
            // Lösche Tokens und Cache aus localStorage
            localStorage.removeItem('sb-refresh-token');
            localStorage.removeItem('sb-access-token');
            localStorage.removeItem('sb-auth-timestamp');
            localStorage.removeItem('user-profile-cache');
            localStorage.removeItem('user-profile-cache-time');
            setUser(null);
          } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            // Aktualisiere Tokens im localStorage
            supabase.auth.getSession().then(({ data }) => {
              if (data.session) {
                saveTokensToLocalStorage(
                  data.session.refresh_token,
                  data.session.access_token
                );
                fetchUserData(supabase);
              }
            });
          }
        });
        
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("[App] Fehler bei der Initialisierung:", error);
        setIsInitialized(true);
      }
    };
    
    // Funktion zum Abrufen der Benutzerdaten
    const fetchUserData = async (supabase: any) => {
      try {
        // Prüfe zuerst, ob Benutzerdaten im localStorage-Cache vorhanden sind
        const cachedUserData = localStorage.getItem('user-profile-cache');
        if (cachedUserData) {
          try {
            const userData = JSON.parse(cachedUserData);
            const cacheTime = localStorage.getItem('user-profile-cache-time');
            
            // Verwende Cache, wenn er weniger als 5 Minuten alt ist
            if (cacheTime && (Date.now() - parseInt(cacheTime)) < 5 * 60 * 1000) {
              console.log("[App] Verwende gecachte Benutzerdaten");
              setUser(userData);
              return;
            }
          } catch (e) {
            console.error("[App] Fehler beim Parsen des Benutzer-Caches:", e);
          }
        }

        // Hole Benutzer-ID
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error("[App] Fehler beim Abrufen des Benutzers:", authError);
          return;
        }
        
        if (!authData.user) {
          console.error("[App] Kein Benutzer gefunden");
          return;
        }
        
        console.log("[App] Benutzer-ID:", authData.user.id);
        
        // Direkter Zugriff auf die Benutzer-Tabelle als Fallback
        const { data: benutzerDaten, error: benutzerError } = await supabase
          .from('benutzer')
          .select('vorname, nachname, role')
          .eq('user_id', authData.user.id)
          .single();
        
        if (benutzerError) {
          console.error("[App] Fehler bei direkter Benutzerabfrage:", benutzerError);
          
          // Fallback: Erstelle ein neues Benutzerprofil direkt in der Tabelle
          const { data: neuerBenutzer, error: insertError } = await supabase
            .from('benutzer')
            .upsert({
              user_id: authData.user.id,
              vorname: '',
              nachname: '',
              role: 'lehrkraft',
              email: authData.user.email
            })
            .select();
          
          if (insertError) {
            console.error("[App] Fehler beim Erstellen des Benutzerprofils:", insertError);
            
            // Letzter Fallback: Verwende nur die E-Mail-Adresse
            const fallbackData = {
              email: authData.user.email || "unbekannt",
              role: "lehrkraft",
            };
            
            localStorage.setItem('user-profile-cache', JSON.stringify(fallbackData));
            localStorage.setItem('user-profile-cache-time', Date.now().toString());
            
            setUser(fallbackData);
            return;
          }
          
          if (neuerBenutzer && neuerBenutzer.length > 0) {
            const userData = {
              email: authData.user.email,
              role: neuerBenutzer[0].role,
              vorname: neuerBenutzer[0].vorname,
              nachname: neuerBenutzer[0].nachname,
            };
            
            localStorage.setItem('user-profile-cache', JSON.stringify(userData));
            localStorage.setItem('user-profile-cache-time', Date.now().toString());
            
            setUser(userData);
          }
          
          return;
        }
        
        // Wenn wir hier sind, haben wir erfolgreich Benutzerdaten abgerufen
        const userData = {
          email: authData.user.email,
          role: benutzerDaten.role,
          vorname: benutzerDaten.vorname,
          nachname: benutzerDaten.nachname,
        };
        
        // Cache die Benutzerdaten
        localStorage.setItem('user-profile-cache', JSON.stringify(userData));
        localStorage.setItem('user-profile-cache-time', Date.now().toString());
        
        setUser(userData);
      } catch (error) {
        console.error("[App] Fehler beim Laden der Benutzerdaten:", error);
      }
    };
    
    initializeAuth();
  }, [ENV, isLoggedIn, loadTokensFromLocalStorage, saveTokensToLocalStorage]);

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
          {isInitialized ? (
            <Outlet />
          ) : (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
