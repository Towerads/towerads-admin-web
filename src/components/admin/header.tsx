"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const titles: Record<string, string> = {
    "/": "Dashboard",
    "/providers": "Providers",
    "/analytics": "Analytics",
  };

  const title = titles[pathname] || "Admin";

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <h1>{title}</h1>
      </div>

      <div className="admin-header-right">
        <div className="admin-user">
          admin@towerads.io
        </div>
      </div>
    </header>
  );
}

