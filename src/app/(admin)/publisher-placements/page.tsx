"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://towerads-backend.onrender.com/api";

type Row = {
  id: string;
  name: string | null;
  domain: string | null;
  ad_type: string | null;
  status: string | null;
  moderation_status: string | null;
  public_key: string | null;
  approved_at: string | null;
  rejected_reason: string | null;
  created_at: string | null;

  // если бэк отдаёт инфу о паблишере — покажем, если нет — ок
  publisher_id?: string | number | null;
  publisher_username?: string | null;
};

function StatusPill({ v }: { v: string | null | undefined }) {
  const val = String(v || "").toLowerCase();
  const bg =
    val === "approved"
      ? "rgba(34,197,94,.15)"
      : val === "pending"
      ? "rgba(245,158,11,.15)"
      : val === "rejected"
      ? "rgba(239,68,68,.15)"
      : "rgba(148,163,184,.15)";
  const color =
    val === "approved"
      ? "#16a34a"
      : val === "pending"
      ? "#d97706"
      : val === "rejected"
      ? "#dc2626"
      : "#334155";

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        background: bg,
        color,
        fontSize: 12,
        fontWeight: 600,
        display: "inline-block",
      }}
    >
      {String(v || "unknown").toUpperCase()}
    </span>
  );
}

export default function PublisherPlacementsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => {
      const hay = [
        r.id,
        r.name,
        r.domain,
        r.ad_type,
        r.status,
        r.moderation_status,
        r.public_key,
        String(r.publisher_id ?? ""),
        r.publisher_username,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(s);
    });
  }, [rows, q]);

  const load = async () => {
    setLoading(true);
    try {
      // ⚠️ тут нужен endpoint на бэке, который отдаёт placements всех паблишеров
      // Пример: GET /admin/publisher-placements
      const res = await fetch(`${API_BASE}/admin/publisher-placements`, {
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to load");

      setRows(Array.isArray(data?.rows) ? data.rows : []);
    } catch (e) {
      console.error(e);
      setRows([]);
      alert("Не удалось загрузить доски паблишеров (см. console)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
          Доски паблишеров (SDK)
        </h1>

        <button
          onClick={load}
          disabled={loading}
          style={{
            marginLeft: "auto",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(148,163,184,.35)",
            background: "transparent",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700,
          }}
        >
          {loading ? "Загрузка..." : "Обновить"}
        </button>
      </div>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск: id / name / domain / public_key / publisher..."
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(148,163,184,.35)",
            outline: "none",
          }}
        />
      </div>

      <div
        style={{
          border: "1px solid rgba(148,163,184,.25)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr .8fr .9fr 1.2fr",
            gap: 0,
            padding: "12px 14px",
            background: "rgba(15,23,42,.35)",
            fontWeight: 800,
            fontSize: 12,
            textTransform: "uppercase",
          }}
        >
          <div>Placement</div>
          <div>Publisher</div>
          <div>Domain</div>
          <div>Type</div>
          <div>Moderation</div>
          <div>Public key</div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: 14, opacity: 0.8 }}>
            {loading ? "Загрузка..." : "Нет данных"}
          </div>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr 1fr .8fr .9fr 1.2fr",
                gap: 0,
                padding: "12px 14px",
                borderTop: "1px solid rgba(148,163,184,.18)",
                alignItems: "center",
                fontSize: 13,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontWeight: 800 }}>{r.name || "(без названия)"}</div>
                <div style={{ opacity: 0.75, fontSize: 12 }}>{r.id}</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontWeight: 700 }}>
                  {r.publisher_username || "—"}
                </div>
                <div style={{ opacity: 0.75, fontSize: 12 }}>
                  {r.publisher_id ?? "—"}
                </div>
              </div>

              <div>{r.domain || "—"}</div>
              <div style={{ fontWeight: 700 }}>{r.ad_type || "—"}</div>
              <div>
                <StatusPill v={r.moderation_status} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontFamily: "monospace", fontSize: 12 }}>
                  {r.public_key || "—"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

