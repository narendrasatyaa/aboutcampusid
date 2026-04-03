"use client";

import { useState } from "react";

const initialForm = {
  customerName: "",
  phone: "",
  serviceType: "Media Officer Partnership",
  notes: "",
};

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Terjadi kesalahan saat kirim order.");
      } else {
        setMessage(
          `Order berhasil dibuat dengan nomor ${result.orderNumber}. Tim admin akan segera memproses.`
        );
        setForm(initialForm);
      }
    } catch {
      setMessage("Server tidak merespons. Coba lagi beberapa saat.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header id="header">
        <div className="bar">
          <div className="logo">
            <div className="logo-icon">
              <img src="/images/logo-bg.png" alt="About Campus ID Logo" />
            </div>
          </div>
          <nav id="nav" className={menuOpen ? "open" : ""}>
            <ul>
              <li>
                <a href="#layanan">Layanan</a>
              </li>
              <li>
                <a href="#order">Order</a>
              </li>
              <li>
                <a href="#kontak" className="nav-cta">
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </nav>
          <button
            type="button"
            className="menu-toggle"
            id="menuToggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`} />
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid" />
        </div>
        <div className="hero-inner">
          <div className="hero-content">
            <h1>
              Solusi Lengkap untuk <em>Dunia Kampus</em>
            </h1>
            <p className="hero-sub">
              About Campus ID hadir sebagai mitra terpercaya untuk mahasiswa,
              organisasi, dan institusi pendidikan dari media, mentorship,
              riset, hingga store.
            </p>
            <div className="hero-btns">
              <a href="#order" className="btn-primary">
                <i className="fas fa-cart-plus" /> Buat Order
              </a>
              <a href="/admin/orders" className="btn-ghost">
                <i className="fas fa-user-shield" /> Dashboard Admin
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-num">15.9rb</div>
                <div className="stat-label">Pengikut IG</div>
              </div>
              <div className="stat">
                <div className="stat-num">500+</div>
                <div className="stat-label">Event Dipublikasikan</div>
              </div>
              <div className="stat">
                <div className="stat-num">3+</div>
                <div className="stat-label">Lini Layanan Unggulan</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-stack">
              <div className="hcard hcard-main">
                <div className="hcard-label">FEATURED SERVICE</div>
                <div className="hcard-title">Media Officer Partnership</div>
                <div className="hcard-desc">
                  Publikasi event kampus ke 15.9rb+ audiens aktif.
                </div>
              </div>
              <div className="hcard-row">
                <div className="hcard hcard-sm">
                  <div className="icon ic-teal">
                    <i className="fas fa-chalkboard-teacher" />
                  </div>
                  <strong>Academy</strong>
                  <p>Mentorship & kelas intensif</p>
                </div>
                <div className="hcard hcard-sm">
                  <div className="icon ic-orange">
                    <i className="fas fa-flask" />
                  </div>
                  <strong>Research</strong>
                  <p>Riset & konsultasi akademik</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="layanan">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-label">Layanan Kami</div>
            <h2 className="sec-title">
              4 Pilar Utama <em>About Campus ID</em>
            </h2>
            <p className="sec-sub">
              Dari publikasi event hingga mentorship karir, kami siap mendukung
              perjalanan akademik dan profesionalmu.
            </p>
          </div>
          <div className="services-grid">
            <div className="srv-card">
              <div className="srv-num">01</div>
              <h3>Media Officer Partnership</h3>
              <p>Publikasi event kampus dan organisasi ke audiens mahasiswa.</p>
            </div>
            <div className="srv-card">
              <div className="srv-num">02</div>
              <h3>Academy & Mentorship</h3>
              <p>Program belajar dan bimbingan intensif untuk pengembangan karir.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="order" className="order-section">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-label">Order Online</div>
            <h2 className="sec-title">
              Pesan Layanan via <em>Website</em>
            </h2>
            <p className="sec-sub">
              Setiap order yang masuk akan otomatis masuk dashboard admin dan
              trigger notifikasi WhatsApp ke admin.
            </p>
          </div>

          <form className="order-form" onSubmit={handleSubmit}>
            <label>
              Nama Lengkap
              <input
                required
                type="text"
                value={form.customerName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, customerName: event.target.value }))
                }
              />
            </label>

            <label>
              Nomor WhatsApp
              <input
                required
                type="tel"
                placeholder="62812xxxx"
                value={form.phone}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
            </label>

            <label>
              Layanan
              <select
                value={form.serviceType}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, serviceType: event.target.value }))
                }
              >
                <option>Media Officer Partnership</option>
                <option>Academy & Mentorship</option>
                <option>Research & Consulting</option>
                <option>Official Store</option>
              </select>
            </label>

            <label>
              Catatan Tambahan
              <textarea
                rows={4}
                value={form.notes}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, notes: event.target.value }))
                }
              />
            </label>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Mengirim..." : "Kirim Order"}
            </button>
            {message && <p className="order-message">{message}</p>}
          </form>
        </div>
      </section>

      <footer id="kontak">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo" style={{ color: "white" }}>
                <div className="logo-icon">
                  <img src="/images/logo-bg.png" alt="About Campus ID Logo" />
                </div>
              </div>
              <p>
                Platform penyedia layanan edukasi, media, mentorship, riset, dan
                store untuk mahasiswa di seluruh Indonesia.
              </p>
            </div>
            <div>
              <h4>Hubungi Kami</h4>
              <ul className="footer-contact">
                <li>
                  <i className="fab fa-whatsapp" />
                  <a href="https://wa.me/6285226446178" target="_blank">
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="copyright">&copy; 2021-2026 About Campus ID.</div>
      </footer>

      <a
        className="floating-wa"
        href="https://wa.me/6285226446178?text=Halo%20Admin%20About%20Campus%20ID"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat WhatsApp"
      >
        <i className="fab fa-whatsapp" />
      </a>
    </>
  );
}
