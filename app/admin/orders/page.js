"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const statusOptions = ["NEW", "PROCESSING", "DONE", "CANCELED"];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  async function loadOrders() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/orders");
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/admin/login");
          return;
        }
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
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(orderId, status) {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status }),
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/admin/login");
          return;
        }
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

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    const q = query.trim().toLowerCase();
    if (!q) return matchesStatus;

    const matchesQuery = [
      order.orderNumber,
      order.customerName,
      order.phone,
      order.serviceType,
      order.instagramUsername,
    ]
      .filter(Boolean)
      .some((item) => String(item).toLowerCase().includes(q));

    return matchesStatus && matchesQuery;
  });

  const summary = {
    total: orders.length,
    new: orders.filter((order) => order.status === "NEW").length,
    processing: orders.filter((order) => order.status === "PROCESSING").length,
    done: orders.filter((order) => order.status === "DONE").length,
  };

  return (
    <main className="admin-wrap">
      <h1>Dashboard Order Admin</h1>
      <p>Kelola order, update status, dan pantau progress order masuk.</p>

      <div className="admin-auth-row">
        <button type="button" onClick={loadOrders}>
          Refresh
        </button>
        <button type="button" className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-summary-grid">
        <article className="admin-summary-card">
          <span>Total</span>
          <strong>{summary.total}</strong>
        </article>
        <article className="admin-summary-card">
          <span>NEW</span>
          <strong>{summary.new}</strong>
        </article>
        <article className="admin-summary-card">
          <span>PROCESSING</span>
          <strong>{summary.processing}</strong>
        </article>
        <article className="admin-summary-card">
          <span>DONE</span>
          <strong>{summary.done}</strong>
        </article>
      </div>

      <div className="admin-filter-row">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari: nomor order, nama, WA, layanan, IG"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="ALL">Semua Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="admin-hint">Loading orders...</p>}
      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>No Order</th>
              <th>Nama</th>
              <th>WA</th>
              <th>Layanan</th>
              <th>Tipe</th>
              <th>IG User</th>
              <th>Follow</th>
              <th>Like Confirm</th>
              <th>Status</th>
              <th>Dibuat</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>{order.phone}</td>
                <td>{order.serviceType}</td>
                <td>{order.orderType}</td>
                <td>{order.instagramUsername || "-"}</td>
                <td>{order.followedAccounts?.length || 0}</td>
                <td>{order.likeChecklistConfirmed ? "Ya" : "Belum"}</td>
                <td>
                  <div className="admin-status-cell">
                    <span className={`admin-status-badge admin-status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
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
                  </div>
                </td>
                <td>{new Date(order.createdAt).toLocaleString("id-ID")}</td>
              </tr>
            ))}
            {!filteredOrders.length && !loading && (
              <tr>
                <td colSpan={10}>Belum ada data order.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
