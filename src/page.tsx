"use client";

import Sidebar from "@/components/admin/sidebar";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api("/admin/stats").then(setStats);
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <h2 style={{ marginBottom: 20 }}>Панель управлен</h2>

        {/* ===== TOP METRICS ===== */}
        {stats && (
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <div className="card-label">Доход сегодня</div>
              <div className="card-value">
                ${Number(stats.revenue).toFixed(2)}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-label">Запросы</div>
              <div className="card-value">{stats.requests}</div>
            </div>

            <div className="dashboard-card">
              <div className="card-label">Показы</div>
              <div className="card-value">{stats.impressions}</div>
            </div>

            <div className="dashboard-card">
              <div className="card-label">Клики</div>
              <div className="card-value">{stats.clicks}</div>
            </div>
          </div>
        )}

        {/* ===== SYSTEM STATUS ===== */}
        <div className="dashboard-section">
          <h3 className="section-title">Состояние системы</h3>

          <div className="system-grid">
            <div className="system-item ok">
              <span>API</span>
              <b>Работает</b>
            </div>

            <div className="system-item ok">
              <span>База данных</span>
              <b>Норма</b>
            </div>

            <div className="system-item ok">
              <span>Последний показ</span>
              <b>меньше 1 мин</b>
            </div>

            <div className="system-item ok">
              <span>Ошибки (24ч)</span>
              <b>0</b>
            </div>
          </div>
        </div>

        {/* ===== PROVIDERS PREVIEW ===== */}
        <div className="dashboard-section">
          <h3 className="section-title">Провайдеры (кратко)</h3>

          <div className="providers-preview">
            <div className="providers-row">
              <span>Adexium</span>
              <span className="status active">Активен</span>
              <span>40%</span>
              <span>$3.12</span>
            </div>

            <div className="providers-row">
              <span>USL</span>
              <span className="status paused">Пауза</span>
              <span>0%</span>
              <span>—</span>
            </div>
          </div>
        </div>

        {/* ===== ALERTS ===== */}
        <div className="dashboard-section">
          <h3 className="section-title">Уведомления</h3>

          <div className="alerts ok">
            Система работает стабильно
          </div>
        </div>
      </div>
    </div>
  );
}
