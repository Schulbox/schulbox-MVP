export default {
  future: {
    v2_routeConvention: true,
    v3_lazyRouteDiscovery: false, // <-- hinzufügen oder auf false setzen!
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
  },
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
};
