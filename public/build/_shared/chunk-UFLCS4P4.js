import {
  createClient,
  init_module
} from "/build/_shared/chunk-XBXWO5VA.js";
import {
  createHotContext
} from "/build/_shared/chunk-FJUA326G.js";

// app/lib/supabaseClient.ts
init_module();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\lib\\supabaseClient.ts"
  );
  import.meta.hot.lastModified = "1745247910424.8694";
}
var supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
var supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL oder Anon Key fehlt in den Umgebungsvariablen.");
}
var supabase = createClient(supabaseUrl, supabaseAnonKey);

export {
  supabase
};
//# sourceMappingURL=/build/_shared/chunk-UFLCS4P4.js.map
