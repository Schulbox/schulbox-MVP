// app/routes/logout.tsx
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";

export const action = async ({ request }: ActionFunctionArgs) => {
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response: new Response() }
  );

  await supabase.auth.signOut();
  return redirect("/");
};

export default function LogoutPage() {
  return (
    <form method="post">
      <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
        Ausloggen
      </button>
    </form>
  );
}
