import { Outlet } from "@remix-run/react";

export default function WebshopLayout() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <Outlet />
    </div>
  );
}
