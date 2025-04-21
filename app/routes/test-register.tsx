// test-register.tsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function TestRegister() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [message, setMessage] = useState("");

  async function register() {
    setMessage("Loading...");
    const { error, data } = await supabase.auth.signUp({
      email,
      password: pw,
    });

    if (error) {
      setMessage("Fehler: " + error.message);
    } else {
      setMessage("Check your Mailbox! ✅");
    }
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>Testregistrierung</h2>
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Passwort"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      /><br />
      <button onClick={register}>Testregistrieren</button>
      <p>{message}</p>
    </div>
  );
}
