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
  cost?: number | string;   // ✅ ДОБАВЛЕНО
  profit?: number | string; // ✅ ДОБАВЛЕНО
  cpm?: number | string;    // ✅ ДОБАВЛЕНО
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"today" | "7d" | "30d">("today");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    api(`/admin/stats/providers?period=${period}`)
      .then((r) => setRows(r?.stats ?? []))
      .finally(() => setLoading(false));
  }, [period]);

  const totals = useMemo(() => {
    const totalImpressions = rows.reduce(
      (sum, r) => sum + Number(r.impressions || 0),
      0
    );
    const totalRevenue = rows.reduce(
      (sum, r) => sum + Number(r.revenue || 0),
      0
    );
    const totalCost = rows.reduce(
      (sum, r) => sum + Number(r.cost || 0),
      0
    );
    const totalProfit = totalRevenue - totalCost;

    const cpm =
      totalImpressions > 0 ? (totalRevenue / totalImpressions) * 1000 : 0;

    return { totalImpressions, totalRevenue, totalCost, totalProfit, cpm };
  }, [rows]);

  const chartData = useMemo(() => {
    return rows.map((r) => ({
      provider: r.provider,
      impressions: Number(r.impressions || 0),
      revenue: Number(r.revenue || 0),
    }));
  }, [rows]);

  function showCPM(r: Row) {
    const imps = Number(r.impressions || 0);
    if (imps < 10) return "—"; // чтобы не было $100 на 1 показе
    if (r.cpm !== undefined) return `$${Number(r.cpm).toFixed(2)}`;
    const rev = Number(r.revenue || 0);
    return `$${((rev / imps) * 1000).toFixed(2)}`;
  }

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Providers performance for selected period</p>
        </div>
      </div>

      <div className="split-layout">
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

            {/* ✅ ДОБАВЛЕНО */}
            <div className="stat-row">
              <span>Cost</span>
              <strong>${totals.totalCost.toFixed(2)}</strong>
            </div>

            {/* ✅ ДОБАВЛЕНО */}
            <div className="stat-row">
              <span>Profit</span>
              <strong>${totals.totalProfit.toFixed(2)}</strong>
            </div>

            {/* ✅ ДОБАВЛЕНО */}
            <div className="stat-row">
              <span>CPM</span>
              <strong>{totals.totalImpressions < 10 ? "—" : `$${totals.cpm.toFixed(2)}`}</strong>
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

        <section className="main-panel">
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
                    <XAxis dataKey="provider" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "#020617",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                      }}
                    />
                    <Legend />
                    <Bar dataKey="impressions" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="revenue" fill="#a855f7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="table-card">
            <table className="table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Impressions</th>
                  <th>Revenue ($)</th>

                  {/* ✅ ДОБАВЛЕНО */}
                  <th>Cost ($)</th>
                  {/* ✅ ДОБАВЛЕНО */}
                  <th>Profit ($)</th>

                  <th>CPM ($)</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr key={r.provider}>
                    <td className="capitalize">{r.provider}</td>
                    <td>{Number(r.impressions || 0)}</td>
                    <td>${Number(r.revenue || 0).toFixed(2)}</td>

                    {/* ✅ ДОБАВЛЕНО */}
                    <td>${Number(r.cost || 0).toFixed(2)}</td>
                    {/* ✅ ДОБАВЛЕНО */}
                    <td>${Number(r.profit || (Number(r.revenue || 0) - Number(r.cost || 0))).toFixed(2)}</td>

                    <td>{showCPM(r)}</td>
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
