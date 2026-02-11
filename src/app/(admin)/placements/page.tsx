"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Placement = {
  id: string;
  name: string;
  domain: string;
  ad_type: string;
  moderation_status: "draft" | "pending" | "approved" | "rejected";
  rejected_reason?: string | null;
  approved_at?: string | null;
  created_at?: string;
  publisher_id?: string;
};

type StatusFilter = "pending" | "approved" | "rejected" | "all";

export default function PlacementsPage() {
  const [rows, setRows] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusFilter>("pending");

  async function load() {
    setLoading(true);
    try {
      const r = await api(`/admin/placements?status=${status}`);
      setRows(r?.rows || []);
    } finally {
      setLoading(false);
    }
  }

  async function approve(id: string) {
    await api(`/admin/placements/${id}/approve`, { method: "POST" });
    await load();
  }

  async function rejectPlacement(id: string) {
    const reason = prompt("Причина отклонения?");
    if (!reason) return;

    await api(`/admin/placements/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });

    await load();
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function statusLabel(s: Placement["moderation_status"]) {
    switch (s) {
      case "pending":
        return "На модерации";
      case "approved":
        return "Одобрено";
      case "rejected":
        return "Отклонено";
      case "draft":
        return "Черновик";
      default:
        return s;
    }
  }

  function typeLabel(t: Placement["ad_type"]) {
    switch (t) {
      case "rewarded_video":
        return "Вознаграждаемое видео";
      case "interstitial":
        return "Интерстициал";
      default:
        return t;
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Доски (Placements)</h1>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
        >
          <option value="pending">На модерации</option>
          <option value="approved">Одобренные</option>
          <option value="rejected">Отклонённые</option>
          <option value="all">Все</option>
        </select>

        <button onClick={load} disabled={loading}>
          {loading ? "Загрузка..." : "Обновить"}
        </button>

        <div style={{ opacity: 0.7 }}>Всего: {rows.length}</div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
              <th align="left" style={{ padding: 8 }}>
                Название
              </th>
              <th align="left" style={{ padding: 8 }}>
                Домен / ссылка
              </th>
              <th align="left" style={{ padding: 8 }}>
                Тип
              </th>
              <th align="left" style={{ padding: 8 }}>
                Статус
              </th>
              <th align="left" style={{ padding: 8 }}>
                Причина
              </th>
              <th align="left" style={{ padding: 8 }}>
                Действия
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((p) => (
              <tr
                key={p.id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <td style={{ padding: 8 }}>{p.name}</td>
                <td style={{ padding: 8 }}>{p.domain}</td>
                <td style={{ padding: 8 }}>{typeLabel(p.ad_type)}</td>
                <td style={{ padding: 8 }}>
                  <b>{statusLabel(p.moderation_status)}</b>
                </td>
                <td style={{ padding: 8 }}>{p.rejected_reason || "—"}</td>
                <td style={{ padding: 8, display: "flex", gap: 8 }}>
                  <button
                    onClick={() => approve(p.id)}
                    disabled={p.moderation_status === "approved"}
                  >
                    Одобрить
                  </button>
                  <button onClick={() => rejectPlacement(p.id)}>
                    Отклонить
                  </button>
                </td>
              </tr>
            ))}

            {!rows.length && (
              <tr>
                <td colSpan={6} style={{ padding: 12, opacity: 0.7 }}>
                  Пусто
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
