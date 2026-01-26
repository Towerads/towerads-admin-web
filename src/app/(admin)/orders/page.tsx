"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

/* ================= TYPES ================= */

type OrderStatus = "active" | "paused" | "completed";

type Order = {
  id: string;
  title: string;
  status: OrderStatus;
  impressions_total: number;
  impressions_left: number;
  impressions_done: number;
  price_usd: string;
  creative_type: string;
  advertiser_email: string;
  created_at: string;
};

/* ================= PAGE ================= */

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");

  async function loadOrders(q = query, s = status) {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (s) params.set("status", s);

      const res = await api(`/admin/orders?${params.toString()}`);
      setOrders(res.items || []);
    } catch (e: any) {
      setError(e.message || "Ошибка загрузки заказов");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(loadOrders, 300);
    return () => clearTimeout(t);
  }, [query, status]);

  async function orderAction(
    id: string,
    action: "pause" | "resume" | "stop"
  ) {
    await api(`/admin/orders/${id}/${action}`, { method: "POST" });
    loadOrders();
  }

  return (
    <div style={{ padding: 28 }}>
      <h1 style={title}>Заказы</h1>
      <p style={subtitle}>Управление рекламными заказами</p>

      {/* ===== SEARCH + FILTER ===== */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input
          placeholder="Поиск по ID / email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={input}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          style={select}
        >
          <option value="">Все</option>
          <option value="active">Активные</option>
          <option value="paused">Пауза</option>
          <option value="completed">Завершённые</option>
        </select>
      </div>

      {/* ===== TABLE ===== */}
      <div style={card}>
        <div style={headerGrid}>
          <div>Заказ</div>
          <div>Рекламодатель</div>
          <div>Тип</div>
          <div>Статус</div>
          <div>Показы</div>
          <div>Цена</div>
          <div>Действия</div>
        </div>

        {loading &&
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

        {error && <div style={{ padding: 16, color: "#ff6b6b" }}>{error}</div>}

        {!loading &&
          !error &&
          orders.map((o) => (
            <div
              key={o.id}
              style={rowGrid}
              onClick={() => router.push(`/orders/${o.id}`)}
            >
              <div style={link}>{o.id.slice(0, 8)}…</div>
              <div style={muted}>{o.advertiser_email}</div>
              <div style={pill}>{o.creative_type}</div>
              <StatusBadge status={o.status} />
              <div style={mono}>
                {o.impressions_done}/{o.impressions_total}
              </div>
              <div style={mono}>
                ${Number(o.price_usd).toFixed(2)}
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <Actions order={o} onAction={orderAction} />
              </div>
            </div>
          ))}

        {!loading && !error && orders.length === 0 && (
          <div style={{ padding: 16, opacity: 0.6 }}>Заказов нет</div>
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Actions({
  order,
  onAction,
}: {
  order: Order;
  onAction: (id: string, action: "pause" | "resume" | "stop") => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {order.status === "active" && (
        <button style={btn} onClick={() => onAction(order.id, "pause")}>
          Пауза
        </button>
      )}

      {order.status === "paused" && (
        <button style={btn} onClick={() => onAction(order.id, "resume")}>
          Продолжить
        </button>
      )}

      {order.status !== "completed" && (
        <button
          style={{
            ...btn,
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#fecaca",
          }}
          onClick={() => onAction(order.id, "stop")}
        >
          Остановить
        </button>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const map = {
    active: {
      label: "Активен",
      bg: "rgba(34,197,94,0.15)",
      color: "#86efac",
    },
    paused: {
      label: "Пауза",
      bg: "rgba(234,179,8,0.15)",
      color: "#fde68a",
    },
    completed: {
      label: "Завершён",
      bg: "rgba(148,163,184,0.15)",
      color: "#cbd5f5",
    },
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: map[status].bg,
        color: map[status].color,
        whiteSpace: "nowrap",
      }}
    >
      {map[status].label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div style={rowGrid}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={skeleton} />
      ))}
    </div>
  );
}

/* ================= STYLES ================= */

const title = { fontSize: 40, fontWeight: 900 };
const subtitle = { opacity: 0.7, marginBottom: 20 };

const input = {
  flex: 1,
  padding: "10px 14px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
};

const select: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 12,
  background: "rgba(15,18,32,0.95)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
  width: 160,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  cursor: "pointer",
};

const card = {
  borderRadius: 18,
  background: "rgba(0,0,0,0.25)",
  border: "1px solid rgba(255,255,255,0.08)",
  overflow: "hidden",
};

const headerGrid = {
  display: "grid",
  gridTemplateColumns: "140px 240px 80px 110px 110px 90px 160px",
  padding: "14px 16px",
  fontSize: 12,
  opacity: 0.6,
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const rowGrid = {
  display: "grid",
  gridTemplateColumns: "140px 240px 80px 110px 110px 90px 160px",
  padding: "14px 16px",
  alignItems: "center",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  cursor: "pointer",
};

const link = { fontWeight: 700 };
const muted = { opacity: 0.75, fontSize: 13 };
const pill = {
  padding: "4px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.08)",
  fontSize: 12,
};
const mono = { fontFamily: "monospace", fontSize: 13 };

const btn = {
  padding: "6px 12px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  cursor: "pointer",
  fontSize: 12,
  color: "#e5e7eb",
};

const skeleton = {
  height: 14,
  borderRadius: 6,
  background:
    "linear-gradient(90deg, rgba(255,255,255,.05), rgba(255,255,255,.15), rgba(255,255,255,.05))",
};
