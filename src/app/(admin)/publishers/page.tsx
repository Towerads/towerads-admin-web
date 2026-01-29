"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Publisher = {
  id: number;
  name: string;
  impressions: number;
  revenue: number | string;
  cost: number | string;
  profit: number | string;
  cpm: number | string;
};

export default function PublishersPage() {
  const [rows, setRows] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api("/admin/publishers");
      setRows(data.publishers || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Паблишеры</h1>
          <p className="page-subtitle">
            Статистика приложений, где показывается реклама
          </p>
        </div>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Паблишер</th>
              <th>Показы</th>
              <th>Доход</th>
              <th>Расход</th>
              <th>Прибыль</th>
              <th>CPM</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 700 }}>{p.name}</td>
                <td>{p.impressions}</td>
                <td>${Number(p.revenue).toFixed(4)}</td>
                <td>${Number(p.cost).toFixed(4)}</td>
                <td>${Number(p.profit).toFixed(4)}</td>
                <td>${Number(p.cpm).toFixed(2)}</td>
              </tr>
            ))}

            {!rows.length && !loading && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", opacity: 0.6 }}>
                  Нет данных
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {loading && <div className="loading">Загрузка…</div>}
      </div>
    </div>
  );
}
