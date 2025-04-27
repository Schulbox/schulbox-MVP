// localStorage-only Root-Komponente
import { useEffect, useState, useCallback } from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseTokensFromSession } from "~/lib/session.server";
import Header from "~/components/Header";
import "~/styles/tailwind.css"; // oder dein korrekter Pfad
import { useOutletContext } from "@remix-run/react";


// Typ für den Benutzer
type User = {
  email?: string;
  role?: string;
  vorname?: string;
  nachname?: string;
} | null;

type OutletContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>; // 👈🏻 Funktion, die wir gleich übergeben
};


export async function loader({ request }: LoaderFunctionArgs) {
  // Erstelle Supabase-Client
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  // Prüfe, ob der Benutzer eingeloggt ist (im localStorage-only Ansatz immer false)
  // Die eigentliche Authentifizierung erfolgt client-seitig
  const isLoggedIn = false;
  
  console.log("[root.loader] localStorage-only Ansatz: Server-seitig immer nicht eingeloggt");

  return json(
    {
      ENV: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      },
      isLoggedIn,
    },
    {
      headers: response.headers,
    }
  );
}



export default function App() {
  const { ENV, isLoggedIn: serverIsLoggedIn } = useLoaderData<typeof loader>();
  const [user, setUser] = useState<User>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const revalidator = useRevalidator();

  // Initialisiere Supabase-Client
  const initializeSupabase = useCallback(() => {
    try {
      // Prüfe, ob localStorage verfügbar ist
      if (typeof window === 'undefined' || !window.localStorage) {
        console.log("[App] localStorage nicht verfügbar");
        return null;
      }

      // Prüfe, ob der Benutzer eingeloggt ist (localStorage-Flag)
      const isLoggedInFlag = localStorage.getItem('sb-is-logged-in');
      if (isLoggedInFlag !== 'true') {
        console.log("[App] Benutzer ist nicht eingeloggt (localStorage-Flag)");
        return null;
      }

      // Hole Tokens aus localStorage
      const refreshToken = localStorage.getItem('sb-refresh-token');
      const accessToken = localStorage.getItem('sb-access-token');

      if (!refreshToken || !accessToken) {
        console.log("[App] Keine Tokens im localStorage gefunden");
        return null;
      }

      console.log("[App] Tokens aus localStorage geladen");

      // Erstelle Supabase-Client mit den Tokens
      const supabase = createClient(ENV.SUPABASE_URL!, ENV.SUPABASE_ANON_KEY!, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      });

      // Setze die Session
      supabase.auth.setSession({
        refresh_token: refreshToken,
        access_token: accessToken,
      });

      return supabase;
    } catch (error) {
      console.error("[App] Fehler beim Initialisieren von Supabase:", error);
      return null;
    }
  }, [ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY]);

  // Lade Benutzerdaten
  const fetchUserData = useCallback(async (supabase: any) => {
    try {
      // Prüfe zuerst, ob Benutzerdaten im localStorage-Cache vorhanden sind
      const cachedUserData = localStorage.getItem('user-profile-cache');
      if (cachedUserData) {
        try {
          const userData = JSON.parse(cachedUserData);
          const cacheTime = localStorage.getItem('user-profile-cache-time');
          
          // Verwende Cache, wenn er weniger als 5 Minuten alt ist
          if (cacheTime && (Date.now() - parseInt(cacheTime)) < 5 * 60 * 1000) {
            console.log("[App] Verwende gecachte Benutzerdaten:", userData);
            return userData;
          }
        } catch (e) {
          console.error("[App] Fehler beim Parsen des Benutzer-Caches:", e);
        }
      }

      // Hole Benutzer-ID
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error("[App] Fehler beim Abrufen des Benutzers:", authError);
        return null;
      }
      
      if (!authData.user) {
        console.error("[App] Kein Benutzer gefunden");
        return null;
      }
      
      console.log("[App] Benutzer-ID:", authData.user.id);
      
      // Versuche zuerst, die RPC-Funktion zu verwenden
      console.log("[App] Versuche RPC-Funktion 'get_benutzer_profil'...");
      const { data: benutzerProfilRPC, error: rpcError } = await supabase
        .rpc('get_benutzer_profil', { user_id_param: authData.user.id });
      
      if (rpcError) {
        console.error("[App] RPC-Abfragefehler:", rpcError.message);
        console.log("[App] Fallback: Direkter Zugriff auf die Benutzer-Tabelle...");
        
        // Direkter Zugriff auf die Benutzer-Tabelle als Fallback
        const { data: benutzerDaten, error: benutzerError } = await supabase
          .from('benutzer')
          .select('vorname, nachname, role')
          .eq('user_id', authData.user.id)
          .single();
        
        if (benutzerError) {
          console.error("[App] Fehler bei direkter Benutzerabfrage:", benutzerError.message);
          
          // Fallback: Erstelle ein neues Benutzerprofil direkt in der Tabelle
          console.log("[App] Fallback: Erstelle neues Benutzerprofil...");
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
            console.error("[App] Fehler beim Erstellen des Benutzerprofils:", insertError.message);
            
            // Letzter Fallback: Verwende nur die E-Mail-Adresse
            console.log("[App] Letzter Fallback: Verwende nur E-Mail-Adresse");
            const fallbackData = {
              email: authData.user.email || "unbekannt",
              role: "lehrkraft",
            };
            
            localStorage.setItem('user-profile-cache', JSON.stringify(fallbackData));
            localStorage.setItem('user-profile-cache-time', Date.now().toString());
            
            return fallbackData;
          }
          
          if (neuerBenutzer && neuerBenutzer.length > 0) {
            console.log("[App] Neues Benutzerprofil erstellt:", neuerBenutzer[0]);
            const userData = {
              email: authData.user.email,
              role: neuerBenutzer[0].role,
              vorname: neuerBenutzer[0].vorname,
              nachname: neuerBenutzer[0].nachname,
            };
            
            localStorage.setItem('user-profile-cache', JSON.stringify(userData));
            localStorage.setItem('user-profile-cache-time', Date.now().toString());
            
            return userData;
          }
          
          return null;
        }
        
        // Wenn wir hier sind, haben wir erfolgreich Benutzerdaten abgerufen
        console.log("[App] Benutzerdaten erfolgreich abgerufen:", benutzerDaten);
        const userData = {
          email: authData.user.email,
          role: benutzerDaten.role,
          vorname: benutzerDaten.vorname,
          nachname: benutzerDaten.nachname,
        };
        
        // Cache die Benutzerdaten
        localStorage.setItem('user-profile-cache', JSON.stringify(userData));
        localStorage.setItem('user-profile-cache-time', Date.now().toString());
        
        return userData;
      }
      
      // RPC-Funktion hat funktioniert
      if (benutzerProfilRPC && benutzerProfilRPC.length > 0) {
        console.log("[App] RPC-Abfrage erfolgreich:", benutzerProfilRPC[0]);
        const userData = {
          email: authData.user.email,
          role: benutzerProfilRPC[0].role,
          vorname: benutzerProfilRPC[0].vorname,
          nachname: benutzerProfilRPC[0].nachname,
        };
        
        // Cache die Benutzerdaten
        localStorage.setItem('user-profile-cache', JSON.stringify(userData));
        localStorage.setItem('user-profile-cache-time', Date.now().toString());
        
        return userData;
      }
      
      // Kein Profil gefunden, erstelle ein neues
      console.log("[App] Kein Profil gefunden, erstelle ein neues Profil");
      
      // Versuche zuerst die RPC-Funktion
      console.log("[App] Versuche RPC-Funktion 'upsert_benutzer_profil'...");
      const { data: neuesBenutzerProfil, error: upsertError } = await supabase
        .rpc('upsert_benutzer_profil', {
          user_id_param: authData.user.id,
          email_param: authData.user.email,
          role_param: 'lehrkraft',
        });
      
      if (upsertError) {
        console.error("[App] Fehler bei RPC-Profilerstellung:", upsertError.message);
        
        // Fallback: Direkter Zugriff auf die Tabelle
        console.log("[App] Fallback: Direkter Zugriff auf die Tabelle für Profilerstellung...");
        const { data: neuerBenutzer, error: insertError } = await supabase
          .from('benutzer')
          .upsert({
            user_id: authData.user.id,
            vorname: '',
            nachname: '',
            role: 'lehrkraft'
          })
          .select();
        
        if (insertError) {
          console.error("[App] Fehler beim Erstellen des Benutzerprofils:", insertError.message);
          
          // Letzter Fallback: Verwende nur die E-Mail-Adresse
          console.log("[App] Letzter Fallback: Verwende nur E-Mail-Adresse");
          const fallbackData = {
            email: authData.user.email || "unbekannt",
            role: "lehrkraft",
          };
          
          localStorage.setItem('user-profile-cache', JSON.stringify(fallbackData));
          localStorage.setItem('user-profile-cache-time', Date.now().toString());
          
          return fallbackData;
        }
        
        if (neuerBenutzer && neuerBenutzer.length > 0) {
          console.log("[App] Neues Benutzerprofil erstellt:", neuerBenutzer[0]);
          const userData = {
            email: authData.user.email,
            role: neuerBenutzer[0].role,
            vorname: neuerBenutzer[0].vorname,
            nachname: neuerBenutzer[0].nachname,
          };
          
          localStorage.setItem('user-profile-cache', JSON.stringify(userData));
          localStorage.setItem('user-profile-cache-time', Date.now().toString());
          
          return userData;
        }
        
        return null;
      }
      
      if (neuesBenutzerProfil && neuesBenutzerProfil.length > 0) {
        console.log("[App] Neues Benutzerprofil erstellt (RPC):", neuesBenutzerProfil[0]);
        const userData = {
          email: authData.user.email,
          role: neuesBenutzerProfil[0].role,
          vorname: neuesBenutzerProfil[0].vorname,
          nachname: neuesBenutzerProfil[0].nachname,
        };
        
        // Cache die Benutzerdaten
        localStorage.setItem('user-profile-cache', JSON.stringify(userData));
        localStorage.setItem('user-profile-cache-time', Date.now().toString());
        
        return userData;
      }
      
      // Fallback wenn Profilerstellung fehlschlägt
      console.log("[App] Fallback: Verwende nur E-Mail-Adresse");
      const fallbackData = {
        email: authData.user.email || "unbekannt",
        role: "lehrkraft",
      };
      
      localStorage.setItem('user-profile-cache', JSON.stringify(fallbackData));
      localStorage.setItem('user-profile-cache-time', Date.now().toString());
      
      return fallbackData;
    } catch (error) {
      console.error("[App] Fehler beim Laden der Benutzerdaten:", error);
      return null;
    }
  }, []);

  async function initializeAuth() {
    setIsLoading(true);
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        console.log("[App] localStorage nicht verfügbar");
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
        return;
      }
  
      const isLoggedInFlag = localStorage.getItem("sb-is-logged-in");
  
      if (isLoggedInFlag === "true") {
        console.log("[App] Benutzer ist eingeloggt (localStorage-Flag)");
  
        const supabase = initializeSupabase();
        if (!supabase) {
          console.log("[App] Supabase konnte nicht initialisiert werden");
          setIsLoggedIn(false);
          setUser(null);
          setIsLoading(false);
          return;
        }
  
        const userData = await fetchUserData(supabase);
        if (userData) {
          console.log("[App] Benutzerdaten geladen:", userData);
          setUser(userData);
          setIsLoggedIn(true);
        } else {
          console.log("[App] Keine Benutzerdaten gefunden");
          setUser(null);
          setIsLoggedIn(true); // eingeloggt ohne Profil
        }
      } else {
        console.log("[App] Benutzer ist nicht eingeloggt (localStorage-Flag)");
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("[App] Fehler bei der Authentifizierung:", error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }
  

  // Initialisiere Authentifizierung
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        if (typeof window === "undefined" || !window.localStorage) {
          console.log("[App] localStorage nicht verfügbar");
          setIsLoggedIn(false);
          setUser(null);
          setIsLoading(false);
          return;
        }
  
        const isLoggedInFlag = localStorage.getItem("sb-is-logged-in");
  
        if (isLoggedInFlag === "true") {
          console.log("[App] Benutzer ist eingeloggt (localStorage-Flag)");
  
          const supabase = initializeSupabase();
          if (!supabase) {
            console.log("[App] Supabase konnte nicht initialisiert werden");
            setIsLoggedIn(false);
            setUser(null);
            setIsLoading(false);
            return;
          }
  
          const userData = await fetchUserData(supabase);
          if (userData) {
            console.log("[App] Benutzerdaten geladen:", userData);
            setUser(userData);
            setIsLoggedIn(true);
          } else {
            console.log("[App] Keine Benutzerdaten gefunden");
            setUser(null);
            setIsLoggedIn(true); // eingeloggt ohne Profil
          }
        } else {
          console.log("[App] Benutzer ist nicht eingeloggt (localStorage-Flag)");
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("[App] Fehler bei der Authentifizierung:", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
  
    initializeAuth();
  
    // --- NEU: bei JEDER Änderung von localStorage sofort updaten
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && (event.key.startsWith('sb-') || event.key === 'user-profile-cache' || event.key === 'sb-is-logged-in')) {
        console.log("[App] Storage-Änderung erkannt:", event.key, event.newValue);
        initializeAuth();
      }
    };
  
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initializeSupabase, fetchUserData]);
  
  const refreshAuth = initializeAuth;


  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header user={user} isLoggedIn={isLoggedIn} isLoading={isLoading} />
        <Outlet context={{ user, isLoggedIn, isLoading, refreshAuth, initializeAuth }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
