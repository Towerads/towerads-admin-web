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

  publisher_id?: string | number | null;
  publisher_name?: string | null; // из таблицы publishers.name
};

type Filter = "all" | "pending" | "approved" | "rejected" | "draft";

function fmtDate(v: string | null | undefined) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString();
}

function pillStyle(status: string) {
  const s = String(status || "").toLowerCase();
  if (s === "approved")
    return { bg: "rgba(34,197,94,.15)", color: "#16a34a", label: "APPROVED" };
  if (s === "pending")
    return { bg: "rgba(245,158,11,.15)", color: "#d97706", label: "PENDING" };
  if (s === "rejected")
    return { bg: "rgba(239,68,68,.15)", color: "#dc2626", label: "REJECTED" };
  if (s === "draft")
    return { bg: "rgba(148,163,184,.15)", color: "#94a3b8", label: "DRAFT" };
  return { bg: "rgba(148,163,184,.15)", color: "#cbd5e1", label: "UNKNOWN" };
}

function StatusPill({ v }: { v: string | null | undefined }) {
  const p = pillStyle(String(v || ""));
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        background: p.bg,
        color: p.color,
        fontSize: 12,
        fontWeight: 800,
        display: "inline-block",
        letterSpacing: 0.4,
      }}
    >
      {p.label}
    </span>
  );
}

