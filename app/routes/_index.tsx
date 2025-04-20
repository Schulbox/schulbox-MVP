// app/root.tsx oder app/routes/_index.tsx
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getSupabaseServerClient } from "~/lib/supabase.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async (ctx: LoaderFunctionArgs) => {
  const supabase = getSupabaseServerClient(ctx);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return json({ user });
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Willkommen bei Schulbox</h1>
      {user ? (
        <p className="text-green-600">✅ Eingeloggt als {user.email}</p>
      ) : (
        <p className="text-red-600">❌ Nicht eingeloggt</p>
      )}
    </main>
  );
}
