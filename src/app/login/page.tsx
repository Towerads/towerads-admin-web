"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async () => {
    setError("");

    try {
      // 🔐 логин
      const res = await api("/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // ✅ сохраняем JWT
      localStorage.setItem("admin_token", res.token);

      // 👉 в админку
      router.push("/");
    } catch (e: any) {
      setError(e.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">
      <div className="bg-[#111827] p-6 rounded-xl w-80 text-white shadow-lg">
        <h1 className="text-xl mb-4 font-semibold">Admin login</h1>

        {error && (
          <div className="mb-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <input
          className="w-full mb-3 p-2 rounded bg-gray-800 outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 rounded bg-gray-800 outline-none"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
