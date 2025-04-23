import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabaseClient";

type ActionResponse = {
  success?: boolean;
  email?: string;
  error?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          vorname: formData.get("vorname"),
          nachname: formData.get("nachname"),
          straße: formData.get("straße"),
          hausnummer: formData.get("hausnummer"),
          türnummer: formData.get("türnummer"),
          stiege: formData.get("stiege"),
          postleitzahl: formData.get("postleitzahl"),
          ort: formData.get("ort"),
          telefonnummer: formData.get("telefonnummer"),
          role: "lehrkraft",
        },
      },
    });

    if (signUpError || !data.user) {
      return json<ActionResponse>({
        error: translateError(signUpError?.message || "Unbekannter Fehler"),
      });
    }

    return json<ActionResponse>({ success: true, email });
  } catch {
    return json<ActionResponse>({
      error: "Ein unerwarteter Fehler ist aufgetreten.",
    });
  }
}

function translateError(error: string): string {
  if (error.includes("email")) {
    return "Die E-Mail-Adresse konnte nicht gespeichert werden. Bitte überprüfe deine Eingabe.";
  }
  if (error.includes("password")) {
    return "Das Passwort ist ungültig oder konnte nicht gespeichert werden.";
  }
  return "Es ist ein unbekannter Fehler aufgetreten.";
}

export default function Register() {
  const navigation = useNavigation();
  const actionData = useActionData<ActionResponse>();
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (actionData?.success) {
      setShowSuccess(true);
    }
  }, [actionData]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = "/";
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showSuccess]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 pt-12 text-sm max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 w-full">📝 Registrieren</h1>

      {showSuccess && actionData?.email && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 w-full">
          Die Registrierung bei Schulbox war erfolgreich, um Ihre E-Mail verifizieren zu können,
          wurde soeben ein Bestätigungslink an{" "}
          <span className="text-green-700 font-medium">{actionData.email}</span> geschickt.
          <p className="mt-2 text-sm">
            ...Weiterleitung zur Startseite in {countdown} Sekunden<br />
            <a href="/" className="text-blue-600 underline">oder hier direkt zur Startseite</a>
          </p>
        </div>
      )}

      {!showSuccess && (
        <Form method="post" className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
  {/* Vorname + Nachname */}
  <div className="flex flex-col">
    <label htmlFor="vorname">Vorname *</label>
    <input id="vorname" name="vorname" required className="border border-gray-300 p-2 rounded w-full" />
  </div>
  <div className="flex flex-col">
    <label htmlFor="nachname">Nachname *</label>
    <input id="nachname" name="nachname" required className="border border-gray-300 p-2 rounded w-full" />
  </div>

  {/* Straße (volle Breite) */}
  <div className="flex flex-col md:col-span-2">
    <label htmlFor="straße">Straße *</label>
    <input id="straße" name="straße" required className="border border-gray-300 p-2 rounded w-full" />
  </div>

  {/* Hausnummer + Türnummer + Stiege */}
  <div className="grid grid-cols-3 gap-2 md:col-span-2">
    <div className="flex flex-col">
      <label htmlFor="hausnummer">Nr. *</label>
      <input id="hausnummer" name="hausnummer" required className="border border-gray-300 p-2 rounded w-full" />
    </div>
    <div className="flex flex-col">
      <label htmlFor="türnummer">TürNr.</label>
      <input id="türnummer" name="türnummer" className="border border-gray-300 p-2 rounded w-full" />
    </div>
    <div className="flex flex-col">
      <label htmlFor="stiege">Stiege</label>
      <input id="stiege" name="stiege" className="border border-gray-300 p-2 rounded w-full" />
    </div>
  </div>

  {/* Postleitzahl + Ort + Telefonnummer */}
  <div className="grid grid-cols-3 gap-2 md:col-span-2">
    <div className="flex flex-col">
      <label htmlFor="postleitzahl">Postleitzahl *</label>
      <input id="postleitzahl" name="postleitzahl" required className="border border-gray-300 p-2 rounded w-full" />
    </div>
    <div className="flex flex-col">
      <label htmlFor="ort">Ort *</label>
      <input id="ort" name="ort" required className="border border-gray-300 p-2 rounded w-full" />
    </div>
    <div className="flex flex-col">
      <label htmlFor="telefonnummer">Telefonnummer</label>
      <input id="telefonnummer" name="telefonnummer" className="border border-gray-300 p-2 rounded w-full" />
    </div>
  </div>

  {/* E-Mail */}
  <div className="flex flex-col md:col-span-2">
    <label htmlFor="email">E-Mail *</label>
    <input id="email" name="email" type="email" required className="border border-gray-300 p-2 rounded w-full" />
  </div>

  {/* Passwort */}
  <div className="flex flex-col md:col-span-2">
    <label htmlFor="password">Passwort *</label>
    <input id="password" name="password" type="password" required minLength={6} className="border border-gray-300 p-2 rounded w-full" />
    <span className="text-gray-500 text-xs mt-1">Mindestens 6 Zeichen oder Zahlen erforderlich</span>
  </div>

  {/* Button */}
  <div className="md:col-span-2">
    <button
      type="submit"
      disabled={navigation.state === "submitting"}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
    >
      {navigation.state === "submitting" ? "Wird gesendet..." : "Registrieren"}
    </button>
  </div>

  {/* Fehleranzeige */}
  {"error" in (actionData ?? {}) && (
    <p className="col-span-2 mt-2 text-red-600 text-sm">{actionData?.error}</p>
  )}
</Form>

      )}
    </div>
  );
}
