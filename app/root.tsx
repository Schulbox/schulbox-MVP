// app/root.tsx
import {
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSupabaseServerClient } from "~/lib/supabase.server";
import Header from "~/components/Header";
import "./tailwind.css";

// 💡 Typ für das User-Profil
export type User = {
  vorname?: string;
  nachname?: string;
  role?: string;
  email: string; // Pflichtfeld
} | null;

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&display=swap",
  },
];

// ✅ Serverseitiger Loader
export async function loader(ctx: LoaderFunctionArgs) {
  const supabase = getSupabaseServerClient(ctx);
  const { data: { user } } = await supabase.auth.getUser();

  let profile: User = null;

  if (user?.email) {
    const { data } = await supabase
      .from("users")
      .select("vorname, nachname, role")
      .eq("user_id", user.id)
      .single();

    profile = {
      email: user.email,
      ...data,
    };
  }

  return json({ user: profile });
}

// 🧠 Head-Metadaten
export function CustomMeta() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Schulbox</title>
    </>
  );
}

// ✅ Remix-konformes Layout (holt sich user selbst per useLoaderData)
export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<typeof loader>();

  return (
    <html lang="de">
      <head>
        <CustomMeta />
        <Links />
      </head>
      <body className="bg-white text-gray-900 font-sans">
        <Header user={user} />
        <main>{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// ⬇ App gibt einfach Outlet zurück – wie vorgesehen
export default function App() {
  return <Outlet />;
}
