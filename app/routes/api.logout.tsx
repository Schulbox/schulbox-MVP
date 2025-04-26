// app/routes/api.logout.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { clearSupabaseSession } from "~/lib/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  // Lösche den Session-Marker im Cookie
  const cookie = await clearSupabaseSession(request);
  
  console.log("[api.logout] Session-Marker gelöscht");
  
  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": cookie,
      },
    }
  );
};
