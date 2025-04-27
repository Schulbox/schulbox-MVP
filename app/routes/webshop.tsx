// app/routes/webshop.tsx
import { Outlet } from "@remix-run/react";

export default function WebshopLayout() {
  return (
    <div className="p-4">
      <Outlet />
    </div>
  );
}
