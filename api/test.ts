export default function handler(req: Request): Response {
    return new Response("API läuft ✅", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
  