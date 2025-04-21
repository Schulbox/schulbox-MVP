import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { supabase } from "~/lib/supabaseClient";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const vorname = formData.get("vorname") as string;
  const nachname = formData.get("nachname") as string;
  const strasse = formData.get("strasse") as string;
  const hausnummer = formData.get("hausnummer") as string;
  const tuernummer = formData.get("tuernummer") as string;
  const stiege = formData.get("stiege") as string;
  const plz = formData.get("plz") as string;
  const ort = formData.get("ort") as string;
  const telefon = formData.get("telefon") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    return json({ error: error?.message ?? "Unbekannter Fehler" });
  }

  const user_id = data.user.id;

  const { error: insertError } = await supabase.from("users").insert({
    user_id,
    email,
    Vorname: vorname,
    Nachname: nachname,
    Straße: strasse,
    Hausnummer: hausnummer,
    Türnummer: tuernummer,
    Stiege: stiege,
    Postleitzahl: plz,
    Ort: ort,
    Telefonnummer: telefon,
  });

  if (insertError) {
    return json({ error: insertError.message });
  }

  return redirect("/login");
};

export default function Register() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-left">📝 Registrieren</h1>
        <Form method="post" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["vorname", "Vorname"],
            ["nachname", "Nachname"],
            ["strasse", "Straße"],
            ["hausnummer", "Hausnummer"],
            ["tuernummer", "Türnummer"],
            ["stiege", "Stiege"],
            ["plz", "Postleitzahl"],
            ["ort", "Ort"],
            ["telefon", "Telefonnummer"],
            ["email", "E-Mail"],
            ["password", "Passwort", "password"],
          ].map(([name, label, type = "text"]) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="text-sm mb-1">
                {label}
              </label>
              <input
                name={name}
                id={name}
                type={type}
                required
                className="border rounded px-3 py-2 text-sm"
              />
            </div>
          ))}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={navigation.state === "submitting"}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              {navigation.state === "submitting" ? "Registrieren..." : "Registrieren"}
            </button>
            {actionData?.error && (
              <p className="text-red-500 text-sm mt-2">{actionData.error}</p>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
