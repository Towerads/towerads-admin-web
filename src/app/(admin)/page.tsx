"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type DashboardStats = {
  requests: number;
  impressions: number;
  clicks: number;
  revenue: number;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    api("/admin/stats")
      .then((r) => setData(r))
      .catch(() => setError("Dashboard API error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard…</div>;
  }

  if (error || !data) {
    return (
      <div className="page-inner">
        <div className="alert warning">
          <strong>Error</strong>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of platform performance</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-label">Revenue</div>
          <div className="card-value">
            ${data.revenue.toFixed(2)}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-label">Impressions</div>
          <div className="card-value">
            {data.impressions}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-label">Clicks</div>
          <div className="card-value">
            {data.clicks}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-label">Requests</div>
          <div className="card-value">
            {data.requests}
          </div>
        </div>
      </div>

      <div className="dashboard-chart">
        <div className="chart-placeholder">
          Requests / Impressions / Clicks (24h)
        </div>
      </div>
    </div>
  );
}
