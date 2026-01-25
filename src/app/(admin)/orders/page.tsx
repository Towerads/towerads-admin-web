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

  // 🔍 поиск
  const [query, setQuery] = useState("");
  // 🎯 фильтр статуса
  const [status, setStatus] = useState<OrderStatus | "">("");

  /* ---------- LOAD ORDERS ---------- */

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
      setError(e.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- AUTO SEARCH + FILTER (DEBOUNCE) ---------- */

  useEffect(() => {
    const t = setTimeout(() => {
      loadOrders();
    }, 300); // 👈 debounce

    return () => clearTimeout(t);
  }, [query, status]);

  /* ---------- ACTIONS ---------- */

  async function orderAction(
    id: string,
    action: "pause" | "resume" | "stop"
  ) {
    await api(`/admin/orders/${id}/${action}`, { method: "POST" });
    loadOrders();
  }

  /* ================= RENDER ================= */

  return (
    <div style={{ padding: 28 }}>
      <h1 style={title}>Orders</h1>
      <p style={subtitle}>Manage all creative orders</p>

      {/* 🔍 SEARCH + FILTER */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input
          placeholder="Search by title / id / email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={input}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          style={select}
        >
          <option value="">all</option>
          <option value="active">active</option>
          <option value="paused">paused</option>
          <option value="completed">completed</option>
        </select>
      </div>

      <div style={card}>
        {/* HEADER */}
        <div style={headerGrid}>
          <div>Order</div>
          <div>Advertiser</div>
          <div>Type</div>
          <div>Status</div>
          <div>Impressions</div>
          <div>Price</div>
          <div>Actions</div>
        </div>

        {/* SKELETON */}
        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}

        {/* ERROR */}
        {error && (
          <div style={{ padding: 16, color: "#ff6b6b" }}>{error}</div>
        )}

        {/* DATA */}
        {!loading &&
          !error &&
          orders.map((o) => (
            <div
              key={o.id}
              style={rowGrid}
              onClick={() => router.push(`/orders/${o.id}`)}
            >
              <div style={link}>
                {o.title || o.id.slice(0, 8) + "…"}
              </div>

              <div style={muted}>{o.advertiser_email}</div>
              <div style={pill}>{o.creative_type}</div>
              <StatusBadge status={o.status} />

              <div style={mono}>
                {o.impressions_done}/{o.impressions_total}
              </div>

              <div style={mono}>${o.price_usd}</div>

              <div onClick={(e) => e.stopPropagation()}>
                <Actions order={o} onAction={orderAction} />
              </div>
            </div>
          ))}

        {!loading && !error && orders.length === 0 && (
          <div style={{ padding: 16, opacity: 0.6 }}>No orders</div>
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
          Pause
        </button>
      )}

      {order.status === "paused" && (
        <button style={btn} onClick={() => onAction(order.id, "resume")}>
          Resume
        </button>
      )}

      {order.status !== "completed" && (
        <button
          style={{ ...btn, background: "#3b1c1c" }}
          onClick={() => onAction(order.id, "stop")}
        >
          Stop
        </button>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const map = {
    active: { bg: "rgba(46,204,113,.2)", color: "#7dffb6" },
    paused: { bg: "rgba(241,196,15,.2)", color: "#ffe58f" },
    completed: { bg: "rgba(149,165,166,.2)", color: "#ccc" },
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: map[status].bg,
        color: map[status].color,
      }}
    >
      {status}
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
  background: "#0f1220",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#fff",
  width: 140,
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
  gridTemplateColumns: "1fr 1.4fr .6fr .8fr .9fr .6fr 1fr",
  padding: "14px 16px",
  fontSize: 12,
  opacity: 0.6,
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const rowGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1.4fr .6fr .8fr .9fr .6fr 1fr",
  padding: "14px 16px",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  alignItems: "center",
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
const mono = { fontFamily: "monospace" };

const btn = {
  padding: "6px 10px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  cursor: "pointer",
  fontSize: 12,
};

const skeleton = {
  height: 14,
  borderRadius: 6,
  background:
    "linear-gradient(90deg, rgba(255,255,255,.05), rgba(255,255,255,.15), rgba(255,255,255,.05))",
};
