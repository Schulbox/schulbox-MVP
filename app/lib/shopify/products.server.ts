// app/lib/shopify/products.server.ts
import { getAuthenticatedClient } from "./auth.server";

// Holt alle Produkte aus dem Shopify-Shop
export async function getAllProducts() {
  try {
    const client = await getAuthenticatedClient();
    const response = await client.get({
      path: "products",
    });

    return response.body.products;
  } catch (error) {
    console.error("Fehler beim Abrufen der Produkte:", error);
    throw new Error("Produkte konnten nicht abgerufen werden");
  }
}

// Holt ein einzelnes Produkt anhand seiner ID
export async function getProductById(productId) {
  try {
    const client = await getAuthenticatedClient();
    const response = await client.get({
      path: `products/${productId}`,
    });

    return response.body.product;
  } catch (error) {
    console.error(`Fehler beim Abrufen des Produkts ${productId}:`, error);
    throw new Error("Produkt konnte nicht abgerufen werden");
  }
}

// Erstellt ein neues Produkt (Schulbox) im Shopify-Shop
export async function createSchulboxProduct({
  schulname,
  klasse,
  jahrgang,
  lieferdatum,
  selectedProducts,
  totalPrice
}) {
  try {
    const client = await getAuthenticatedClient();
    
    // Formatiere das Lieferdatum
    const formattedDate = new Date(lieferdatum).toLocaleDateString('de-DE');
    
    // Erstelle die Produktbeschreibung mit allen enthaltenen Artikeln
    const productDescriptions = selectedProducts.map(product => 
      `- ${product.title} (${(product.price).toFixed(2)} €)`
    ).join('\n');
    
    // Berechne den Gesamtpreis mit 10% Aufschlag
    const finalPrice = totalPrice * 1.1;
    
    // Erstelle das neue Produkt
    const response = await client.post({
      path: "products",
      data: {
        product: {
          title: `Schulbox – ${schulname} – ${klasse} – ${jahrgang}`,
          body_html: `<p>Schulbox für ${schulname}, Klasse ${klasse}, Jahrgang ${jahrgang}</p>
                      <p>Lieferdatum: ${formattedDate}</p>
                      <p>Enthaltene Artikel:</p>
                      <ul>${selectedProducts.map(p => `<li>${p.title} (${(p.price).toFixed(2)} €)</li>`).join('')}</ul>
                      <p>Zwischensumme: ${totalPrice.toFixed(2)} €</p>
                      <p>+10% für geschützte Werkstätte: ${(totalPrice * 0.1).toFixed(2)} €</p>
                      <p><strong>Gesamtpreis: ${finalPrice.toFixed(2)} €</strong></p>`,
          vendor: "Schulbox",
          product_type: "Schulbox",
          tags: ["Schulbox", schulname, klasse, jahrgang],
          variants: [
            {
              price: finalPrice.toFixed(2),
              requires_shipping: true,
              taxable: true,
              inventory_management: "shopify",
              inventory_policy: "deny",
              inventory_quantity: 1
            }
          ]
        }
      }
    });

    return response.body.product;
  } catch (error) {
    console.error("Fehler beim Erstellen der Schulbox:", error);
    throw new Error("Schulbox konnte nicht erstellt werden");
  }
}
