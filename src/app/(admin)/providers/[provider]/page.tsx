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
    const found = rows.find(
      (r) => String(r.provider || "").toLowerCase() === provider
    );
    return (
      found ?? {
        provider,
        impressions: 0,
        revenue: 0,
        cpm: 0,
      }
    );
  }, [rows, provider]);

  const impressions = Number(current.impressions || 0);
  const revenue = Number(current.revenue || 0);

  // если бэк не прислал cpm — считаем
  const cpmValue = current.cpm !== undefined ? Number(current.cpm || 0) : 0;

  const prettyCPM =
    impressions < 10
      ? "—"
      : `$${(current.cpm !== undefined ? cpmValue : (revenue / impressions) * 1000).toFixed(
          2
        )}`;

  return (
    <div className="page-inner">
      <div className="page-header" style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <h1 className="page-title" style={{ textTransform: "capitalize" }}>
            {provider}
          </h1>
          <p className="page-subtitle">Provider analytics for selected period</p>
        </div>

        <button className="btn-secondary" onClick={() => router.push("/providers")}>
          Back
        </button>
      </div>

      <div className="providers-summary" style={{ marginBottom: 16 }}>
        <div className="summary-item">
          <span className="summary-label">Period</span>
          <strong className="summary-value">{period}</strong>
        </div>

        <div className="summary-item">
          <span className="summary-label">Impressions</span>
          <strong className="summary-value">{impressions}</strong>
        </div>

        <div className="summary-item">
          <span className="summary-label">Revenue</span>
          <strong className="summary-value">${revenue.toFixed(2)}</strong>
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
              type="button"
            >
              {p}
            </button>
          ))}
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Impressions</th>
              <th>Revenue ($)</th>
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

        {loading && <div className="loading">Loading…</div>}
      </div>
    </div>
  );
}
