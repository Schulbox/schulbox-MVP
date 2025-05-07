
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabaseClient";
import { createShopifyCustomer } from "~/utils/shopify/createShopifyCustomer.server";


type ActionResponse = {
  success?: boolean;
  email?: string;
  error?: string; // For critical errors (e.g., Supabase fails)
  warning?: string; // For non-critical errors (e.g., Shopify sync fails after Supabase success)
};

// Password validation function
function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false; // At least one uppercase letter
  if (!/[a-z]/.test(password)) return false; // At least one lowercase letter
  if (!/[0-9]/.test(password)) return false; // At least one number
  if (!/[^A-Za-z0-9]/.test(password)) return false; // At least one symbol
  return true;
}

export async function action({ request }: ActionFunctionArgs) {
  console.log("[Register Action] Registration process started.");
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const vorname = formData.get("vorname") as string;
  const nachname = formData.get("nachname") as string;

  // Basic validation
  if (!email || !password || !vorname || !nachname) {
    return json<ActionResponse>({ error: "Alle Pflichtfelder müssen ausgefüllt werden." }, { status: 400 });
  }

  // Enhanced password validation
  if (!isValidPassword(password)) {
    return json<ActionResponse>({
      error: "Das Passwort muss mindestens 8 Zeichen lang sein und mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.",
    }, { status: 400 });
  }

  try {
    console.log(`[Register Action] Attempting Supabase signup for ${email}...`);
    const { data: supabaseData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          vorname,
          nachname,
          straße: formData.get("straße") as string,
          hausnummer: formData.get("hausnummer") as string,
          türnummer: formData.get("türnummer") as string,
          stiege: formData.get("stiege") as string,
          postleitzahl: formData.get("postleitzahl") as string,
          ort: formData.get("ort") as string,
          telefonnummer: formData.get("telefonnummer") as string,
          role: "lehrkraft", // Assuming default role, or get from form
        },
      },
    });

    if (signUpError || !supabaseData.user) {
      const message = signUpError?.message || "Unbekannter Supabase Registrierungsfehler.";
      console.error(`[Register Action] Supabase signup failed for ${email}: ${message}`);
      if (message.includes("already registered")) {
        return json<ActionResponse>({ error: "Diese E-Mail ist bereits registriert. Bitte einloggen oder Passwort zurücksetzen." }, { status: 409 });
      }
      // Check if the error is related to password policy from Supabase side (if any)
      if (message.toLowerCase().includes("password should be at least") || message.toLowerCase().includes("password should contain")) {
        return json<ActionResponse>({ error: "Das Passwort erfüllt nicht die Mindestanforderungen. Bitte überprüfen Sie die Passwortrichtlinien." }, { status: 400 });
      }
      return json<ActionResponse>({ error: translateError(message) }, { status: 400 });
    }

    console.log(`[Register Action] Supabase user ${email} created successfully (ID: ${supabaseData.user.id}).`);

    // Attempt Shopify customer creation
    try {
      console.log(`[Register Action] Attempting Shopify customer creation for ${email}...`);
      const shopifyResult = await createShopifyCustomer({
        email,
        firstName: vorname,
        lastName: nachname,
        // Note: Shopify customer creation via API doesn't typically set the password directly here.
        // The `send_email_invite: true` in createShopifyCustomer handles password setup by the user.
      });

      if (shopifyResult.success) {
        console.log(`[Register Action] Shopify customer created successfully for ${email} (Shopify ID: ${shopifyResult.customerId}).`);
        return json<ActionResponse>({ success: true, email });
      } else {
        const shopifyErrorMessage = shopifyResult.error || "Unbekannter Shopify Synchronisierungsfehler.";
        console.warn(`[Register Action] Supabase user ${email} created, but Shopify customer creation failed: ${shopifyErrorMessage}`);
        return json<ActionResponse>({
          success: true, 
          email,
          warning: `Ihr Benutzerkonto wurde erstellt, aber die Synchronisierung mit unserem Shop-System ist fehlgeschlagen. Grund: ${shopifyErrorMessage}. Bitte kontaktieren Sie den Support, falls dies weiterhin auftritt.`,
        });
      }
    } catch (shopifySyncError) {
      const errorMessage = shopifySyncError instanceof Error ? shopifySyncError.message : "Ein interner Fehler bei der Shopify-Synchronisierung ist aufgetreten.";
      console.error(`[Register Action] Exception during Shopify customer creation for ${email} after successful Supabase signup:`, shopifySyncError);
      return json<ActionResponse>({
        success: true, 
        email,
        warning: `Ihr Benutzerkonto wurde erstellt, aber die Synchronisierung mit unserem Shop-System ist aufgrund eines internen Fehlers fehlgeschlagen. Details: ${errorMessage}. Bitte kontaktieren Sie den Support.`,
      });
    }

  } catch (err) {
    console.error("[Register Action] Unexpected error during registration process:", err);
    const generalErrorMessage = err instanceof Error ? err.message : "Ein unbekannter Fehler ist aufgetreten.";
    return json<ActionResponse>({ error: `Ein unerwarteter Fehler ist aufgetreten: ${generalErrorMessage}. Bitte versuchen Sie es später erneut.` }, { status: 500 });
  }
}


function translateError(error: string): string {
  if (error.includes("email")) {
    return "Die E-Mail-Adresse konnte nicht gespeichert werden. Bitte überprüfe deine Eingabe.";
  }
  // General password error, specific validation is handled above.
  if (error.includes("password")) {
    return "Das Passwort ist ungültig oder konnte nicht gespeichert werden. Bitte überprüfen Sie die Passwortrichtlinien.";
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
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            Die Registrierung war erfolgreich. Eine Bestätigung wurde an{" "}
            <span className="font-semibold">{actionData.email}</span> gesendet.
            {actionData.warning && ( 
              <p className="mt-2 text-sm text-orange-700 bg-orange-100 border border-orange-400 p-2 rounded">
                <strong>Wichtiger Hinweis:</strong> {actionData.warning}
              </p>
            )}
            <p className="mt-2 text-sm">
              Weiterleitung zur Startseite in {countdown} Sekunden<br />
              <a href="/" className="text-blue-600 underline">oder hier direkt zur Startseite</a>
            </p>
          </div>
        )}

        {!showSuccess && (
          <Form method="post" className="space-y-5">
            {/* ... other form fields ... */}
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
              <input id="email" name="email" type="email" autoComplete="email" required className="px-4 py-2 border border-gray-300 rounded w-full bg-white text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="md:col-span-1 flex flex-col">
              <label htmlFor="password" className="text-sm font-medium mb-1">Passwort *</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="new-password"
                required 
                // It's good to have client-side hints, but server-side validation is crucial.
                // The pattern attribute can provide some client-side feedback.
                // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}"
                // title="Passwort muss mind. 8 Zeichen, Groß-/Kleinbuchstaben, Zahl & Sonderzeichen enthalten."
                className="px-4 py-2 border border-gray-300 rounded w-full bg-white text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <span className="text-gray-500 text-xs mt-1">
                Mind. 8 Zeichen, Groß- & Kleinbuchstaben, Zahl & Sonderzeichen.
              </span>
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

            {actionData?.error && (
              <p className="mt-2 text-red-600 text-sm">{actionData.error}</p>
            )}
          </Form>
        )}
      </div>
    </div>
  );
}

