"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Provider = {
  placement_id: string;
  provider: string;
  status: "active" | "paused";
  traffic_percentage: number;

  // доп-поля (не обязаны приходить)
  impressions?: number | string;
  revenue?: number | string;
  cpm?: number | string;
};

export default function ProvidersPage() {
  const router = useRouter();

  const [rows, setRows] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);

  // чтобы не дергать бек при каждом движении слайдера
  const pendingTrafficRef = useRef<Record<string, number>>({});

  // --------------------
  // LOAD DATA
  // --------------------
  const load = async () => {
    setLoading(true);
    try {
      const data = await api("/admin/mediation");
      setRows(data.providers || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // --------------------
  // ACTIONS
  // --------------------
  const toggleStatus = async (row: Provider) => {
    await api("/admin/mediation/toggle", {
      method: "POST",
      body: JSON.stringify({
        placement_id: row.placement_id,
        provider: row.provider,
        status: row.status === "active" ? "paused" : "active",
      }),
    });
    load();
  };

  const updateTrafficUI = (row: Provider, value: number) => {
    const key = `${row.placement_id}__${row.provider}`;
    pendingTrafficRef.current[key] = value;

    setRows((prev) =>
      prev.map((r) =>
        r.placement_id === row.placement_id && r.provider === row.provider
          ? { ...r, traffic_percentage: value }
          : r
      )
    );
  };

  const commitTraffic = async (row: Provider) => {
    const key = `${row.placement_id}__${row.provider}`;
    const value = pendingTrafficRef.current[key];

    if (value === undefined) return;

    await api("/admin/mediation/traffic", {
      method: "POST",
      body: JSON.stringify({
        placement_id: row.placement_id,
        provider: row.provider,
        traffic_percentage: value,
      }),
    });

    delete pendingTrafficRef.current[key];
  };

  // --------------------
  // DERIVED VALUES
  // --------------------
  const activeCount = useMemo(
    () => rows.filter((r) => r.status === "active").length,
    [rows]
  );

  const totalTraffic = useMemo(() => {
    return rows.reduce((sum, r) => {
      if (r.status !== "active") return sum;
      return sum + Number(r.traffic_percentage || 0);
    }, 0);
  }, [rows]);

  const trafficValid = totalTraffic === 100;

  // --------------------
  // RENDER
  // --------------------
  return (
    <div className="page-inner">
      {/* ===== Header ===== */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Providers</h1>
          <p className="page-subtitle">
            Manage traffic distribution between ad providers
          </p>
        </div>

        <button type="button" className="btn-secondary">
          Add provider
        </button>
      </div>

      {/* ===== Compact summary bar ===== */}
      <div className="providers-summary">
        <div className="summary-item">
          <span className="summary-label">Providers</span>
          <strong className="summary-value">{rows.length}</strong>
        </div>

        <div className="summary-item">
          <span className="summary-label">Active</span>
          <strong className="summary-value">{activeCount}</strong>
        </div>

        <div className="summary-item">
          <span className="summary-label">Traffic</span>
          <strong className={`summary-value ${trafficValid ? "ok" : "danger"}`}>
            {totalTraffic}%
          </strong>
          {!trafficValid && <span className="summary-hint">must be 100%</span>}
        </div>

        <div className="summary-item">
          <span className="summary-label">Fill rate</span>
          <strong className="summary-value">96%</strong>
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Status</th>
              <th>Traffic</th>
              <th style={{ width: 140 }} />
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => {
              const disabled = r.status !== "active";

              return (
                <tr
                  key={`${r.placement_id}-${r.provider}`}
                  className={disabled ? "row-disabled" : ""}
                >
                  {/* ✅ кликабельное имя → деталка провайдера */}
                  <td className="capitalize">
                    <span
                      style={{ cursor: "pointer", fontWeight: 700 }}
                      onClick={() => router.push(`/providers/${r.provider}`)}
                      title="Open provider details"
                    >
                      {r.provider}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        r.status === "active" ? "badge-active" : "badge-paused"
                      }
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="traffic-cell">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Number(r.traffic_percentage || 0)}
                      disabled={disabled}
                      onChange={(e) => updateTrafficUI(r, Number(e.target.value))}
                      onMouseUp={() => commitTraffic(r)}
                      onTouchEnd={() => commitTraffic(r)}
                    />
                    <div className="traffic-value">
                      {Number(r.traffic_percentage || 0)}%
                    </div>
                  </td>

                  <td className="text-right">
                    <button
                      type="button"
                      className={r.status === "active" ? "btn-danger" : "btn-success"}
                      onClick={() => toggleStatus(r)}
                    >
                      {r.status === "active" ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {loading && <div className="loading">Loading…</div>}
      </div>
    </div>
  );
}

