// app/routes/register.tsx
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { supabase } from "~/lib/supabaseClient";

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();

  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    return json({ error: signUpError.message });
  }

  const userId = data.user?.id;

  const profile = {
    id: userId,
    email,
    vorname: form.get("vorname"),
    nachname: form.get("nachname"),
    strasse: form.get("strasse"),
    hausnummer: form.get("hausnummer"),
    tuernummer: form.get("tuernummer"),
    stiege: form.get("stiege"),
    plz: form.get("plz"),
    ort: form.get("ort"),
    telefonnummer: form.get("telefonnummer"),
  };

  await supabase.from("profiles").insert(profile);

  return redirect("/");
};

export default function Register() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-16 px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-left">📝 Registrieren</h1>
        <Form method="post" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="vorname">Vorname *</label>
            <input name="vorname" required className="border rounded px-3 py-2 mt-1" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="nachname">Nachname *</label>
            <input name="nachname" required className="border rounded px-3 py-2 mt-1" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="strasse">Straße *</label>
            <input name="strasse" required className="border rounded px-3 py-2 mt-1" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="hausnummer">Hausnummer *</label>
            <input name="hausnummer" required className="border rounded px-3 py-2 mt-1" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="tuernummer">Türnummer</label>
            <input name="tuernummer" className="border rounded px-3 py-2 mt-1" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="stiege">Stiege</label>
            <input name="stiege" className="border rounded px-3 py-2 mt-1" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="plz">Postleitzahl *</label>
            <input name="plz" required className="border rounded px-3 py-2 mt-1" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="ort">Ort *</label>
            <input name="ort" required className="border rounded px-3 py-2 mt-1" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="telefonnummer">Telefonnummer</label>
            <input name="telefonnummer" className="border rounded px-3 py-2 mt-1" />
          </div>
          <div></div>

          <div className="flex flex-col">
            <label htmlFor="email">E-Mail *</label>
            <input name="email" type="email" required className="border rounded px-3 py-2 mt-1" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Passwort *</label>
            <input name="password" type="password" required className="border rounded px-3 py-2 mt-1" />
          </div>

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded py-3 hover:bg-blue-700 transition disabled:opacity-50"
              disabled={navigation.state === "submitting"}
            >
              {navigation.state === "submitting" ? "Registrieren..." : "Registrieren"}
            </button>
            {actionData?.error && (
              <p className="text-red-500 mt-2">{actionData.error}</p>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
