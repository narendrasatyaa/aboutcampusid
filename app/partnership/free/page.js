import SubpageShell from "../../components/SubpageShell";

const serviceSubnav = [
  { label: "Partnership", href: "/layanan/partnership", current: true },
  { label: "Research", href: "/layanan/research" },
  { label: "Store", href: "/layanan/store" },
];

export default function FreePartnershipPage() {
  return (
    <SubpageShell>
      <section className="order-section">
        <div className="wrap" style={{ maxWidth: 960 }}>
          <div className="sec-head" style={{ marginBottom: 24 }}>
            {/* <div className="sec-label">Free Partnership</div> */}
            <h1 className="sec-title">Publikasi gratis untuk event kampus</h1>
            {/* <p className="sec-sub">
              Syarat utama: 25 akun panitia follow akun admin dan like dikonfirmasi. Order tetap masuk ke dashboard admin utama.
            </p> */}
            {/* <div className="service-subnav service-subnav--info">
              {serviceSubnav.map((item) => (
                <a key={item.href} href={item.href} className={item.current ? "is-current" : ""}>
                  {item.label}
                </a>
              ))}
            </div> */}
          </div>

          <section style={{ background: "#ffffff", borderRadius: 24, border: "1px solid rgba(15,23,42,0.08)", padding: 24, display: "grid", gap: 14 }}>
            <h2 style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontSize: 24, margin: 0 }}>Yang harus dipenuhi</h2>
            <ul style={{ margin: 0, paddingLeft: 20, color: "#334155", lineHeight: 1.9 }}>
              <li> • Minimal 25 akun panitia follow akun admin utama.</li>
              <li> • Like post dikonfirmasi lewat checklist.</li>
              <li> • Data order dikirim lewat form website.</li>
              <li> • Admin menerima notif WhatsApp otomatis.</li>
            </ul>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="/order?plan=FREE" style={{ textDecoration: "none", background: "#23B5B5", color: "#0f172a", padding: "12px 18px", borderRadius: 999, fontWeight: 800 }}>Isi Form Order</a>
              <a href="/layanan/partnership" style={{ textDecoration: "none", background: "#0f172a", color: "#ffffff", padding: "12px 18px", borderRadius: 999, fontWeight: 700 }}>Kembali</a>
            </div>
          </section>
        </div>
      </section>
    </SubpageShell>
  );
}
