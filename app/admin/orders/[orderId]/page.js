"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

function getPosterHref(fileName) {
  const value = String(fileName || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `/images/${encodeURIComponent(value)}`;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = useMemo(() => params?.orderId || "", [params]);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function loadDetail() {
    if (!orderId) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/admin/login");
          return;
        }
        setError(result.error || "Gagal mengambil detail order.");
        return;
      }

      setOrder(result.order);
    } catch {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function deleteOrder() {
    if (!orderId || !order) return;
    const ok = window.confirm(`Hapus order ${order.orderNumber}? Tindakan ini tidak bisa dibatalkan.`);
    if (!ok) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/admin/login");
          return;
        }
        setError(result.error || "Gagal menghapus order.");
        return;
      }

      router.replace("/admin/orders");
    } catch {
      setError("Server error saat menghapus order.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="admin-wrap">
      <h1>Detail Order</h1>
      <p>Halaman ini hanya untuk melihat detail lengkap order dan list akun IG panitia.</p>

      <div className="admin-auth-row">
        <button type="button" onClick={() => router.push("/admin/orders")}>Kembali ke List</button>
        <button type="button" onClick={loadDetail}>Refresh</button>
        <button type="button" className="admin-logout-btn" disabled={deleting} onClick={deleteOrder}>
          {deleting ? "Menghapus..." : "Hapus Order"}
        </button>
      </div>

      {loading && <p className="admin-hint">Loading detail order...</p>}
      {error && <p className="admin-error">{error}</p>}

      {order && (
        <>
          <div className="admin-summary-grid">
            <article className="admin-summary-card">
              <span>No Order</span>
              <strong style={{ fontSize: "1rem" }}>{order.orderNumber}</strong>
            </article>
            <article className="admin-summary-card">
              <span>Tipe</span>
              <strong>{order.orderType}</strong>
            </article>
            <article className="admin-summary-card">
              <span>Status</span>
              <strong>{order.status}</strong>
            </article>
            <article className="admin-summary-card">
              <span>Dibuat</span>
              <strong style={{ fontSize: "0.95rem" }}>{new Date(order.createdAt).toLocaleDateString("id-ID")}</strong>
            </article>
          </div>

          <section className="admin-detail-card">
            <h2>Data Utama</h2>
            <div className="admin-detail-grid">
              <div><strong>Nama:</strong> {order.customerName || "-"}</div>
              <div><strong>WA:</strong> {order.phone || "-"}</div>
              <div><strong>Layanan:</strong> {order.serviceType || "-"}</div>
              <div><strong>Tipe:</strong> {order.orderType || "-"}</div>
              <div><strong>Username IG:</strong> {order.instagramUsername || "-"}</div>
              <div><strong>Status:</strong> {order.status || "-"}</div>
              <div className="admin-detail-full"><strong>Detail Order:</strong> {order.orderDetails || "-"}</div>
              <div className="admin-detail-full"><strong>Catatan:</strong> {order.notes || "-"}</div>
              <div className="admin-detail-full"><strong>Nama File Bukti Bayar:</strong> {order.paymentProofFileName || "-"}</div>
            </div>
          </section>

          <section className="admin-detail-card">
            <h2>Checklist & Bukti</h2>
            <div className="admin-detail-grid">
              <div><strong>Follow Confirm:</strong> {order.followChecklistConfirmed ? "Ya" : "Belum"}</div>
              <div><strong>Like Confirm:</strong> {order.likeChecklistConfirmed ? "Ya" : "Belum"}</div>
              <div><strong>Jumlah Akun Follow:</strong> {order.followedAccounts?.length || 0}</div>
              <div><strong>Jumlah Poster:</strong> {order.posterFileNames?.length || 0}</div>
            </div>

            <h3 className="admin-subtitle">List Akun IG Panitia</h3>
            <div className="admin-chip-wrap">
              {(order.followedAccounts || []).length ? (
                order.followedAccounts.map((acc) => (
                  <span key={acc} className="admin-chip">{acc}</span>
                ))
              ) : (
                <span className="admin-empty">Belum ada data list IG panitia.</span>
              )}
            </div>

            <h3 className="admin-subtitle">Poster</h3>
            <div className="admin-file-list">
              {(order.posterFileNames || []).length ? (
                order.posterFileNames.map((fileName) => (
                  <div key={fileName} className="admin-file-item">
                    <span>{fileName}</span>
                    <a
                      href={getPosterHref(fileName)}
                      className="admin-mini-btn"
                      download
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download
                    </a>
                  </div>
                ))
              ) : (
                <p className="admin-empty">Belum ada data poster.</p>
              )}
            </div>
            <p className="admin-empty" style={{ marginTop: 8 }}>
              Jika file tidak ditemukan saat diunduh, berarti sistem saat ini baru menyimpan nama file poster, bukan berkas fisiknya.
            </p>
          </section>

          <section className="admin-detail-card">
            <h2>Riwayat Perubahan</h2>
            <div className="admin-log-list">
              {(order.logs || []).length ? (
                order.logs.map((log) => (
                  <div key={log.id} className="admin-log-item">
                    <strong>{log.action}</strong>
                    <span>{log.actor}</span>
                    <small>{new Date(log.createdAt).toLocaleString("id-ID")}</small>
                  </div>
                ))
              ) : (
                <p className="admin-empty">Belum ada riwayat log.</p>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
