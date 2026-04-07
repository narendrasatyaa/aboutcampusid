import SubpageShell from "../../components/SubpageShell";

const subnav = [
  { label: "Partnership", href: "/layanan/partnership" },
  { label: "Research", href: "/layanan/research" },
  { label: "Store", href: "/layanan/store", current: true },
];

export default function StoreServicePage() {
  return (
    <SubpageShell>
      <section className="order-section">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 22 }}>
            {/* <div className="sec-label">Layanan</div> */}
            <h1 className="sec-title">Official Store <em>Coming Soon</em></h1>
            <p className="sec-sub">
              Official Store sedang dipersiapkan untuk kebutuhan merchandise, kit publikasi, dan produk digital pendukung event kampus.
            </p>
            <div className="service-subnav service-subnav--info">
              {subnav.map((item) => (
                <a key={item.href} href={item.href} className={item.current ? "is-current" : ""}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="coming-shell store-coming-shell">
            <div className="coming-top-grid">
              <article className="coming-note-card">
                <h3>Fungsi Layanan</h3>
                <p>
                  Menyediakan media kit, merchandise, dan produk digital untuk mendukung kebutuhan promosi serta branding event kampus.
                </p>
              </article>
              <article className="coming-note-card coming-note-card-action">
                <h3>Update Peluncuran</h3>
                <p>Ikuti update agar jadi yang pertama tahu saat official store dibuka.</p>
                {/* <a href="/layanan/partnership" className="coming-note-cta" aria-label="Kembali ke partnership">
                  <i className="fas fa-arrow-up-right-from-square" />
                </a> */}
              </article>
            </div>

            <div className="coming-word">Coming Soon</div>
          </div>
        </div>
      </section>
    </SubpageShell>
  );
}
