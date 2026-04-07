import SubpageShell from "../../components/SubpageShell";

const subnav = [
  { label: "Partnership", href: "/layanan/partnership" },
  { label: "Research", href: "/layanan/research", current: true },
  { label: "Store", href: "/layanan/store" },
];

export default function ResearchServicePage() {
  return (
    <SubpageShell>
      <section className="order-section">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 22 }}>
            {/* <div className="sec-label">Layanan</div> */}
            <h1 className="sec-title">Research & Consulting <em>Coming Soon</em></h1>
            <p className="sec-sub">
              Layanan riset dan konsultasi akademik sedang disiapkan. Nantinya akan tersedia untuk kebutuhan metodologi riset, olah data, dan review laporan.
            </p>
            <div className="service-subnav service-subnav--info">
              {subnav.map((item) => (
                <a key={item.href} href={item.href} className={item.current ? "is-current" : ""}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="coming-shell research-coming-shell">
            <div className="coming-top-grid">
              <article className="coming-note-card">
                <h3>Fungsi Layanan</h3>
                <p>
                  Membantu mahasiswa untuk konsultasi metodologi, pengolahan data, dan review laporan penelitian secara terarah.
                </p>
              </article>
              <article className="coming-note-card coming-note-card-action">
                <h3>Jangan Ketinggalan</h3>
                <p>Masuk daftar prioritas untuk update saat layanan resmi dibuka.</p>
                {/* <a href="/order" className="coming-note-cta" aria-label="Info layanan research">
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
