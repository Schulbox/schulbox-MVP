import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { supabase } from "~/lib/supabaseClient";

export async function action({ request }: { request: Request }) {
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
      return json({ error: translateError(signUpError?.message || "Unbekannter Fehler") });
    }

    return redirect("/login");
  } catch {
    return json({ error: "Ein unerwarteter Fehler ist aufgetreten." });
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
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-12 text-sm">
      <h1 className="text-2xl font-bold mb-8 w-full max-w-4xl text-left">
        📝 Registrieren
      </h1>

      <Form method="post" className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl text-sm">
        <div className="flex flex-col">
          <label htmlFor="vorname" className="font-medium text-gray-700">
            Vorname <span className="text-red-500">*</span>
          </label>
          <input id="vorname" name="vorname" required className="border border-gray-300 rounded px-3 py-2 mt-1" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="nachname" className="font-medium text-gray-700">
            Nachname <span className="text-red-500">*</span>
          </label>
          <input id="nachname" name="nachname" required className="border border-gray-300 rounded px-3 py-2 mt-1" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="straße" className="font-medium text-gray-700">
            Straße <span className="text-red-500">*</span>
          </label>
          <input id="straße" name="straße" required className="border border-gray-300 rounded px-3 py-2 mt-1" />
        </div>

        {/* Hausnummer, Türnummer, Stiege nebeneinander */}
        <div className="flex gap-2">
          <div className="flex flex-col w-1/3">
            <label htmlFor="hausnummer" className="font-medium text-gray-700">
              Nr. <span className="text-red-500">*</span>
            </label>
            <input id="hausnummer" name="hausnummer" required className="border border-gray-300 rounded px-2 py-2 mt-1 text-sm" />
          </div>
          <div className="flex flex-col w-1/3">
            <label htmlFor="türnummer" className="font-medium text-gray-700">
              TürNr.
            </label>
            <input id="türnummer" name="türnummer" className="border border-gray-300 rounded px-2 py-2 mt-1 text-sm" />
          </div>
          <div className="flex flex-col w-1/3">
            <label htmlFor="stiege" className="font-medium text-gray-700">
              Stiege
            </label>
            <input id="stiege" name="stiege" className="border border-gray-300 rounded px-2 py-2 mt-1 text-sm" />
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="postleitzahl" className="font-medium text-gray-700">
            Postleitzahl <span className="text-red-500">*</span>
          </label>
          <input id="postleitzahl" name="postleitzahl" required className="border border-gray-300 rounded px-3 py-2 mt-1" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="ort" className="font-medium text-gray-700">
            Ort <span className="text-red-500">*</span>
          </label>
          <input id="ort" name="ort" required className="border border-gray-300 rounded px-3 py-2 mt-1" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="telefonnummer" className="font-medium text-gray-700">
            Telefonnummer
          </label>
          <input id="telefonnummer" name="telefonnummer" className="border border-gray-300 rounded px-3 py-2 mt-1" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="font-medium text-gray-700">
            E-Mail <span className="text-red-500">*</span>
          </label>
          <input id="email" name="email" type="email" required className="border border-gray-300 rounded px-3 py-2 mt-1" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="font-medium text-gray-700">
            Passwort <span className="text-red-500">*</span>
          </label>
          <input id="password" name="password" type="password" required className="border border-gray-300 rounded px-3 py-2 mt-1" />
        </div>

        <div className="col-span-1 md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={navigation.state === "submitting"}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition"
          >
            {navigation.state === "submitting" ? "Wird gesendet..." : "Registrieren"}
          </button>
        </div>

        {actionData?.error && (
          <p className="col-span-1 md:col-span-2 mt-2 text-red-600 text-sm">
            {actionData.error}
          </p>
        )}
      </Form>
    </div>
  );
}
