// app/lib/supabase.server.ts
import { createServerClient } from "@supabase/auth-helpers-remix";
import type { LoaderFunctionArgs } from "@remix-run/node";

export function getSupabaseServerClient(
  ctx: LoaderFunctionArgs,
  refresh_token?: string
) {

  console.log("ENV SUPABASE_URL:", process.env.SUPABASE_URL);
  console.log("ENV SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY);
  

  const enhancedOptions = {
    request: ctx.request,
    response: new Response(), // Dummy Response
    cookies: {
      get(name: string) {
        const cookieHeader = ctx.request.headers.get("Cookie") || "";
        const cookies = cookieHeader
          .split(";")
          .reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            if (key) acc[key] = value;
            return acc;
          }, {} as Record<string, string>);

        if (name === "sb-refresh-token" && refresh_token) {
          console.log("[supabase.server] Refresh-Token aus Session verwenden");
          return refresh_token;
        }

        if (name === "sb-access-token") {
          return ""; // bewusst leer lassen
        }

        return cookies[name] || "";
      },
    },
  } as any;

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    enhancedOptions
  );
}
