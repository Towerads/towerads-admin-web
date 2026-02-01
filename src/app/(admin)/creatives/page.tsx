"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type CreativeStatus = "pending" | "approved" | "rejected";

type Creative = {
  id: string;
  type: "video" | "banner";
  title?: string;  
  media_url: string;
  advertiser_email: string;
  status: CreativeStatus;
  created_at: string;

  pricing_name?: string;
  impressions?: number;
  price_usd?: number;
};

const TABS: { key: CreativeStatus; label: string }[] = [
  { key: "pending", label: "Новые заявки" },
  { key: "approved", label: "Одобрены" },
  { key: "rejected", label: "Отклонены" },
];

export default function CreativesPage() {
  const [activeTab, setActiveTab] = useState<CreativeStatus>("pending");
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState<Creative | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    loadCreatives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function loadCreatives() {
    setLoading(true);
    try {
      const data = await api(`/admin/creatives?status=${activeTab}`);
      setCreatives(data.creatives || []);
    } finally {
      setLoading(false);
    }
  }

  async function approve(id: string) {
    setActionLoading(true);
    try {
      await api("/admin/creatives/approve", {
        method: "POST",
        body: JSON.stringify({ creative_id: id }),
      });
      setSelected(null);
      loadCreatives();
    } finally {
      setActionLoading(false);
    }
  }

  async function reject(id: string) {
    if (!rejectReason.trim()) return;

    setActionLoading(true);
    try {
      await api("/admin/creatives/reject", {
        method: "POST",
        body: JSON.stringify({
          creative_id: id,
          reason: rejectReason.trim(),
        }),
      });
      setRejectReason("");
      setSelected(null);
      loadCreatives();
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-inner">
        <h1 style={{ marginBottom: 24 }}>Модерация креативов</h1>

        {/* ТАБЫ */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 14,
                background:
                  activeTab === tab.key
                    ? "rgba(99,102,241,0.18)"
                    : "rgba(255,255,255,0.04)",
                border:
                  activeTab === tab.key
                    ? "1px solid rgba(99,102,241,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && <div>Загрузка…</div>}

        {!loading && creatives.length === 0 && (
          <div style={{ opacity: 0.6 }}>Креативов нет</div>
        )}

        {/* СПИСОК */}
        <div style={{ display: "grid", gap: 14 }}>
          {creatives.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr 120px",
                gap: 20,
                alignItems: "center",
                padding: 14,
                borderRadius: 14,
                cursor: "pointer",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
            {c.type === "video" && (
              <video
                src={c.media_url}
                muted
                preload="metadata"
                style={{
                  width: "100%",
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 10,
                  background: "#000",
                }}
              />
            )}

            {c.type === "banner" && (
              <img
                src={c.media_url}
                alt="banner"
                style={{
                  width: "100%",
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 10,
                  background: "#000",
                }}
              />
            )}

              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ fontWeight: 800 }}>
                  {c.title || "Без названия"}
                </div>

                <div style={{ fontSize: 12, opacity: 0.6 }}>
                  рекламодатель: {c.advertiser_email}
                </div>

                {c.pricing_name && (
                  <div style={{ fontSize: 13, opacity: 0.75 }}>
                    {c.pricing_name} ·{" "}
                    {c.impressions?.toLocaleString()} показов · $
                    {c.price_usd}
                  </div>
                )}

                <div style={{ fontSize: 12, opacity: 0.5 }}>
                  {new Date(c.created_at).toLocaleDateString()}
                </div>
              </div>

              <div
                style={{
                  justifySelf: "end",
                  padding: "6px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  background:
                    c.status === "pending"
                      ? "rgba(250,204,21,0.15)"
                      : c.status === "approved"
                      ? "rgba(34,197,94,0.15)"
                      : "rgba(239,68,68,0.15)",
                  color:
                    c.status === "pending"
                      ? "#facc15"
                      : c.status === "approved"
                      ? "#22c55e"
                      : "#ef4444",
                }}
              >
                {c.status === "pending"
                  ? "Ожидает"
                  : c.status === "approved"
                  ? "Одобрен"
                  : "Отклонён"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* МОДАЛКА */}
      {selected && (
        <div
          onClick={() => {
            setSelected(null);
            setRejectReason("");
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 900,
              maxWidth: "95%",
              background: "#0b0b12",
              borderRadius: 20,
              padding: 24,
              display: "grid",
              gridTemplateColumns: "480px 1fr",
              gap: 24,
            }}
          >
          {selected.type === "video" && (
            <video
              src={selected.media_url}
              controls
              style={{ width: "100%", borderRadius: 14 }}
            />
          )}

          {selected.type === "banner" && (
            <img
              src={selected.media_url}
              alt="banner"
              style={{ width: "100%", borderRadius: 14 }}
            />
          )}

            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2 style={{ marginBottom: 14 }}>Заявка на рекламу</h2>

              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <b>Рекламодатель:</b> {selected.advertiser_email}
                </div>

                {selected.pricing_name && (
                  <div>
                    <b>Тариф:</b> {selected.pricing_name} ·{" "}
                    {selected.impressions?.toLocaleString()} показов
                  </div>
                )}

                {selected.price_usd !== undefined && (
                  <div style={{ fontSize: 26, fontWeight: 900 }}>
                    ${selected.price_usd}
                  </div>
                )}

                <div style={{ fontSize: 13, opacity: 0.6 }}>
                  Создано:{" "}
                  {new Date(selected.created_at).toLocaleString()}
                </div>
              </div>

              {selected.status === "pending" && (
                <>
                  <textarea
                    placeholder="Причина отклонения (обязательно)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    style={{
                      marginTop: 16,
                      minHeight: 70,
                      padding: 10,
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#fff",
                    }}
                  />

                  <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
                    <button
                      onClick={() => approve(selected.id)}
                      disabled={actionLoading}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: 12,
                        fontWeight: 800,
                        background: "rgba(34,197,94,0.18)",
                        color: "#22c55e",
                        border: "1px solid rgba(34,197,94,0.4)",
                      }}
                    >
                      Одобрить
                    </button>

                    <button
                      onClick={() => reject(selected.id)}
                      disabled={!rejectReason.trim() || actionLoading}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: 12,
                        fontWeight: 800,
                        background: "rgba(239,68,68,0.18)",
                        color: "#ef4444",
                        border: "1px solid rgba(239,68,68,0.4)",
                        opacity: !rejectReason.trim() ? 0.5 : 1,
                      }}
                    >
                      Отклонить
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
