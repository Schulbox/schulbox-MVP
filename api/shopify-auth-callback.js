// api/shopify-auth-callback.js
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { restResources } from '@shopify/shopify-api/rest/admin/2023-10';

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ['read_products', 'write_products'],
  hostName: process.env.HOST.replace(/^https:\/\//, ''),
  isEmbeddedApp: true,
  apiVersion: LATEST_API_VERSION,
  restResources,
});

export default async function handler(req, res) {
  try {
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
    });

    const { session } = callbackResponse;

    // Hier kannst du das Access Token speichern, z.B. in einer Datenbank

    res.redirect('/konfigurator');
  } catch (error) {
    console.error('Error handling Shopify auth callback:', error);
    res.redirect('/auth/error');
  }
}
