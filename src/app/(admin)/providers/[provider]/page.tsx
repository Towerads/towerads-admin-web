"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type StatRow = {
  provider: string;
  impressions: number | string;
  revenue: number | string;
  cpm?: number | string;
};

const PERIOD_LABELS = {
  today: "Сегодня",
  "7d": "7 дней",
  "30d": "30 дней",
} as const;

export default function ProviderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const provider = String(params?.provider || "").toLowerCase();

  const [period, setPeriod] = useState<"today" | "7d" | "30d">("today");
  const [rows, setRows] = useState<StatRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provider) return;

    setLoading(true);
    api(`/admin/stats/providers?period=${period}`)
      .then((r) => setRows(r?.stats ?? []))
      .finally(() => setLoading(false));
  }, [provider, period]);

  const current = useMemo(() => {
    return (
      rows.find(
        (r) => String(r.provider || "").toLowerCase() === provider
      ) ?? {
        provider,
        impressions: 0,
        revenue: 0,
        cpm: 0,
      }
    );
  }, [rows, provider]);

  const impressions = Number(current.impressions || 0);
  const revenue = Number(current.revenue || 0);

  const prettyCPM =
    impressions < 10
      ? "—"
      : `$${(
          current.cpm !== undefined
            ? Number(current.cpm)
            : (revenue / impressions) * 1000
        ).toFixed(2)}`;

  return (
    <div className="page-inner">
      <div className="page-header" style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <h1 className="page-title capitalize">{provider}</h1>
          <p className="page-subtitle">
            Аналитика провайдера за выбранный период
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={() => router.push("/providers")}
        >
          Назад
        </button>
      </div>

      <div className="providers-summary" style={{ marginBottom: 16 }}>
        <div className="summary-item">
          <span className="summary-label">Период</span>
          <strong className="summary-value">
            {PERIOD_LABELS[period]}
          </strong>
        </div>

        <div className="summary-item">
          <span className="summary-label">Показы</span>
          <strong className="summary-value">{impressions}</strong>
        </div>

        <div className="summary-item">
          <span className="summary-label">Доход</span>
          <strong className="summary-value">
            ${revenue.toFixed(2)}
          </strong>
        </div>

        <div className="summary-item">
          <span className="summary-label">CPM</span>
          <strong className="summary-value">{prettyCPM}</strong>
        </div>
      </div>

      <div className="table-card">
        <div style={{ padding: 16, display: "flex", gap: 8 }}>
          {(["today", "7d", "30d"] as const).map((p) => (
            <button
              key={p}
              className={`filter ${period === p ? "active" : ""}`}
              onClick={() => setPeriod(p)}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Провайдер</th>
              <th>Показы</th>
              <th>Доход ($)</th>
              <th>CPM ($)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="capitalize">{provider}</td>
              <td>{impressions}</td>
              <td>${revenue.toFixed(2)}</td>
              <td>{prettyCPM}</td>
            </tr>
          </tbody>
        </table>

        {loading && <div className="loading">Загрузка…</div>}
      </div>
    </div>
  );
}
