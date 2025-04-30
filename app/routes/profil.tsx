// app/routes/profil.tsx
import { useState, useEffect } from "react";
import { Form, useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { getSupabaseTokensFromSession } from "~/lib/session.server";
import { User } from "~/root";

type ProfileData = {
  user_id?: string;
  vorname?: string;
  nachname?: string;
  adresse?: string;
  plz?: string;
  ort?: string;
  telefon?: string;
  role?: string;
  email?: string;
};

type ActionResponse = {
  success?: boolean;
  error?: string | null;
};


export async function loader({ request }: LoaderFunctionArgs) {
  // Hole Tokens aus Cookies
  const { refresh_token, access_token } = await getSupabaseTokensFromSession(request);
  
  // Wenn keine Tokens vorhanden sind, leite zum Login weiter
  if (!refresh_token && !access_token) {
    // Prüfe, ob localStorage-Tokens vorhanden sind (Client-seitig)
    return json({ 
      profile: null,
      error: null,
      needsClientAuth: true
    });
  }

  // Erstelle Supabase-Client
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  try {
    // Setze die Session, wenn Tokens vorhanden sind
    if (refresh_token && access_token) {
      await supabase.auth.setSession({
        refresh_token,
        access_token
      });
    }

    // Hole Benutzer-ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("[profil.loader] Fehler beim Abrufen des Benutzers:", userError?.message);
      return json({ 
        profile: null,
        error: "Benutzer konnte nicht authentifiziert werden.",
        needsClientAuth: true
      });
    }

    // Hole Benutzerprofil
    const { data: profile, error: profileError } = await supabase
      .from("benutzer")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("[profil.loader] Fehler beim Laden des Profils:", profileError.message);
      
      // Wenn das Profil nicht existiert, erstelle ein leeres Profil
      if (profileError.code === "PGRST116") {
        return json({ 
          profile: { 
            user_id: user.id,
            email: user.email,
            role: "lehrkraft" 
          },
          error: null,
          needsClientAuth: false
        }, {
          headers: response.headers
        });
      }
      
      return json({ 
        profile: null,
        error: "Profil konnte nicht geladen werden.",
        needsClientAuth: false
      }, {
        headers: response.headers
      });
    }

    return json({ 
      profile: {
        ...profile,
        email: user.email
      },
      error: null,
      needsClientAuth: false
    }, {
      headers: response.headers
    });
  } catch (error) {
    console.error("[profil.loader] Unerwarteter Fehler:", error);
    return json({ 
      profile: null,
      error: "Ein unerwarteter Fehler ist aufgetreten.",
      needsClientAuth: true
    });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  // Hole Tokens aus Cookies
  const { refresh_token, access_token } = await getSupabaseTokensFromSession(request);
  
  // Wenn keine Tokens vorhanden sind, gib Fehler zurück
  if (!refresh_token && !access_token) {
    return json<ActionResponse>({ 
      success: false,
      error: "Nicht authentifiziert. Bitte melden Sie sich an."
    });
  }

  // Erstelle Supabase-Client
  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  try {
    // Setze die Session
    if (refresh_token && access_token) {
      await supabase.auth.setSession({
        refresh_token,
        access_token,
      });
    }
    

    // Hole Benutzer-ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("[profil.action] Fehler beim Abrufen des Benutzers:", userError?.message);
      return json<ActionResponse>({ 
        success: false,
        error: "Benutzer konnte nicht authentifiziert werden."
      });
    }

    // Hole Formulardaten
    const formData = await request.formData();
    const profileData: ProfileData = {
      user_id: user.id,
      vorname: (formData.get("vorname") as string) || "",
      nachname: (formData.get("nachname") as string) || "",
      adresse: (formData.get("adresse") as string) || "",
      plz: (formData.get("plz") as string) || "",
      ort: (formData.get("ort") as string) || "",
      telefon: (formData.get("telefon") as string) || "",
      role: (formData.get("role") as string) || "lehrkraft",
      email: user.email
    };

    // Aktualisiere oder erstelle Profil
    const { error: upsertError } = await supabase
      .from("benutzer")
      .upsert({
        user_id: user.id,
        vorname: profileData.vorname,
        nachname: profileData.nachname,
        adresse: profileData.adresse,
        plz: profileData.plz,
        ort: profileData.ort,
        telefon: profileData.telefon,
        role: profileData.role
      });

    if (upsertError) {
      console.error("[profil.action] Fehler beim Aktualisieren des Profils:", upsertError.message);
      return json<ActionResponse>({ 
        success: false,
        error: "Profil konnte nicht aktualisiert werden."
      }, {
        headers: response.headers
      });
    }

    // Aktualisiere den localStorage-Cache
    return json<ActionResponse>({ 
      success: true,
      error: null
    }, {
      headers: response.headers
    });
  } catch (error) {
    console.error("[profil.action] Unerwarteter Fehler:", error);
    return json<ActionResponse>({ 
      success: false,
      error: "Ein unerwarteter Fehler ist aufgetreten."
    });
  }
}

  export default function ProfilPage() {
    const inputClasses =
      "bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md px-3 py-2 w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:text-gray-900 [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white]";  
  const { profile, error, needsClientAuth } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [localProfile, setLocalProfile] = useState<ProfileData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Lade Profil aus localStorage, wenn Server-seitiges Profil nicht verfügbar ist
  useEffect(() => {
    if (needsClientAuth) {
      // Prüfe, ob der Benutzer eingeloggt ist
      const isLoggedIn = localStorage.getItem("sb-is-logged-in") === "true";
      
      if (!isLoggedIn) {
        navigate("/login");
        return;
      }
      
      // Versuche, Profil aus Cache zu laden
      const cachedProfile = localStorage.getItem("user-profile-cache");
      if (cachedProfile) {
        try {
          const userData = JSON.parse(cachedProfile);
          setLocalProfile(userData);
        } catch (e) {
          console.error("[ProfilPage] Fehler beim Parsen des Benutzer-Caches:", e);
        }
      }
    } else if (profile) {
      setLocalProfile(profile);
    }
    
    setIsLoading(false);
  }, [profile, needsClientAuth, navigate]);

  // Zeige Erfolgs- oder Fehlermeldung
  useEffect(() => {
    if (actionData?.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Aktualisiere den localStorage-Cache
      if (localProfile) {
        localStorage.setItem("user-profile-cache", JSON.stringify(localProfile));
        localStorage.setItem("user-profile-cache-time", Date.now().toString());
      }
    } else if (actionData?.error) {
      setErrorMessage(actionData.error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  }, [actionData, localProfile]);

  // Aktualisiere lokales Profil bei Formularänderungen
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <h1 className="text-2xl font-bold mb-6">Mein Profil</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          Profil erfolgreich aktualisiert!
        </div>
      )}
      
      {showError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
        </div>
      )}

      {localProfile && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-6 pb-4 border-b">
            <p className="text-sm text-gray-600">E-Mail-Adresse (nicht änderbar)</p>
            <p className="font-medium">{localProfile.email}</p>
          </div>
          
          <Form method="post" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="vorname" className="block text-sm font-medium text-gray-700 mb-1">
                  Vorname
                </label>
                <input
                  id="vorname"
                  name="vorname"
                  type="text"
                  value={localProfile.vorname || ""}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
              
              <div>
                <label htmlFor="nachname" className="block text-sm font-medium text-gray-700 mb-1">
                  Nachname
                </label>
                <input
                  id="nachname"
                  name="nachname"
                  type="text"
                  value={localProfile.nachname || ""}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  id="adresse"
                  name="adresse"
                  type="text"
                  value={localProfile.adresse || ""}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
              
              <div>
                <label htmlFor="plz" className="block text-sm font-medium text-gray-700 mb-1">
                  PLZ
                </label>
                <input
                  id="plz"
                  name="plz"
                  type="text"
                  value={localProfile.plz || ""}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
              
              <div>
                <label htmlFor="ort" className="block text-sm font-medium text-gray-700 mb-1">
                  Ort
                </label>
                <input
                  id="ort"
                  name="ort"
                  type="text"
                  value={localProfile.ort || ""}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
              
              <div>
                <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefonnummer
                </label>
                <input
                  id="telefon"
                  name="telefon"
                  type="tel"
                  value={localProfile.telefon || ""}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Rolle
                </label>
                <select
                  id="role"
                  name="role"
                  value={localProfile.role || "lehrkraft"}
                  onChange={handleInputChange}
                  className={inputClasses}
                >
                  <option value="eltern">Eltern</option>
                  <option value="lehrkraft">Lehrkraft</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-4 py-2 disabled:opacity-50"
              >
                Änderungen speichern
              </button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}
