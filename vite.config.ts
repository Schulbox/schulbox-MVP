import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import { vercelPreset } from "@vercel/remix/vite";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: false,
      },
    }),
    tsconfigPaths(),
  ],
  define: {
    "process.env.SUPABASE_URL": JSON.stringify(process.env.SUPABASE_URL),
    "process.env.SUPABASE_ANON_KEY": JSON.stringify(process.env.SUPABASE_ANON_KEY),
    "process.env.SHOP_DOMAIN": JSON.stringify(process.env.SHOP_DOMAIN),
    "process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN": JSON.stringify(process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN),
  },
});
