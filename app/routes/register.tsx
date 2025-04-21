import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { supabase } from "~/lib/supabaseClient";

function translateError(error: string): string {
  if (error.includes("email")) {
    return "Die E-Mail-Adresse konnte nicht gespeichert werden. Bitte überprüfe deine Eingabe.";
  }
  if (error.includes("password")) {
    return "Das Passwort ist ungültig oder konnte nicht gespeichert werden.";
  }
  if (error.includes("column") && error.includes("schema")) {
    return "Ein technischer Fehler ist aufgetreten. Bitte versuche es später erneut.";
  }
  return "Es ist ein unbekannter Fehler aufgetreten.";
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();

  const email = form.get("email") as string;
  const password = form.get("password") as string;
  const Vorname = form.get("vorname") as string;
  const Nachname = form.get("nachname") as string;
  const Straße = form.get("straße") as string;
  const Hausnummer = form.get("hausnummer") as string;
  const Türnummer = form.get("türnummer") as string;
  const Stiege = form.get("stiege") as string;
  const Postleitzahl = form.get("postleitzahl") as string;
  const Ort = form.get("ort") as string;
  const Telefonnummer = form.get("telefonnummer") as string;

  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !data.user) {
    return json({ error: translateError(authError?.message ?? "Unbekannter Fehler") }, { status: 400 });
  }

  const user_id = data.user.id;

  const { error: insertError } = await supabase.from("Benutzer").insert([
    {
      user_id,
      email,
      Vorname,
      Nachname,
      Straße,
      Hausnummer,
      Türnummer,
      Stiege,
      Postleitzahl,
      Ort,
      Telefonnummer,
    },
  ]);

  if (insertError) {
    return json({ error: translateError(insertError.message) }, { status: 400 });
  }

  return redirect("/login");
};

export default function Register() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20 px-4">
      <h1 className="text-2xl font-bold mb-8 w-full max-w-4xl text-left">📝 Registrieren</h1>
      <Form method="post" className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {[
          ["vorname", "Vorname"],
          ["nachname", "Nachname"],
          ["straße", "Straße"],
          ["hausnummer", "Hausnummer"],
          ["türnummer", "Türnummer"],
          ["stiege", "Stiege"],
          ["postleitzahl", "Postleitzahl"],
          ["ort", "Ort"],
          ["telefonnummer", "Telefonnummer"],
          ["email", "E-Mail", "email"],
          ["password", "Passwort", "password"],
        ].map(([name, label, type = "text"]) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-sm mb-1">{label}</label>
            <input
              name={name}
              id={name}
              type={type}
              required={!(name === "türnummer" || name === "stiege" || name === "telefonnummer")}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
        ))}

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={navigation.state === "submitting"}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
          >
            {navigation.state === "submitting" ? "Wird gesendet..." : "Registrieren"}
          </button>
          {actionData?.error && (
            <p className="text-red-600 text-sm mt-2">{actionData.error}</p>
          )}
        </div>
      </Form>
    </div>
  );
}
