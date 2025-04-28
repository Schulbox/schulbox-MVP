import { flatRoutes } from "remix-flat-routes";

export default function routes(defineRoutes: any) {
  return flatRoutes("routes", defineRoutes, {
    ignoredRouteFiles: ["**/.*"],
    // Verwende einen anderen Charakter als '+' für Vercel-Kompatibilität
    nestedDirectoryChar: '_',
  });
}
