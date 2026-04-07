"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Login gagal");
        return;
      }

      router.push("/admin/orders");
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-wrap">
      <div className="admin-login-card">
        <h1>Login Admin</h1>
        <p>Masukkan dashboard key untuk akses dashboard order.</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <label>
            Dashboard Key
            <input
              type="password"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              placeholder="ADMIN_DASHBOARD_KEY"
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Masuk Dashboard"}
          </button>
        </form>

        {error && <p className="admin-error">{error}</p>}
      </div>
    </main>
  );
}
