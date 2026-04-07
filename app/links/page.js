import SubpageShell from "../components/SubpageShell";

const links = [
  {
    title: "Partnership Center",
    description: "Buka halaman khusus partnership, free, dan paid.",
    href: "/layanan/partnership",
    highlight: true,
  },
  {
    title: "Order Partnership",
    description: "Langsung ke halaman order khusus partnership.",
    href: "/order",
  },
  {
    title: "Admin Dashboard",
    description: "Masuk ke dashboard order untuk admin utama.",
    href: "/admin/orders",
  },
  {
    title: "WhatsApp Admin",
    description: "Chat cepat ke admin utama via WhatsApp.",
    href: "https://wa.me/6285226446178",
    external: true,
  },
  {
    title: "Instagram About Campus ID",
    description: "Lihat update dan publikasi terbaru di Instagram.",
    href: "https://instagram.com/aboutcampus_id",
    external: true,
  },
  {
    title: "Panduan Media Partner",
    description: "Baca panduan publikasi dan partnership.",
    href: "https://drive.google.com/file/d/1e0aiAnv6rpkgbUYmo4UCUOvoE4NCTDTZ/view",
    external: true,
  },
];

export default function LinksPage() {
  return (
    <SubpageShell>
      <div
      style={{
        background: "radial-gradient(circle at top, rgba(35,181,181,0.12), transparent 35%), linear-gradient(180deg, #ffffff 0%, #f6f8fc 100%)",
        padding: "20px 20px 56px",
      }}
    >
      <div
        style={{
          maxWidth: 920,
          margin: "0 auto",
          display: "grid",
          gap: 24,
        }}
      >
        <section
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(15,23,42,0.08)",
            borderRadius: 28,
            boxShadow: "0 24px 60px rgba(15,23,42,0.08)",
            padding: "28px",
            textAlign: "center",
          }}
        >
          <img
            src="/images/logo-bg.png"
            alt="About Campus ID"
            style={{ width: 78, height: 78, objectFit: "contain", marginBottom: 16 }}
          />
          <div style={{ letterSpacing: "0.18em", fontSize: 12, fontWeight: 800, color: "#0b6f6f", marginBottom: 10 }}>
            DIRECT LINKS
          </div>
          <h1 style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontSize: "clamp(2rem, 4vw, 3.4rem)", lineHeight: 1.05, color: "#0f172a", marginBottom: 12 }}>
            About Campus ID
          </h1>
          <p style={{ color: "#475569", lineHeight: 1.7, maxWidth: 640, margin: "0 auto" }}>
            Jalur cepat ke halaman utama, partnership, admin dashboard, dan kontak resmi.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gap: 14,
          }}
        >
          {links.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 18,
                alignItems: "center",
                padding: "18px 20px",
                borderRadius: 22,
                textDecoration: "none",
                background: item.highlight ? "linear-gradient(135deg, rgba(35,181,181,0.16), rgba(73,214,214,0.18))" : "#ffffff",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow: "0 14px 32px rgba(15,23,42,0.06)",
                color: "#0f172a",
              }}
            >
              <div>
                <div style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
                  {item.title}
                </div>
                <div style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
                  {item.description}
                </div>
              </div>
              <div style={{ fontSize: 20, color: item.highlight ? "#0b6f6f" : "#94a3b8", fontWeight: 700 }}>
                →
              </div>
            </a>
          ))}
        </section>
      </div>
      </div>
    </SubpageShell>
  );
}
