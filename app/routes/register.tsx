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

    const userId = data.user.id;

    // Profildaten zur Sicherheit upserten (nach Trigger)
    const insertData = {
      user_id: userId,
      vorname: formData.get("vorname"),
      nachname: formData.get("nachname"),
      straße: formData.get("straße"),
      hausnummer: formData.get("hausnummer"),
      türnummer: formData.get("türnummer"),
      stiege: formData.get("stiege"),
      postleitzahl: formData.get("postleitzahl"),
      ort: formData.get("ort"),
      telefonnummer: formData.get("telefonnummer"),
      email,
      role: "lehrkraft",
    };

    const { error: upsertError } = await supabase
      .from("benutzer")
      .upsert(insertData, { onConflict: "user_id" });

    if (upsertError) {
      return json({ error: translateError(upsertError.message) });
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
  if (error.includes("column") && error.includes("schema")) {
    return "Ein technischer Fehler ist aufgetreten. Bitte versuche es später erneut.";
  }
  return "Es ist ein unbekannter Fehler aufgetreten.";
}

export default function Register() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-12">
      <h1 className="text-2xl font-bold mb-8 w-full max-w-4xl text-left">
        📝 Registrieren
      </h1>

      <Form method="post" className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {[
          { name: "vorname", label: "Vorname", required: true },
          { name: "nachname", label: "Nachname", required: true },
          { name: "straße", label: "Straße", required: true },
          { name: "hausnummer", label: "Hausnummer", required: true },
          { name: "türnummer", label: "Türnummer", required: false },
          { name: "stiege", label: "Stiege", required: false },
          { name: "postleitzahl", label: "Postleitzahl", required: true },
          { name: "ort", label: "Ort", required: true },
          { name: "telefonnummer", label: "Telefonnummer", required: false },
          { name: "email", label: "E-Mail", required: true },
          { name: "password", label: "Passwort", required: true, type: "password" },
        ].map(({ name, label, required, type }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="font-medium text-sm text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              id={name}
              name={name}
              type={type || "text"}
              required={required}
              className="border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

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
