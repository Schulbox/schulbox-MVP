// app/routes/profil.tsx
import { useState, useEffect } from "react";
import { Form, useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { getSupabaseTokensFromSession } from "~/lib/session.server";

type ProfileData = {
  user_id?: string;
  vorname?: string;
  nachname?: string;
  strasse?: string;
  hausnummer?: string;
  tuernummer?: string;
  stiege?: string;
  postleitzahl?: string;
  ort?: string;
  telefonnummer?: string;
  email?: string;
};

type ActionResponse = {
  success?: boolean;
  passwordChanged?: boolean;
  error?: string | null;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { refresh_token, access_token } = await getSupabaseTokensFromSession(request);

  if (!refresh_token && !access_token) {
    console.log("[Profil-Loader] Tokens fehlen:", refresh_token, access_token);
    return json({ profile: null, error: null, needsClientAuth: true });
  }

  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  try {
    await supabase.auth.setSession({
      refresh_token: refresh_token!,
      access_token: access_token!
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("[Profil-Loader] Supabase-User:", user, userError);

    if (userError || !user) {
      return json({ profile: null, error: "Benutzer nicht gefunden", needsClientAuth: true });
    }

    const { data: rows, error: profileError } = await supabase
      .rpc("get_benutzer_profil", { user_id_param: user.id });

    if (profileError) {
      console.error("[Profil-Loader] Profil-Fehler:", profileError);
      return json({ profile: null, error: "Profil konnte nicht geladen werden.", needsClientAuth: false }, { headers: response.headers });
    }

    const raw = rows?.[0];

    if (!raw) {
      return json({ profile: null, error: "Kein Profil vorhanden", needsClientAuth: false }, { headers: response.headers });
    }

    const profile: ProfileData = {
      user_id: raw.user_id,
      vorname: raw.vorname,
      nachname: raw.nachname,
      strasse: raw["strasse"],
      hausnummer: raw.hausnummer,
      tuernummer: raw["tuernummer"],
      stiege: raw.stiege,
      postleitzahl: raw.postleitzahl,
      ort: raw.ort,
      telefonnummer: raw.telefonnummer,
      email: user.email,
    };

    return json({ profile, error: null, needsClientAuth: false }, { headers: response.headers });

  } catch (error) {
    console.error("[Profil-Loader] Unerwarteter Fehler:", error);
    return json({ profile: null, error: "Ein unerwarteter Serverfehler ist aufgetreten.", needsClientAuth: true });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const { refresh_token, access_token } = await getSupabaseTokensFromSession(request);
  if (!refresh_token && !access_token) {
    return json<ActionResponse>({ success: false, error: "Nicht authentifiziert. Bitte melden Sie sich an." });
  }

  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  try {
    if (refresh_token && access_token) {
      await supabase.auth.setSession({ refresh_token, access_token });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return json<ActionResponse>({ success: false, error: "Benutzer konnte nicht authentifiziert werden." });
    }

    const formData = await request.formData();
    const newPassword = formData.get("password") as string;

    const profileData: ProfileData = {
      user_id: user.id,
      vorname: formData.get("vorname") as string,
      nachname: formData.get("nachname") as string,
      strasse: formData.get("strasse") as string,
      hausnummer: formData.get("hausnummer") as string,
      tuernummer: formData.get("tuernummer") as string,
      stiege: formData.get("stiege") as string,
      postleitzahl: formData.get("postleitzahl") as string,
      ort: formData.get("ort") as string,
      telefonnummer: formData.get("telefonnummer") as string,
      email: user.email
    };

    let passwordChanged = false;
    if (newPassword && newPassword.length >= 6) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (passwordError) {
        return json<ActionResponse>({ success: false, error: "Passwort konnte nicht geändert werden." });
      }
      passwordChanged = true;
    }

    const { error: upsertError } = await supabase
      .from("benutzer")
      .upsert(profileData);

    if (upsertError) {
      return json<ActionResponse>({ success: false, error: "Profil konnte nicht aktualisiert werden." });
    }

    return json<ActionResponse>({ success: true, passwordChanged, error: null });
  } catch (error) {
    return json<ActionResponse>({ success: false, error: "Ein unerwarteter Fehler ist aufgetreten." });
  }
}

export default function ProfilPage() {
  const { profile, error, needsClientAuth } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [localProfile, setLocalProfile] = useState<ProfileData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (needsClientAuth) {
      const isLoggedIn = localStorage.getItem("sb-is-logged-in") === "true";
      if (!isLoggedIn) {
        navigate("/login");
        return;
      }
      const cachedProfile = localStorage.getItem("user-profile-cache");
      if (cachedProfile) {
        try {
          setLocalProfile(JSON.parse(cachedProfile));
        } catch (e) {
          console.error("[ProfilPage] Fehler beim Parsen:", e);
        }
      }
    } else if (profile) {
      setLocalProfile(profile);
    }
    setIsLoading(false);
  }, [profile, needsClientAuth, navigate]);

  useEffect(() => {
    if (actionData?.success) {
      setShowSuccess(true);
      setPasswordChanged(Boolean(actionData.passwordChanged));
      setTimeout(() => {
        setShowSuccess(false);
        setPasswordChanged(false);
      }, 3000);

      if (localProfile) {
        localStorage.setItem("user-profile-cache", JSON.stringify(localProfile));
      }
    } else if (actionData?.error) {
      setErrorMessage(actionData.error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  }, [actionData, localProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen pt-20 px-4 bg-white text-gray-900">
      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-md shadow-xl rounded-xl p-10 space-y-6 border border-gray-200">
        <h1 className="text-2xl font-semibold text-blue-600 mb-2">👤 Mein Profil</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
        {showSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">Profil erfolgreich aktualisiert!</div>}
        {passwordChanged && <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded">Passwort erfolgreich geändert!</div>}
        {showError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errorMessage}</div>}

        {localProfile && (
          <Form method="post" className="space-y-5">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">E-Mail (nicht änderbar)</label>
              <div className="px-4 py-2 border border-gray-300 rounded bg-gray-100 text-black text-sm">{localProfile.email}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="vorname" className="text-sm font-medium mb-1">Vorname</label>
                <input id="vorname" name="vorname" value={localProfile.vorname || ""} onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="nachname" className="text-sm font-medium mb-1">Nachname</label>
                <input id="nachname" name="nachname" value={localProfile.nachname || ""} onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 flex flex-col">
                <label htmlFor="strasse" className="text-sm font-medium mb-1">Straße</label>
                <input id="strasse" name="straße" value={localProfile.strasse || ""} onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="hausnummer" className="text-sm font-medium mb-1">Nr.</label>
                <input id="hausnummer" name="hausnummer" value={localProfile.hausnummer || ""} onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="tuernummer" className="text-sm font-medium mb-1">Tür</label>
                <input id="tuernummer" name="tuernummer" value={localProfile.tuernummer || ""} onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="stiege" className="text-sm font-medium mb-1">Stiege</label>
                <input id="stiege" name="stiege" value={localProfile.stiege || ""} onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="postleitzahl" className="text-sm font-medium mb-1">Postleitzahl</label>
                <input id="postleitzahl" name="postleitzahl" value={localProfile.postleitzahl || ""} onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="ort" className="text-sm font-medium mb-1">Ort</label>
                <input id="ort" name="ort" value={localProfile.ort || ""} onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="telefonnummer" className="text-sm font-medium mb-1">Telefonnummer</label>
              <input id="telefonnummer" name="telefonnummer" value={localProfile.telefonnummer || ""} onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-medium mb-1">Neues Passwort</label>
              <input id="password" name="password" type="password" minLength={6}
                placeholder="Mindestens 6 Zeichen"
                className="px-4 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="text-gray-400 text-xs mt-1">Nur ausfüllen, wenn du dein Passwort ändern möchtest</span>
            </div>

            <div>
              <button type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-4 py-2.5 transition text-sm">
                Änderungen speichern
              </button>
              <Form method="post">
  <input type="hidden" name="_action" value="delete" />
  <button
    type="submit"
    className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-medium rounded-md px-4 py-2.5 transition text-sm"
    onClick={(e) => {
      if (!confirm("Bist du sicher, dass du dein Konto löschen möchtest? Dies kann nicht rückgängig gemacht werden!")) {
        e.preventDefault();
      }
    }}
  >
    Konto löschen
  </button>
</Form>

            </div>
          </Form>
        )}
      </div>
    </div>
  );
}
