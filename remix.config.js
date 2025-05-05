/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  // serverBuildTarget: "vercel", // Entfernen
  // server: undefined, // Entfernen
  ignoredRouteFiles: ["**/.*"],
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverModuleFormat: "esm",
  future: {
    v2_routeConvention: true,
    v3_lazyRouteDiscovery: false, // wichtig!
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
  },
};
