"use client";

import Sidebar from "@/components/admin/sidebar";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api("/admin/stats").then(setStats);
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <h2>Dashboard</h2>

        {stats && (
          <div className="grid">
            <div className="card">Requests<br /><b>{stats.requests}</b></div>
            <div className="card">Impressions<br /><b>{stats.impressions}</b></div>
            <div className="card">Clicks<br /><b>{stats.clicks}</b></div>
            <div className="card">Revenue<br /><b>${stats.revenue}</b></div>
          </div>
        )}
      </div>
    </div>
  );
}
