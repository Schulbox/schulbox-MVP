// localStorage-only API-Logout-Endpunkt
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { clearSupabaseSession } from "~/lib/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  // Leerer Cookie-String im localStorage-only Ansatz
  const cookie = await clearSupabaseSession(request);
  
  console.log("[api.logout] localStorage-only Ansatz: Keine Server-seitige Session-Löschung");
  
  return json(
    { success: true },
    {
      headers: {
        // Leerer Cookie-Header im localStorage-only Ansatz
        ...(cookie ? { "Set-Cookie": cookie } : {})
      },
    }
  );
};
