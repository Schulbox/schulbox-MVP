// app/routes/konfigurator.tsx
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react";
import { requireLehrkraft } from "~/utils/auth.server";
import { useState } from "react";
import { hasValidAccessToken } from "~/lib/shopify/auth.server";
import { getAllProducts, createSchulboxProduct } from "~/lib/shopify/products.server";

export const loader = async (ctx: LoaderFunctionArgs) => {
  // Stelle sicher, dass nur Lehrkräfte Zugriff haben
  const user = await requireLehrkraft(ctx);
  
  // Prüfe, ob ein gültiges Shopify-Token vorhanden ist
  const hasToken = await hasValidAccessToken();
  
  let products = [];
  if (hasToken) {
    try {
      // Hole alle Produkte aus dem Shopify-Shop
      products = await getAllProducts();
    } catch (error) {
      console.error("Fehler beim Laden der Produkte:", error);
    }
  }
  
  return json({ 
    user, 
    hasToken,
    products
  });
};

export async function action({ request }: LoaderFunctionArgs) {
  // Stelle sicher, dass nur Lehrkräfte Zugriff haben
  await requireLehrkraft({ request } as LoaderFunctionArgs);
  
  const formData = await request.formData();
  const schulname = formData.get("schulname") as string;
  const klasse = formData.get("klasse") as string;
  const jahrgang = formData.get("jahrgang") as string;
  const lieferdatum = formData.get("lieferdatum") as string;
  
  // Hole die ausgewählten Produkte und ihre Preise
  const selectedProductIds = formData.getAll("selectedProducts") as string[];
  const selectedProducts = [];
  let totalPrice = 0;
  
  for (const id of selectedProductIds) {
    const title = formData.get(`product_title_${id}`) as string;
    const price = parseFloat(formData.get(`product_price_${id}`) as string);
    
    selectedProducts.push({
      id,
      title,
      price
    });
    
    totalPrice += price;
  }
  
  try {
    // Erstelle ein neues Schulbox-Produkt in Shopify
    const newProduct = await createSchulboxProduct({
      schulname,
      klasse,
      jahrgang,
      lieferdatum,
      selectedProducts,
      totalPrice
    });
    
    return json({ 
      success: true, 
      product: newProduct,
      message: "Schulbox wurde erfolgreich erstellt!"
    });
  } catch (error) {
    console.error("Fehler beim Erstellen der Schulbox:", error);
    return json({ 
      success: false, 
      message: "Fehler beim Erstellen der Schulbox. Bitte versuchen Sie es erneut."
    });
  }
}

export default function Konfigurator() {
  const { user, hasToken, products } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Berechne den Gesamtpreis der ausgewählten Produkte
  const calculateTotalPrice = () => {
    return products
      .filter(product => selectedProducts.includes(product.id))
      .reduce((sum, product) => sum + parseFloat(product.variants[0].price), 0);
  };
  
  const totalPrice = calculateTotalPrice();
  const finalPrice = totalPrice * 1.1; // 10% Aufschlag
  
  // Verwalte die Auswahl von Produkten
  const handleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📦 Schulbox-Konfigurator</h1>
      <p className="text-sm text-gray-600 mb-6">Eingeloggt als {user.email}</p>
      
      {!hasToken ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Shopify-Verbindung erforderlich</p>
          <p className="text-sm mt-1">
            Um den Konfigurator nutzen zu können, müssen Sie zuerst eine Verbindung zu Shopify herstellen.
          </p>
          <a 
            href="/auth/shopify" 
            className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Mit Shopify verbinden
          </a>
        </div>
      ) : (
        <>
          {actionData?.success ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <p className="font-medium">{actionData.message}</p>
              <p className="mt-2">
                Die Schulbox wurde erfolgreich erstellt und ist jetzt im Shop verfügbar.
              </p>
              <div className="mt-4 flex gap-4">
                <a 
                  href={`https://nqwde0-ua.myshopify.com/products/${actionData.product.handle}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Schulbox im Shop ansehen
                </a>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                >
                  Neue Schulbox erstellen
                </button>
              </div>
            </div>
          ) : (
            <Form method="post" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Schulbox-Details</h2>
                  
                  <div>
                    <label htmlFor="schulname" className="block text-sm font-medium text-gray-700">Schulname *</label>
                    <input 
                      type="text" 
                      id="schulname" 
                      name="schulname" 
                      required 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="klasse" className="block text-sm font-medium text-gray-700">Klasse *</label>
                    <input 
                      type="text" 
                      id="klasse" 
                      name="klasse" 
                      required 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="jahrgang" className="block text-sm font-medium text-gray-700">Jahrgang *</label>
                    <input 
                      type="text" 
                      id="jahrgang" 
                      name="jahrgang" 
                      required 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lieferdatum" className="block text-sm font-medium text-gray-700">Lieferdatum *</label>
                    <input 
                      type="date" 
                      id="lieferdatum" 
                      name="lieferdatum" 
                      required 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Preisübersicht</h2>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between py-2">
                      <span>Zwischensumme:</span>
                      <span>{totalPrice.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between py-2 text-green-700">
                      <span>+10% für geschützte Werkstätte:</span>
                      <span>{(totalPrice * 0.1).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold border-t border-gray-300 mt-2 pt-2">
                      <span>Gesamtpreis:</span>
                      <span>{finalPrice.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Produkte auswählen</h2>
                {products.length === 0 ? (
                  <p className="text-gray-500">Keine Produkte verfügbar.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(product => (
                      <div 
                        key={product.id} 
                        className={`border rounded-md p-4 cursor-pointer transition ${
                          selectedProducts.includes(product.id) 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                        onClick={() => handleProductSelection(product.id)}
                      >
                        <div className="flex items-start gap-3">
                          <input 
                            type="checkbox" 
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => {}}
                            className="mt-1"
                          />
                          <div>
                            <h3 className="font-medium">{product.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{parseFloat(product.variants[0].price).toFixed(2)} €</p>
                          </div>
                        </div>
                        
                        {/* Versteckte Felder für die ausgewählten Produkte */}
                        {selectedProducts.includes(product.id) && (
                          <>
                            <input type="hidden" name="selectedProducts" value={product.id} />
                            <input type="hidden" name={`product_title_${product.id}`} value={product.title} />
                            <input type="hidden" name={`product_price_${product.id}`} value={product.variants[0].price} />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <button 
                  type="submit" 
                  disabled={navigation.state === "submitting" || selectedProducts.length === 0} 
                  className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {navigation.state === "submitting" 
                    ? "Schulbox wird erstellt..." 
                    : "Schulbox erstellen"}
                </button>
                
                {selectedProducts.length === 0 && (
                  <p className="text-red-500 text-sm mt-2">
                    Bitte wählen Sie mindestens ein Produkt aus.
                  </p>
                )}
                
                {actionData?.success === false && (
                  <p className="text-red-500 text-sm mt-2">{actionData.message}</p>
                )}
              </div>
            </Form>
          )}
        </>
      )}
    </div>
  );
}
