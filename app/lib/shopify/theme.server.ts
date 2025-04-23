// app/lib/shopify/theme.server.ts
import { getAuthenticatedClient } from "./auth.server";

// Funktion zum Abrufen der Theme-ID des aktiven Themes
export async function getActiveThemeId() {
  try {
    const client = await getAuthenticatedClient();
    const response = await client.get({
      path: "themes",
    });

    const activeTheme = response.body.themes.find(theme => theme.role === "main");
    
    if (!activeTheme) {
      throw new Error("Kein aktives Theme gefunden");
    }
    
    return activeTheme.id;
  } catch (error) {
    console.error("Fehler beim Abrufen des aktiven Themes:", error);
    throw error;
  }
}

// Funktion zum Anpassen der Produktseite
export async function customizeProductPage() {
  try {
    const client = await getAuthenticatedClient();
    const themeId = await getActiveThemeId();
    
    // Hole das aktuelle product-template Asset
    const response = await client.get({
      path: `themes/${themeId}/assets`,
      query: { "asset[key]": "sections/product-template.liquid" }
    });
    
    if (!response.body.asset || !response.body.asset.value) {
      throw new Error("Product-Template nicht gefunden");
    }
    
    let template = response.body.asset.value;
    
    // Prüfe, ob es sich um eine Schulbox handelt
    const customizationCode = `
{% if product.type == 'Schulbox' %}
  <div class="schulbox-details">
    <h3>Enthaltene Artikel:</h3>
    <div class="schulbox-items">
      {{ product.description }}
    </div>
    
    <div class="schulbox-pricing">
      <div class="price-row">
        <span class="price-label">Zwischensumme:</span>
        <span class="price-value">{{ product.metafields.schulbox.subtotal | default: product.price | times: 0.909 | money }}</span>
      </div>
      
      <div class="price-row markup">
        <span class="price-label">+10% für geschützte Werkstätte:</span>
        <span class="price-value">{{ product.metafields.schulbox.subtotal | default: product.price | times: 0.0909 | money }}</span>
      </div>
      
      <div class="price-row total">
        <span class="price-label">Gesamtpreis:</span>
        <span class="price-value">{{ product.price | money }}</span>
      </div>
    </div>
  </div>
  
  <style>
    .schulbox-details {
      margin-top: 20px;
      padding: 15px;
      border: 1px solid #e8e8e8;
      border-radius: 5px;
    }
    
    .schulbox-items {
      margin-bottom: 20px;
    }
    
    .schulbox-pricing {
      border-top: 1px solid #e8e8e8;
      padding-top: 15px;
    }
    
    .price-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .markup {
      color: #2e8540;
    }
    
    .total {
      font-weight: bold;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #e8e8e8;
    }
  </style>
{% endif %}`;
    
    // Füge den Code vor dem schließenden </div> des Produktbereichs ein
    if (template.includes('</div>')) {
      template = template.replace('</div>', `${customizationCode}\n</div>`);
    } else {
      // Fallback: Füge den Code am Ende ein
      template += customizationCode;
    }
    
    // Aktualisiere das Template
    await client.put({
      path: `themes/${themeId}/assets`,
      data: {
        asset: {
          key: "sections/product-template.liquid",
          value: template
        }
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Fehler beim Anpassen der Produktseite:", error);
    throw error;
  }
}
