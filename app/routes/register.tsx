import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { supabase } from "~/lib/supabaseClient";
import { useState } from "react";

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

  if (authError) {
    return json({ error: translateError(authError.message) }, { status: 400 });
  }

  const user_id = data.user?.id;

  const { error: insertError } = await supabase.from("users").insert([
    {
        email,
        Vorname,
        Nachname,
        Straße,
        Hausnummer,
        Türnummer,
        Stiege,
        Postleitzahl,
        Ort,
        Telefonnummer
    },
  ]);

  if (insertError) {
    return json({ error: translateError(insertError.message) }, { status: 400 });
  }

  return redirect("/");
};

export default function Register() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20 px-4">
      <h1 className="text-2xl font-bold mb-8 w-full max-w-4xl">📝 Registrieren</h1>
      <Form method="post" className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <div>
          <label>
            Vorname *
            <input name="vorname" required className="w-full border rounded px-3 py-2 mt-1" />
          </label>
        </div>
        <div>
          <label>
            Nachname *
            <input name="nachname" required className="w-full border rounded px-3 py-2 mt-1" />
          </label>
        </div>

        <div>
          <label>
            Straße *
            <input name="straße" required className="w-full border rounded px-3 py-2 mt-1" />
          </label>
        </div>
        <div>
          <label>
            Hausnummer *
            <input name="hausnummer" required className="w-full border rounded px-3 py-2 mt-1" />
          </label>
        </div>

        <div>
          <label>
            Türnummer
            <input name="türnummer" className="w-full border rounded px-3 py-2 mt-1" />
          </label>
        </div>
        <div>
          <label>
            Stiege
            <input name="stiege" className="w-full border rounded px-3 py-2 mt-1" />
          </label>
        </div>

        <div>
          <label>
            Postleitzahl *
            <input name="postleitzahl" required className="w-full border rounded px-3 py-2 mt-1" />
          </label>
        </div>
        <div>
          <label>
            Ort *
            <input name="ort" required className="w-full border rounded px-3 py-2 mt-1" />
          </label>
        </div>

        <div>
          <label>
            Telefonnummer
            <input name="telefonnummer" className="w-full border rounded px-3 py-2 mt-1" />
          </label>
        </div>

        <div>
          <label>
            E-Mail *
            <input
              name="email"
              type="email"
              required
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </label>
        </div>
        <div>
          <label>
            Passwort *
            <input
              name="password"
              type="password"
              required
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </label>
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
            disabled={navigation.state === "submitting"}
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