async function copy(text: string) {
  if (!text) return;
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

function Btn({
  children,
  onClick,
  disabled,
  tone = "default",
}: {
  children: any;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "default" | "primary" | "danger";
}) {
  const base: any = {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(148,163,184,.25)",
    background: "rgba(2,6,23,.35)",
    color: "white",
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    whiteSpace: "nowrap",
  };

  if (tone === "primary") {
    base.border = "1px solid rgba(34,197,94,.45)";
    base.background = "rgba(34,197,94,.12)";
  }
  if (tone === "danger") {
    base.border = "1px solid rgba(239,68,68,.45)";
    base.background = "rgba(239,68,68,.12)";
  }

  return (
    <button onClick={disabled ? undefined : onClick} style={base}>
      {children}
    </button>
  );
}

function Drawer({
  open,
  onClose,
  row,
  onApprove,
  onReject,
}: {
  open: boolean;
  onClose: () => void;
  row: Row | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}) {
  if (!open || !row) return null;

  const canModerate =
    String(row.moderation_status || "").toLowerCase() === "pending";

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.55)",
          zIndex: 50,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(520px, 92vw)",
          background: "rgba(2,6,23,.98)",
          borderLeft: "1px solid rgba(148,163,184,.22)",
          zIndex: 60,
          padding: 18,
          overflow: "auto",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Детали доски</div>
          <div style={{ marginLeft: "auto" }}>
            <Btn onClick={onClose}>Закрыть</Btn>
          </div>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <StatusPill v={row.moderation_status} />
          <span style={{ opacity: 0.75, fontSize: 12 }}>
            Created: {fmtDate(row.created_at)}
          </span>
          <span style={{ opacity: 0.75, fontSize: 12 }}>
            Approved: {fmtDate(row.approved_at)}
          </span>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 900 }}>
            {row.name || "(без названия)"}
          </div>
          <div style={{ opacity: 0.7, marginTop: 4, fontSize: 12 }}>
            Placement ID: <span style={{ fontFamily: "monospace" }}>{row.id}</span>
          </div>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <div
            style={{
              border: "1px solid rgba(148,163,184,.18)",
              borderRadius: 14,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Publisher</div>
            <div style={{ opacity: 0.9 }}>
              {row.publisher_name || "—"}{" "}
              <span style={{ opacity: 0.7, fontSize: 12 }}>
                (id: {row.publisher_id ?? "—"})
              </span>
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(148,163,184,.18)",
              borderRadius: 14,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Domain / URL</div>
            <div style={{ wordBreak: "break-all", opacity: 0.95 }}>
              {row.domain || "—"}
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <Btn onClick={() => copy(row.domain || "")} disabled={!row.domain}>
                Copy domain
              </Btn>
              <Btn onClick={() => copy(row.id)} disabled={!row.id}>
                Copy id
              </Btn>
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(148,163,184,.18)",
              borderRadius: 14,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Public key</div>
            <div style={{ fontFamily: "monospace", fontSize: 12, opacity: 0.95 }}>
              {row.public_key || "—"}
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <Btn onClick={() => copy(row.public_key || "")} disabled={!row.public_key}>
                Copy public_key
              </Btn>
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(148,163,184,.18)",
              borderRadius: 14,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Type / Status</div>
            <div style={{ display: "grid", gap: 6, fontSize: 13, opacity: 0.95 }}>
              <div>
                <b>ad_type:</b> {row.ad_type || "—"}
              </div>
              <div>
                <b>placement.status:</b> {row.status || "—"}
              </div>
              <div>
                <b>moderation_status:</b> {row.moderation_status || "—"}
              </div>
              {row.rejected_reason ? (
                <div style={{ color: "#fca5a5" }}>
                  <b>rejected_reason:</b> {row.rejected_reason}
                </div>
              ) : null}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Btn
              tone="primary"
              disabled={!canModerate}
              onClick={() => onApprove(row.id)}
            >
              ✅ Одобрить
            </Btn>
            <Btn
              tone="danger"
              disabled={!canModerate}
              onClick={() => onReject(row.id)}
            >
              ⛔ Отклонить
            </Btn>
          </div>

          {!canModerate ? (
            <div style={{ opacity: 0.7, fontSize: 12 }}>
              Одобрить/отклонить можно только когда статус <b>PENDING</b>.
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default function PublisherPlacementsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const [selected, setSelected] = useState<Row | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const f = filter;

    return rows.filter((r) => {
      const st = String(r.moderation_status || "").toLowerCase();
      if (f !== "all" && st !== f) return false;

      if (!s) return true;
      const hay = [
        r.id,
        r.name,
        r.domain,
        r.ad_type,
        r.status,
        r.moderation_status,
        r.public_key,
        String(r.publisher_id ?? ""),
        r.publisher_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(s);
    });
  }, [rows, q, filter]);

  const load = async () => {
    setLoading(true);
    try {
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

  const approve = async (id: string) => {
    if (!confirm("Одобрить доску? После этого у паблишера появится SDK скрипт.")) return;
    await fetch(`${API_BASE}/admin/placements/${encodeURIComponent(id)}/approve`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    await load();
  };

  const reject = async (id: string) => {
    const reason = prompt("Причина отклонения?");
    if (!reason) return;

    await fetch(`${API_BASE}/admin/placements/${encodeURIComponent(id)}/reject`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    await load();
  };

  useEffect(() => {
    load();
  }, []);

  const gridCols = "1.2fr .9fr 1.2fr .8fr .9fr 1.2fr .9fr";

  return (
    <div style={{ padding: 24 }}>
      <Drawer
        open={drawerOpen}
        row={selected}
        onClose={() => setDrawerOpen(false)}
        onApprove={approve}
        onReject={reject}
      />

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>
          Доски паблишеров (SDK)
        </h1>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(148,163,184,.25)",
              background: "rgba(2,6,23,.35)",
              color: "white",
              fontWeight: 800,
            }}
          >
            <option value="all">Все</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="draft">Draft</option>
          </select>

          <Btn onClick={load} disabled={loading}>
            {loading ? "Загрузка..." : "Обновить"}
          </Btn>
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск: id / name / domain / public_key / publisher..."
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(148,163,184,.25)",
            outline: "none",
            background: "rgba(2,6,23,.25)",
            color: "white",
          }}
        />
        <div style={{ opacity: 0.75, fontWeight: 800, paddingTop: 10 }}>
          {filtered.length} / {rows.length}
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          border: "1px solid rgba(148,163,184,.22)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridCols,
            padding: "12px 14px",
            background: "rgba(15,23,42,.45)",
            fontWeight: 900,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          <div>Placement</div>
          <div>Publisher</div>
          <div>Domain</div>
          <div>Type</div>
          <div>Moderation</div>
          <div>Public key</div>
          <div>Actions</div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: 14, opacity: 0.8 }}>
            {loading ? "Загрузка..." : "Нет данных"}
          </div>
        ) : (
          filtered.map((r) => {
            const st = String(r.moderation_status || "").toLowerCase();
            const canModerate = st === "pending";

            return (
              <div
                key={r.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: gridCols,
                  padding: "12px 14px",
                  borderTop: "1px solid rgba(148,163,184,.16)",
                  alignItems: "center",
                  fontSize: 13,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelected(r);
                  setDrawerOpen(true);
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontWeight: 900 }}>{r.name || "(без названия)"}</div>
                  <div style={{ opacity: 0.75, fontSize: 12, fontFamily: "monospace" }}>
                    {r.id}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontWeight: 800 }}>{r.publisher_name || "—"}</div>
                  <div style={{ opacity: 0.7, fontSize: 12 }}>
                    {r.publisher_id ?? "—"}
                  </div>
                </div>

                <div style={{ wordBreak: "break-all", opacity: 0.95 }}>
                  {r.domain || "—"}
                </div>

                <div style={{ fontWeight: 800 }}>{r.ad_type || "—"}</div>

                <div>
                  <StatusPill v={r.moderation_status} />
                </div>

                <div style={{ fontFamily: "monospace", fontSize: 12 }}>
                  {r.public_key || "—"}
                </div>

                <div
                  style={{ display: "flex", gap: 8 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Btn
                    tone="primary"
                    disabled={!canModerate}
                    onClick={() => approve(r.id)}
                  >
                    Одобрить
                  </Btn>
                  <Btn
                    tone="danger"
                    disabled={!canModerate}
                    onClick={() => reject(r.id)}
                  >
                    Отклонить
                  </Btn>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: 10, opacity: 0.7, fontSize: 12 }}>
        Клик по строке → деталка справа. Одобрение/отклонение доступно только для{" "}
        <b>PENDING</b>.
      </div>
    </div>
  );
}
