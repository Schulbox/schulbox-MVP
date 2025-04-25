import { createServerClient } from "@supabase/auth-helpers-remix";
import type { LoaderFunctionArgs } from "@remix-run/node";

export function getSupabaseServerClient(
  ctx: LoaderFunctionArgs,
  refresh_token?: string,
  access_token?: string
) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
  const originalRequest = ctx.request;
  const url = new URL(originalRequest.url);
  const newHeaders = new Headers(originalRequest.headers);

  // ⬇️ Ersetze Cookies
  if (refresh_token || access_token) {
    const cookieHeader = newHeaders.get("Cookie") || "";
    let cookies = cookieHeader.split("; ").filter(c =>
      !c.startsWith("sb-refresh-token=") && !c.startsWith("sb-access-token=")
    );

    if (refresh_token) {
      cookies.push(`sb-refresh-token=${refresh_token}`);
      console.log("[supabase.server] Verwende refresh_token für Request");
    }

    if (access_token) {
      cookies.push(`sb-access-token=${access_token}`);
      console.log("[supabase.server] Verwende access_token für Request");
      newHeaders.set("Authorization", `Bearer ${access_token}`); // ⬅️ wichtig!
    }

    newHeaders.set("Cookie", cookies.join("; "));
  }

  const newRequest = new Request(url.toString(), {
    method: originalRequest.method,
    headers: newHeaders,
    body: originalRequest.body,
    redirect: originalRequest.redirect,
    integrity: originalRequest.integrity,
    signal: originalRequest.signal,
  });

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      request: newRequest,
      response: new Response(),
    }
  );
}
