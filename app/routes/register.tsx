// app/routes/register.tsx
import { useActionData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { supabase } from "~/lib/supabaseClient";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return json({ error: error.message });
  }

  return redirect("/"); // oder z.B. zum Login weiterleiten
};

export default function Register() {
  const data = useActionData<typeof action>();

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Registrieren</h1>
      <Form method="post" className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="E-Mail"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Passwort"
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Registrieren
        </button>
        {data?.error && <p className="text-red-500">{data.error}</p>}
      </Form>
    </div>
  );
}
