"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Provider = {
  placement_id: string;
  provider: string;
  status: "active" | "paused";
  traffic_percentage: number;

  impressions?: number | string;
  revenue?: number | string;
  cpm?: number | string;
};

export default function ProvidersPage() {
  const router = useRouter();

  const [rows, setRows] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);

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
      <div className="page-header">
        <div>
          <h1 className="page-title">Провайдеры</h1>
          <p className="page-subtitle">
            Управление распределением трафика между рекламными провайдерами
          </p>
        </div>
      </div>

      <div className="providers-summary">
        <div className="summary-item">
          <span className="summary-label">Всего провайдеров</span>
          <strong className="summary-value">{rows.length}</strong>
        </div>

        <div className="summary-item">
          <span className="summary-label">Активные</span>
          <strong className="summary-value">{activeCount}</strong>
        </div>

        <div className="summary-item">
          <span className="summary-label">Трафик</span>
          <strong className={`summary-value ${trafficValid ? "ok" : "danger"}`}>
            {totalTraffic}%
          </strong>
          {!trafficValid && (
            <span className="summary-hint">должно быть 100%</span>
          )}
        </div>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Провайдер</th>
              <th>Статус</th>
              <th>Трафик</th>
              <th style={{ width: 160 }} />
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
                  <td className="capitalize">
                    <span
                      style={{ cursor: "pointer", fontWeight: 700 }}
                      onClick={() => router.push(`/providers/${r.provider}`)}
                    >
                      {r.provider}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        r.status === "active"
                          ? "badge-active"
                          : "badge-paused"
                      }
                    >
                      {r.status === "active" ? "Активен" : "Пауза"}
                    </span>
                  </td>

                  <td className="traffic-cell">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Number(r.traffic_percentage || 0)}
                      disabled={disabled}
                      onChange={(e) =>
                        updateTrafficUI(r, Number(e.target.value))
                      }
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
                      className={
                        r.status === "active"
                          ? "btn-danger"
                          : "btn-success"
                      }
                      onClick={() => toggleStatus(r)}
                    >
                      {r.status === "active" ? "Отключить" : "Включить"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {loading && <div className="loading">Загрузка…</div>}
      </div>
    </div>
  );
}
