"use client";

import { useEffect, useState } from "react";

const statusOptions = ["NEW", "PROCESSING", "DONE", "CANCELED"];

export default function AdminOrdersPage() {
  const [adminKey, setAdminKey] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadOrders() {
    if (!adminKey) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/orders", {
        headers: {
          "x-admin-key": adminKey,
        },
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Gagal mengambil data order.");
        return;
      }

      setOrders(result.orders || []);
    } catch {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = window.localStorage.getItem("adminKey");
    if (saved) {
      setAdminKey(saved);
    }
  }, []);

  useEffect(() => {
    if (adminKey) {
      window.localStorage.setItem("adminKey", adminKey);
      loadOrders();
    }
  }, [adminKey]);

  async function updateStatus(orderId, status) {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ orderId, status }),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.error || "Gagal update status");
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: result.order.status } : order
        )
      );
    } catch {
      alert("Server error");
    }
  }

  return (
    <main className="admin-wrap">
      <h1>Dashboard Order Admin</h1>
      <p>Masukkan admin key untuk melihat dan memproses order.</p>

      <div className="admin-auth-row">
        <input
          type="password"
          value={adminKey}
          onChange={(event) => setAdminKey(event.target.value)}
          placeholder="ADMIN_DASHBOARD_KEY"
        />
        <button type="button" onClick={loadOrders}>
          Refresh
        </button>
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>No Order</th>
              <th>Nama</th>
              <th>WA</th>
              <th>Layanan</th>
              <th>Status</th>
              <th>Dibuat</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>{order.phone}</td>
                <td>{order.serviceType}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(event) => updateStatus(order.id, event.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleString("id-ID")}</td>
              </tr>
            ))}
            {!orders.length && !loading && (
              <tr>
                <td colSpan={6}>Belum ada data order.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
