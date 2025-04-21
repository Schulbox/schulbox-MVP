import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { supabase } from "~/lib/supabaseClient";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return json({ error: error.message });
  }

  return redirect("/login");
};

export default function Register() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">📝 Registrieren</h1>

      <Form method="post" className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        <div>
          <label className="block font-medium text-sm mb-1">Vorname *</label>
          <input name="vorname" type="text" required className="input" />
        </div>
        <div>
          <label className="block font-medium text-sm mb-1">Nachname *</label>
          <input name="nachname" type="text" required className="input" />
        </div>
        <div>
          <label className="block font-medium text-sm mb-1">Straße *</label>
          <input name="strasse" type="text" required className="input" />
        </div>
        <div>
          <label className="block font-medium text-sm mb-1">Hausnummer *</label>
          <input name="hausnummer" type="text" required className="input" />
        </div>
        <div>
          <label className="block font-medium text-sm mb-1">
            Türnummer <span className="text-red-500">*</span>
          </label>
          <input name="tuernummer" type="text" required className="input" />
        </div>
        <div>
          <label className="block font-medium text-sm mb-1">
            Stiege <span className="text-red-500">*</span>
          </label>
          <input name="stiege" type="text" required className="input" />
        </div>
        <div>
          <label className="block font-medium text-sm mb-1">Postleitzahl *</label>
          <input name="plz" type="text" required className="input" />
        </div>
        <div>
          <label className="block font-medium text-sm mb-1">Ort *</label>
          <input name="ort" type="text" required className="input" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium text-sm mb-1">
            Telefonnummer <span className="text-red-500">*</span>
          </label>
          <input name="telefon" type="tel" required className="input" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium text-sm mb-1">E-Mail *</label>
          <input name="email" type="email" required className="input" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium text-sm mb-1">Passwort *</label>
          <input name="password" type="password" required className="input" />
        </div>

        {actionData?.error && (
          <p className="md:col-span-2 text-red-600">{actionData.error}</p>
        )}

        <div className="md:col-span-2 mt-2">
          <button
            type="submit"
            disabled={navigation.state === "submitting"}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-all w-full"
          >
            {navigation.state === "submitting" ? "Registriere..." : "Registrieren"}
          </button>
        </div>
      </Form>
    </div>
  );
}

// Tailwind helper style – du kannst sie in deine globale CSS oder tailwind.css Datei aufnehmen
// oder inline lassen:
const inputClass = "border border-gray-300 rounded w-full px-3 py-2 focus:outline-none focus:ring focus:border-blue-400";
