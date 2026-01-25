"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await api("/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("admin_token", res.token);
      router.push("/");
    } catch (e: any) {
      setError(e.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔥 ПЕРЕКРЫВАЕМ АДМИН LAYOUT */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background:
            "radial-gradient(1200px 600px at 50% 20%, #111827, #020617)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 380,
            padding: "32px 28px",
            borderRadius: 18,
            background: "rgba(15,23,42,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 120px rgba(0,0,0,.6)",
            color: "#fff",
          }}
        >
          {/* ===== HEADER ===== */}
          <div style={{ marginBottom: 24 }}>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: -0.5,
              }}
            >
              USL ADMIN
            </h1>
            <p style={{ opacity: 0.7, marginTop: 6 }}>
              Sign in to admin panel
            </p>
          </div>

          {/* ===== ERROR ===== */}
          {error && (
            <div
              style={{
                marginBottom: 14,
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(239,68,68,.15)",
                color: "#fca5a5",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          {/* ===== FORM ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />

            <button
              onClick={submit}
              disabled={loading}
              style={{
                marginTop: 10,
                height: 44,
                borderRadius: 12,
                background: loading
                  ? "rgba(59,130,246,.4)"
                  : "linear-gradient(135deg,#3b82f6,#6366f1)",
                fontWeight: 700,
                border: "none",
                cursor: loading ? "default" : "pointer",
              }}
            >
              {loading ? "Signing in…" : "Login"}
            </button>
          </div>

          {/* ===== FOOTER ===== */}
          <div
            style={{
              marginTop: 22,
              fontSize: 12,
              opacity: 0.5,
              textAlign: "center",
            }}
          >
            © USL • Admin access only
          </div>
        </div>
      </div>

      {/* ===== LOCAL INPUT STYLES ===== */}
      <style jsx>{`
        .login-input {
          height: 42px;
          border-radius: 10px;
          padding: 0 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: white;
          outline: none;
        }

        .login-input:focus {
          border-color: #3b82f6;
          background: rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </>
  );
}
