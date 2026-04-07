import SubpageShell from "../components/SubpageShell";

const subnav = [
  { label: "Partnership", href: "/layanan/partnership", current: true },
  { label: "Research", href: "/layanan/research" },
  { label: "Store", href: "/layanan/store" },
];

const cards = [
  {
    title: "FREE Partnership",
    description: "Untuk publikasi event kampus dengan syarat follow 25 akun panitia dan like checklist konfirmasi.",
    href: "/layanan/partnership/free",
    accent: "#23B5B5",
  },
  {
    title: "PAID Partnership",
    // description: "Untuk publikasi berbayar dengan QRIS statis dan proses order yang langsung masuk dashboard.",
    description: "Untuk publikasi berbayar, silakan lanjut mengisi formulir pemesanan dan selesaikan pembayaran untuk memulai kerja sama.",
    href: "/layanan/partnership/paid",
    accent: "#FA663E",
  },
];

export default function PartnershipPage() {
  return (
    <SubpageShell>
      <section className="order-section">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 28 }}>
            {/* <div className="sec-label">Layanan</div> */}
            <h1 className="sec-title">Partnership <em>Center</em></h1>
            <p className="sec-sub">
              Semua order tetap dikelola lewat website dan dashboard admin utama. Halaman ini memisahkan alur FREE dan PAID supaya lebih jelas buat panitia dan admin.
            </p>
            <div className="service-subnav service-subnav--info">
              {subnav.map((item) => (
                <a key={item.href} href={item.href} className={item.current ? "is-current" : ""}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 20, maxWidth: 900 }}>
            {cards.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="partnership-card"
                style={{
                  background: "#ffffff",
                  borderRadius: 20,
                  border: "1px solid rgba(15,23,42,0.08)",
                  boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
                  padding: 28,
                  textDecoration: "none",
                  color: "#0f172a",
                  display: "grid",
                  gap: 20,
                  transition: "all 0.3s ease",
                }}
              >
                {/* <div style={{ width: 52, height: 52, borderRadius: 14, background: `${item.accent}20`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 800, color: item.accent, fontSize: "1.4rem" }}>
                  {item.title.startsWith("FREE") ? "F" : "P"}
                </div> */}
                <div>
                  <div style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 8, color: "#0f172a" }}>
                    {item.title}
                  </div>
                  <p style={{ color: "#64748b", lineHeight: 1.7, margin: 0, fontSize: "0.95rem" }}>
                    {item.description}
                  </p>
                </div>
                <div style={{ fontWeight: 700, color: item.accent, fontSize: "0.92rem" }}>
                  Buka halaman →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </SubpageShell>
  );
}
