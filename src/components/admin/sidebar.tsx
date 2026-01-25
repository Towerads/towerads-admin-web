"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/orders", label: "Orders" },       
    { href: "/creatives", label: "Creatives" },
    { href: "/providers", label: "Providers" },
    { href: "/analytics", label: "Analytics" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">TowerAds Admin</div>

      <nav className="sidebar-nav">
        {links.map((l) => {
          const isActive =
            l.href === "/"
              ? pathname === "/"
              : pathname.startsWith(l.href);

          return (
            <Link
              key={l.href}
              href={l.href}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
