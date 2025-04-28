import { useMatches } from "@remix-run/react";

export default function DebugRoutesPage() {
  const matches = useMatches();

  return (
    <div style={{ padding: 20 }}>
      <h1>🛠 Debug: Alle geladenen Routen</h1>
      <pre style={{ background: "#eee", padding: 10 }}>
        {JSON.stringify(matches, null, 2)}
      </pre>
    </div>
  );
}
