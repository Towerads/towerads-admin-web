"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Панель управления" },
    { href: "/orders", label: "Заказы" },
    { href: "/creatives", label: "Креативы" },
    { href: "/providers", label: "Провайдеры" },
    { href: "/analytics", label: "Аналитика" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">USL Admin</div>

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
