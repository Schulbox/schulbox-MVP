// app/routes/index.tsx
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { supabase } from "~/lib/supabaseClient";

export const loader = async () => {
  const { data, error } = await supabase.from("users").select("*");
  return json({ users: data ?? [], error });
};

export default function Index() {
  const { users, error } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>👋 Willkommen zur Schulbox</h1>
      {error && <p>Fehler: {error.message}</p>}
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}
