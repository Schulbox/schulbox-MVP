/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  future: {
    v2_routeConvention: true,
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
  },
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  serverBuildPath: "build/index.js", // WICHTIG: korrekt angeben für Vercel
  publicPath: "/build/", // WICHTIG: Assets richtig ausliefern
};
