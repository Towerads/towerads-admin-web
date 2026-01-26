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
} from "recharts";

type Row = {
  provider: string;
  impressions: number | string;
  revenue: number | string;
  cost?: number | string;
  profit?: number | string;
  cpm?: number | string;
};

const PERIOD_LABELS = {
  today: "Сегодня",
  "7d": "7 дней",
  "30d": "30 дней",
} as const;

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"today" | "7d" | "30d">("today");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLoading(true);

    const query =
      from && to
        ? `/admin/stats/providers?from=${from}&to=${to}`
        : `/admin/stats/providers?period=${period}`;

    api(query)
      .then((r) => setRows(r?.stats ?? []))
      .finally(() => setLoading(false));
  }, [period, from, to]);

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

    return {
      totalImpressions,
      totalCost,
      totalProfit,
      cpm,
    };
  }, [rows]);

  const chartData = useMemo(
    () =>
      rows.map((r) => ({
        provider: r.provider,
        revenue: Number(r.revenue || 0),
      })),
    [rows]
  );

  function showCPM(r: Row) {
    const imps = Number(r.impressions || 0);
    if (imps < 10) return "—";
    if (r.cpm !== undefined) return `$${Number(r.cpm).toFixed(2)}`;
    return `$${((Number(r.revenue || 0) / imps) * 1000).toFixed(2)}`;
  }

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Аналитика</h1>
          <p className="page-subtitle">
            Эффективность провайдеров за выбранный период
          </p>
        </div>
      </div>

      <div className="split-layout">
        <aside className="side-panel">
          <div className="panel-title">Обзор</div>

          <div className="stats-list">
            <div className="stat-row">
              <span>Период</span>
              <strong>
                {from && to ? `${from} — ${to}` : PERIOD_LABELS[period]}
              </strong>
            </div>

            <div className="stat-row">
              <span>Провайдеры</span>
              <strong>{rows.length}</strong>
            </div>

            <div className="stat-row">
              <span>Расход</span>
              <strong>${totals.totalCost.toFixed(2)}</strong>
            </div>

            <div className="stat-row">
              <span>Прибыль</span>
              <strong>${totals.totalProfit.toFixed(2)}</strong>
            </div>

            <div className="stat-row">
              <span>CPM</span>
              <strong>
                {totals.totalImpressions < 10
                  ? "—"
                  : `$${totals.cpm.toFixed(2)}`}
              </strong>
            </div>
          </div>

          <div className="panel-divider" />

          <div className="panel-title">Период</div>

          {/* КНОПКИ */}
          <div className="analytics-filters">
            {(["today", "7d", "30d"] as const).map((p) => (
              <button
                key={p}
                className={`filter ${period === p ? "active" : ""}`}
                onClick={() => {
                  setPeriod(p);
                  setFrom("");
                  setTo("");
                }}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>

          {/* ОТ — ДО В ОДНУ ЛИНИЮ */}
          <div className="date-range-line">
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPeriod("today");
              }}
            />
            <span className="dash">—</span>
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPeriod("today");
              }}
            />
          </div>
        </aside>

        <section className="main-panel">
          <div className="chart-card">
            <div className="chart-head">
              <div className="chart-title">Доход по провайдерам</div>
              <div className="chart-sub">
                {from && to ? `${from} — ${to}` : PERIOD_LABELS[period]}
              </div>
            </div>

            <div className="chart-box">
              {loading ? (
                <div className="loading">Загрузка…</div>
              ) : !mounted ? null : chartData.length === 0 ? (
                <div className="empty">Нет данных за выбранный период</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="provider" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="revenue"
                      fill="#38bdf8"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="table-card">
            <table className="table">
              <thead>
                <tr>
                  <th>Провайдер</th>
                  <th>Показы</th>
                  <th>Доход ($)</th>
                  <th>Расход ($)</th>
                  <th>Прибыль ($)</th>
                  <th>CPM ($)</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr key={r.provider}>
                    <td>{r.provider}</td>
                    <td>{Number(r.impressions || 0)}</td>
                    <td>${Number(r.revenue || 0).toFixed(2)}</td>
                    <td>${Number(r.cost || 0).toFixed(2)}</td>
                    <td>
                      $
                      {Number(
                        r.profit ??
                          Number(r.revenue || 0) - Number(r.cost || 0)
                      ).toFixed(2)}
                    </td>
                    <td>{showCPM(r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && <div className="loading">Загрузка…</div>}
          </div>
        </section>
      </div>
    </div>
  );
}
