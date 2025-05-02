// app/routes/profil.tsx
import { useState, useEffect } from "react";
import { Form, useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { json, type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { getSupabaseTokensFromSession } from "~/lib/session.server";

// --- Typdefinitionen ---
type ProfileData = {
  user_id?: string;
  vorname?: string;
  nachname?: string;
  straße?: string;
  hausnummer?: string;
  türnummer?: string;
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

// --- Loader ---
// --- Loader ---
export async function loader({ request }: LoaderFunctionArgs) {
  const { refresh_token, access_token } = await getSupabaseTokensFromSession(request);
  if (!refresh_token || !access_token) {
    return json({ profile: null, error: null, needsClientAuth: true });
  }

  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  await supabase.auth.setSession({ refresh_token, access_token });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return json({
      profile: null,
      error: "Benutzer konnte nicht authentifiziert werden.",
      needsClientAuth: true
    });
  }

  const { data: rows, error: profileError } = await supabase
    .rpc("get_benutzer_profil", { user_id_param: user.id });

  console.log("[Loader] rows aus get_benutzer_profil:", rows);
  console.log("[Loader] Fehler:", profileError);

  const profile = rows && rows.length > 0 ? rows[0] : null;

  if (!profile) {
    return json({
      profile: null,
      error: "Kein Benutzerprofil gefunden.",
      needsClientAuth: false
    }, { headers: response.headers });
  }

  return json({
    profile: { ...profile, email: user.email },
    error: null,
    needsClientAuth: false
  }, { headers: response.headers });
}


// --- Action ---
export async function action({ request }: ActionFunctionArgs) {
  const { refresh_token, access_token } = await getSupabaseTokensFromSession(request);
  if (!refresh_token || !access_token) {
    return json<ActionResponse>({ success: false, error: "Nicht authentifiziert. Bitte einloggen." });
  }

  const response = new Response();
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );
  await supabase.auth.setSession({ refresh_token, access_token });

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return json<ActionResponse>({ success: false, error: "Benutzer konnte nicht geladen werden." });
  }

  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "delete") {
    // Konto löschen
    await supabase.from("benutzer").delete().eq("user_id", user.id);
    await supabase.auth.admin.deleteUser(user.id); // Requires service role key if used on server
    return redirect("/logout");
  }

  // Profil aktualisieren
  const newPassword = formData.get("password") as string;

  const profileData: ProfileData = {
    user_id: user.id,
    vorname: formData.get("vorname") as string,
    nachname: formData.get("nachname") as string,
    straße: formData.get("straße") as string,
    hausnummer: formData.get("hausnummer") as string,
    türnummer: formData.get("türnummer") as string,
    stiege: formData.get("stiege") as string,
    postleitzahl: formData.get("postleitzahl") as string,
    ort: formData.get("ort") as string,
    telefonnummer: formData.get("telefonnummer") as string,
    email: user.email
  };

  let passwordChanged = false;
  if (newPassword && newPassword.length >= 6) {
    const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
    if (passwordError) {
      return json<ActionResponse>({ success: false, error: "Passwort konnte nicht geändert werden." });
    }
    passwordChanged = true;
  }

  const { error: upsertError } = await supabase.from("benutzer").upsert(profileData);
  if (upsertError) {
    return json<ActionResponse>({ success: false, error: "Profil konnte nicht aktualisiert werden." });
  }

  return json<ActionResponse>({ success: true, passwordChanged, error: null });
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
    if (profile) {
      console.log("Setting localProfile:", profile); // ✅ für Debugging
      setLocalProfile(profile);
      localStorage.removeItem("user-profile-cache");
    }
  
    if (needsClientAuth) {
      const isLoggedIn = localStorage.getItem("sb-is-logged-in") === "true";
      if (!isLoggedIn) {
        navigate("/login");
      }
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

  /*Ab hier beginnt die Komponente */
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
                <label htmlFor="straße" className="text-sm font-medium mb-1">Straße</label>
                <input id="straße" name="straße" value={localProfile.straße || ""} onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="hausnummer" className="text-sm font-medium mb-1">Nr.</label>
                <input id="hausnummer" name="hausnummer" value={localProfile.hausnummer || ""} onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="türnummer" className="text-sm font-medium mb-1">Tür</label>
                <input id="türnummer" name="türnummer" value={localProfile.türnummer || ""} onChange={handleInputChange}
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
