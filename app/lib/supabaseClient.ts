// app/lib/supabaseClient.ts
import { createBrowserClient } from "@supabase/auth-helpers-remix";

// Sicherstellen, dass die Umgebungsvariablen korrekt geladen werden
const supabaseUrl = typeof document === 'undefined' 
  ? process.env.SUPABASE_URL 
  : window.ENV?.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey = typeof document === 'undefined'
  ? process.env.SUPABASE_ANON_KEY
  : window.ENV?.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fehlerprüfung hinzufügen
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase Konfiguration fehlt:", { 
    url: supabaseUrl ? "vorhanden" : "fehlt", 
    key: supabaseAnonKey ? "vorhanden" : "fehlt" 
  });
}

export const supabase = createBrowserClient(
  supabaseUrl || "",
  supabaseAnonKey || ""
);
