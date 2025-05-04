// app/routes/app/schulbox-konfigurator-v2.tsx
import { redirect } from "@remix-run/node";

export async function loader() {
  return redirect("/konfigurator");
}
