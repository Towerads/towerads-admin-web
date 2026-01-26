"use client";

import Sidebar from "@/components/admin/sidebar";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Stats = {
  revenue: number;
  impressions: number;
  requests: number;
  clicks: number;
};

type Provider = {
  provider: string;
  status: "active" | "paused";
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    api("/admin/stats").then(setStats);

    api("/admin/mediation").then((res) => {
      setProviders(res.providers || []);
    });
  }, []);

  const revenue = stats ? Number(stats.revenue) : 0;
  const impressions = stats ? Number(stats.impressions) : 0;

  const eCPM =
    impressions > 0 ? (revenue / impressions) * 1000 : 0;

  const profit = revenue * 0.8; // временно, пока не придёт с бэка

  return (
    <div className="admin">
      <Sidebar />

      <div className="content">
        <div className="page">
          <div className="page-inner">

            {/* ===== HEADER ===== */}
            <div className="page-header">
              <div>
                <h1 className="page-title">Панель управления</h1>
                <p className="page-subtitle">
                  Общий обзор показателей платформы
                </p>
              </div>
            </div>

            {/* ===== METRICS ===== */}
            {stats && (
              <section className="dashboard-top">
                <div className="metric-card">
                  <span>Доход</span>
                  <b>${revenue.toFixed(2)}</b>
                </div>

                <div className="metric-card">
                  <span>eCPM</span>
                  <b>${eCPM.toFixed(2)}</b>
                </div>

                <div className="metric-card">
                  <span>Показы</span>
                  <b>{stats.impressions}</b>
                </div>

                <div className="metric-card">
                  <span>Запросы</span>
                  <b>{stats.requests}</b>
                </div>

                <div className="metric-card profit">
                  <span>Прибыль</span>
                  <b>${profit.toFixed(2)}</b>
                </div>
              </section>
            )}

            {/* ===== SYSTEM STATUS ===== */}
            <section className="dashboard-block">
              <h3>Статус системы</h3>

              <div className="system-status">
                <div>
                  API: <b className="ok">Работает</b>
                </div>
                <div>
                  База данных: <b className="ok">Норма</b>
                </div>
                <div>
                  Ошибки (24ч): <b className="ok">0</b>
                </div>
              </div>
            </section>

            {/* ===== PROVIDERS ===== */}
            <section className="dashboard-block">
              <h3>Провайдеры</h3>

              <div className="mini-table">
                {providers.length === 0 && (
                  <div className="muted">Провайдеры не найдены</div>
                )}

                {providers.map((p) => (
                  <div key={p.provider}>
                    {p.provider}{" "}
                    {p.status === "active" ? (
                      <span className="ok">Активен</span>
                    ) : (
                      <span className="warn">Пауза</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ===== ALERTS ===== */}
            <section className="dashboard-block">
              <h3>Алерты</h3>

              <div className="alert ok">
                Система работает стабильно
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
