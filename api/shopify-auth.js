// api/shopify-auth.js
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
  const { shop } = req.query;

  if (!shop) {
    res.status(400).send('Missing shop parameter');
    return;
  }

  try {
    const authRoute = await shopify.auth.begin({
      shop,
      callbackPath: '/api/shopify-auth/callback',
      isOnline: true,
      rawRequest: req,
    });

    res.redirect(authRoute);
  } catch (error) {
    console.error('Error initiating Shopify auth:', error);
    res.status(500).send('Internal Server Error');
  }
}
