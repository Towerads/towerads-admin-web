"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Row = {
  provider: string;
  impressions: number | string;
  revenue: number | string;
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"today" | "7d" | "30d">("today");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // нужен для Recharts + Next App Router
  useEffect(() => {
    setMounted(true);
  }, []);

  // загрузка данных с бэка
  useEffect(() => {
    setLoading(true);
    api(`/admin/stats/providers?period=${period}`)
      .then((r) => setRows(r?.stats ?? []))
      .finally(() => setLoading(false));
  }, [period]);

  // totals
  const totals = useMemo(() => {
    const totalImpressions = rows.reduce(
      (sum, r) => sum + Number(r.impressions || 0),
      0
    );
    const totalRevenue = rows.reduce(
      (sum, r) => sum + Number(r.revenue || 0),
      0
    );
    return { totalImpressions, totalRevenue };
  }, [rows]);

  // chart data
  const chartData = useMemo(() => {
    return rows.map((r) => ({
      provider: r.provider,
      impressions: Number(r.impressions || 0),
      revenue: Number(r.revenue || 0),
    }));
  }, [rows]);

  return (
    <div className="page-inner">
      {/* ===== Header ===== */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">
            Providers performance for selected period
          </p>
        </div>
      </div>

      {/* ===== Split layout ===== */}
      <div className="split-layout">
        {/* ===== Left panel ===== */}
        <aside className="side-panel">
          <div className="panel-title">Overview</div>

          <div className="stats-list">
            <div className="stat-row">
              <span>Period</span>
              <strong>{period}</strong>
            </div>

            <div className="stat-row">
              <span>Providers</span>
              <strong>{rows.length}</strong>
            </div>

            <div className="stat-row">
              <span>Impressions</span>
              <strong>{totals.totalImpressions}</strong>
            </div>

            <div className="stat-row">
              <span>Revenue</span>
              <strong>${totals.totalRevenue.toFixed(2)}</strong>
            </div>
          </div>

          <div className="panel-divider" />

          <div className="panel-title">Period</div>
          <div className="analytics-filters">
            {(["today", "7d", "30d"] as const).map((p) => (
              <button
                key={p}
                className={`filter ${period === p ? "active" : ""}`}
                onClick={() => setPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </aside>

        {/* ===== Right content ===== */}
        <section className="main-panel">
          {/* ===== Chart ===== */}
          <div className="chart-card">
            <div className="chart-head">
              <div className="chart-title">Revenue / Impressions</div>
              <div className="chart-sub">({period})</div>
            </div>

            <div className="chart-box">
              {loading ? (
                <div className="loading">Loading…</div>
              ) : !mounted ? null : chartData.length === 0 ? (
                <div className="empty">No data for this period</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 16, right: 24, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="rgba(255,255,255,0.08)"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="provider"
                      stroke="#94a3b8"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#020617",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="impressions"
                      fill="#38bdf8"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#a855f7"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ===== Table ===== */}
          <div className="table-card">
            <table className="table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Impressions</th>
                  <th>Revenue ($)</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr key={r.provider}>
                    <td className="capitalize">{r.provider}</td>
                    <td>{Number(r.impressions || 0)}</td>
                    <td>${Number(r.revenue || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && <div className="loading">Loading…</div>}
          </div>
        </section>
      </div>
    </div>
  );
}
