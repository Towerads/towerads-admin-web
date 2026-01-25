"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type CreativeStatus = "pending" | "approved" | "rejected" | "frozen";

type Creative = {
  id: string;
  type: string;
  media_url: string;
  status: CreativeStatus;
  advertiser_email: string;
  created_at: string;
};

export default function CreativePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [creative, setCreative] = useState<Creative | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadCreative();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadCreative() {
    try {
      setLoading(true);

      const statuses: CreativeStatus[] = [
        "pending",
        "approved",
        "rejected",
        "frozen",
      ];

      for (const status of statuses) {
        const res = await api(`/admin/creatives?status=${status}`);
        const found = res.creatives?.find(
          (c: Creative) => c.id === id
        );
        if (found) {
          setCreative(found);
          return;
        }
      }

      router.replace("/creatives");
    } catch (e) {
      console.error("Load creative error:", e);
      router.replace("/creatives");
    } finally {
      setLoading(false);
    }
  }

  async function approveCreative() {
    if (!creative) return;
    setActionLoading(true);

    await api("/admin/creatives/approve", {
      method: "POST",
      body: JSON.stringify({ creative_id: creative.id }),
    });

    router.push("/creatives");
  }

  async function rejectCreative() {
    if (!creative) return;

    const reason = prompt("Reject reason:");
    if (!reason?.trim()) return;

    setActionLoading(true);

    await api("/admin/creatives/reject", {
      method: "POST",
      body: JSON.stringify({
        creative_id: creative.id,
        reason: reason.trim(),
      }),
    });

    router.push("/creatives");
  }

  const statusUi = useMemo(() => {
    if (!creative) return null;

    switch (creative.status) {
      case "pending":
        return { label: "Awaiting moderation", color: "#facc15" };
      case "approved":
        return { label: "Approved", color: "#22c55e" };
      case "rejected":
        return { label: "Rejected", color: "#ef4444" };
      default:
        return { label: creative.status, color: "#93c5fd" };
    }
  }, [creative]);

  if (loading) return <div className="page">Loading…</div>;
  if (!creative || !statusUi) return null;

  return (
    <div className="page">
      <h1 style={{ marginBottom: 24 }}>Creative review</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "520px 1fr",
          gap: 28,
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.35)",
            borderRadius: 14,
            padding: 14,
          }}
        >
          <video
            src={creative.media_url}
            controls
            style={{ width: "100%", borderRadius: 10 }}
          />
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: 14,
            padding: 22,
          }}
        >
          <p>
            <b>Status:</b>{" "}
            <span style={{ color: statusUi.color, fontWeight: 700 }}>
              {statusUi.label}
            </span>
          </p>

          <p>
            <b>Advertiser:</b> {creative.advertiser_email}
          </p>
          <p>
            <b>Type:</b> {creative.type}
          </p>
          <p>
            <b>Created:</b>{" "}
            {new Date(creative.created_at).toLocaleString()}
          </p>

          {creative.status === "pending" && (
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button
                onClick={approveCreative}
                disabled={actionLoading}
                style={{ background: "#22c55e", padding: "10px 16px" }}
              >
                Approve
              </button>

              <button
                onClick={rejectCreative}
                disabled={actionLoading}
                style={{ background: "#ef4444", padding: "10px 16px" }}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
