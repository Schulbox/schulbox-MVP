// app/routes/konfigurator.tsx
import { LoaderFunctionArgs } from "@remix-run/node";
import { requireLehrkraft } from "~/utils/auth.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async (ctx: LoaderFunctionArgs) => {
  const user = await requireLehrkraft(ctx);
  return { user };
};

export default function Konfigurator() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">📦 Schulbox-Konfigurator</h1>
      <p className="text-sm text-gray-600">Eingeloggt als {user.email}</p>
    </div>
  );
}
