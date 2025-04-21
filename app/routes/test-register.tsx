import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function TestRegister() {
  const [email, setEmail] = useState("kamal.a15190@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [message, setMessage] = useState("");

  const handleTestRegister = async () => {
    setMessage("Wird verarbeitet...");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Fehler bei der Registrierung:", error.message);
      setMessage("❌ Fehler: " + error.message);
    } else {
      console.log("Registrierung erfolgreich:", data);
      setMessage("✅ Registrierung erfolgreich! Bitte E-Mail bestätigen.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Testregistrierung</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-Mail"
      />
      <br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Passwort"
      />
      <br />
      <button onClick={handleTestRegister}>Testregistrieren</button>
      <p>{message}</p>
    </div>
  );
}
