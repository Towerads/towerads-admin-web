"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Order = {
  id: string;
  status: string;
  impressions_total: number;
  impressions_left: number;
  impressions_done: number;
  price_usd: string;
  advertiser_email: string;
  creative_type: string;
  media_url: string;
  click_url: string;
};

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api(`/admin/orders/${id}`);
      setOrder(res.order);
    } finally {
      setLoading(false);
    }
  }

  async function action(type: "pause" | "resume" | "stop") {
    await api(`/admin/orders/${id}/${type}`, { method: "POST" });
    load();
  }

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <div className="page">Загрузка…</div>;
  if (!order) return <div className="page">Заказ не найден</div>;

  const progress =
    ((order.impressions_done / order.impressions_total) * 100).toFixed(1);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Заказ</h1>
        <button onClick={() => router.back()}>← Назад</button>
      </div>

      <div className="card">
        <div className="order-meta">
          <div><b>ID:</b> {order.id}</div>
          <div><b>Рекламодатель:</b> {order.advertiser_email}</div>
          <div><b>Статус:</b> {order.status}</div>
          <div><b>Тип:</b> {order.creative_type}</div>
          <div><b>Цена:</b> ${Number(order.price_usd).toFixed(2)}</div>
        </div>

        <div className="order-progress">
          <div>
            {order.impressions_done} / {order.impressions_total} показов
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="order-video">
          <video
            src={order.media_url}
            controls
            style={{ maxWidth: 400, borderRadius: 12 }}
          />
        </div>

        <div className="order-actions">
          {order.status === "active" && (
            <button onClick={() => action("pause")}>Пауза</button>
          )}
          {order.status === "paused" && (
            <button onClick={() => action("resume")}>Продолжить</button>
          )}
          {order.status !== "completed" && (
            <button className="danger" onClick={() => action("stop")}>
              Остановить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
