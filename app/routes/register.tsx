
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabaseClient";
import { createShopifyCustomer } from "~/utils/shopify/createShopifyCustomer.server";


type ActionResponse = {
  success?: boolean;
  email?: string;
  error?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  console.log("🧪 action() gestartet"); // 👈 HIER EINFÜGEN
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const vorname = formData.get("vorname") as string;
  const nachname = formData.get("nachname") as string;

  try {
    console.log("🚀 Supabase-User wurde erstellt, versuche Shopify-Kunde anzulegen...");
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          vorname,
          nachname,
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
    console.log("📥 Supabase signup response:", { data, signUpError });
    console.log("✅ Shopify-Kunde erfolgreich angelegt");

    if (signUpError || !data.user) {
      const message = signUpError?.message || "Unbekannter Fehler";
    
      if (signUpError?.message?.includes("already registered")) {
        return json<ActionResponse>({
          error: "Diese E-Mail ist bereits registriert. Bitte einloggen oder Passwort zurücksetzen.",
        });
      }
    
      return json<ActionResponse>({
        error: translateError(message),
      });
    }
    

    // ✅ Shopify-Kunde anlegen + Einladung senden
    await createShopifyCustomer({
      email,
      firstName: vorname,
      lastName: nachname,
    });

    return json<ActionResponse>({ success: true, email });
  } catch (err) {
    console.error("❌ Fehler beim Registrieren:", err);
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
    <div className="flex justify-center items-start min-h-screen pt-20 px-4 bg-white text-gray-900">
      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-md shadow-xl rounded-xl p-10 space-y-6 border border-gray-200">
        <h1 className="text-2xl font-semibold text-blue-600 mb-2">📝 Registrieren</h1>

        {showSuccess && actionData?.email && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Die Registrierung war erfolgreich. Eine Bestätigung wurde an{" "}
            <span className="font-semibold">{actionData.email}</span> gesendet.
            <p className="mt-2 text-sm">
              Weiterleitung zur Startseite in {countdown} Sekunden<br />
              <a href="/" className="text-blue-600 underline">oder hier direkt zur Startseite</a>
            </p>
          </div>
        )}

        {!showSuccess && (
          <Form method="post" className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="vorname" className="text-sm font-medium mb-1">Vorname *</label>
                <input id="vorname" name="vorname" required className="px-4 py-2 border border-gray-300 rounded w-full bg-white text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="nachname" className="text-sm font-medium mb-1">Nachname *</label>
                <input id="nachname" name="nachname" required className="px-4 py-2 border border-gray-300 rounded w-full bg-white text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 flex flex-col">
                <label htmlFor="straße" className="text-sm font-medium mb-1">Straße *</label>
                <input id="straße" name="straße" required className="px-4 py-2 border border-gray-300 rounded w-full bg-white text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="hausnummer" className="text-sm font-medium mb-1">Nr. *</label>
                <input id="hausnummer" name="hausnummer" required className="px-3 py-2 border border-gray-300 rounded w-full bg-white text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="türnummer" className="text-sm font-medium mb-1">Tür</label>
                <input id="türnummer" name="türnummer" className="px-3 py-2 border border-gray-300 rounded w-full bg-white text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="stiege" className="text-sm font-medium mb-1">Stiege</label>
                <input id="stiege" name="stiege" className="px-3 py-2 border border-gray-300 rounded w-full bg-white text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="postleitzahl" className="text-sm font-medium mb-1">Postleitzahl *</label>
                <input id="postleitzahl" name="postleitzahl" required className="px-4 py-2 border border-gray-300 rounded w-full bg-white text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="ort" className="text-sm font-medium mb-1">Ort *</label>
                <input id="ort" name="ort" required className="px-4 py-2 border border-gray-300 rounded w-full bg-white text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="flex flex-col md:col-span-1">
              <label htmlFor="telefonnummer" className="text-sm font-medium mb-1">Telefonnummer</label>
              <input id="telefonnummer" name="telefonnummer" className="px-4 py-2 border border-gray-300 rounded w-full bg-white text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="md:col-span-1 flex flex-col">
              <label htmlFor="email" className="text-sm font-medium mb-1">E-Mail *</label>
              <input id="email" name="email" type="email" required className="px-4 py-2 border border-gray-300 rounded w-full bg-white text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="md:col-span-1 flex flex-col">
              <label htmlFor="password" className="text-sm font-medium mb-1">Passwort *</label>
              <input id="password" name="password" type="password" minLength={6} required className="px-4 py-2 border border-gray-300 rounded w-full bg-white text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="text-gray-400 text-xs mt-1">Mindestens 6 Zeichen erforderlich</span>
            </div>

            <div>
              <button
                type="submit"
                disabled={navigation.state === "submitting"}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-4 py-2.5 transition text-sm"
              >
                {navigation.state === "submitting" ? "Wird gesendet..." : "Registrieren"}
              </button>
            </div>

            {"error" in (actionData ?? {}) && (
              <p className="mt-2 text-red-600 text-sm">{actionData?.error}</p>
            )}
          </Form>
        )}
      </div>
    </div>
  );
}
