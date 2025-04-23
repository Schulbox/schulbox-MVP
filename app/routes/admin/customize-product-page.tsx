// app/routes/admin/customize-product-page.tsx
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { requireLehrkraft } from "~/utils/auth.server";
import { customizeProductPage } from "~/lib/shopify/theme.server";
import { useState } from "react";

export const loader = async (ctx: LoaderFunctionArgs) => {
  // Stelle sicher, dass nur Lehrkräfte Zugriff haben
  const user = await requireLehrkraft(ctx);
  return json({ user });
};

export async function action({ request }: LoaderFunctionArgs) {
  // Stelle sicher, dass nur Lehrkräfte Zugriff haben
  await requireLehrkraft({ request } as LoaderFunctionArgs);
  
  try {
    // Führe die Anpassung der Produktseite durch
    await customizeProductPage();
    return json({ success: true, message: "Produktseite wurde erfolgreich angepasst!" });
  } catch (error) {
    console.error("Fehler bei der Anpassung der Produktseite:", error);
    return json({ 
      success: false, 
      message: "Fehler bei der Anpassung der Produktseite. Bitte versuchen Sie es erneut."
    });
  }
}

export default function CustomizeProductPage() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    setIsSubmitting(true);
  };
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🛍️ Produktseite anpassen</h1>
      <p className="text-sm text-gray-600 mb-6">Eingeloggt als {user.email}</p>
      
      {actionData?.success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">{actionData.message}</p>
          <p className="mt-2">
            Die Produktseite wurde erfolgreich angepasst und zeigt nun die individuellen Preise 
            und den 10% Aufschlag für die geschützte Werkstätte an.
          </p>
          <div className="mt-4">
            <a 
              href="/konfigurator" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Zurück zum Konfigurator
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Produktseite anpassen</h2>
            <p className="mb-4">
              Diese Funktion passt die Produktseite im Shopify-Shop an, um für Schulboxen:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Einzelpreise der enthaltenen Produkte anzuzeigen</li>
              <li>Eine Zeile für "+10% für geschützte Werkstätte" hinzuzufügen</li>
              <li>Den korrekten Gesamtpreis anzuzeigen</li>
            </ul>
            <p className="text-sm text-gray-600">
              Hinweis: Diese Änderung betrifft nur Produkte vom Typ "Schulbox".
            </p>
          </div>
          
          <Form method="post" onSubmit={handleSubmit}>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting 
                ? "Produktseite wird angepasst..." 
                : "Produktseite jetzt anpassen"}
            </button>
            
            {actionData?.success === false && (
              <p className="text-red-500 text-sm mt-2">{actionData.message}</p>
            )}
          </Form>
        </div>
      )}
    </div>
  );
}
