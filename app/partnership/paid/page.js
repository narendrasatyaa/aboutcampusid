import SubpageShell from "../../components/SubpageShell";

export default function PaidPartnershipPage() {
  return (
    <SubpageShell>
      <section className="order-section">
        <div className="wrap" style={{ maxWidth: 960 }}>
          <div className="sec-head" style={{ marginBottom: 24 }}>
            {/* <div className="sec-label">Paid Partnership</div> */}
            <h1 className="sec-title">Order berbayar dengan QRIS statis</h1>
            {/* <p className="sec-sub">
              Pilih paket paid untuk publikasi yang lebih cepat diproses. Setelah payment, order masuk ke dashboard admin utama.
            </p> */}
          </div>

          <section className="partnership-detail-card paid-detail-card">
            <p className="paid-qris-text">Jika semua sudah siap, silakan lanjut mengisi formulir pemesanan dan selesaikan pembayaran untuk memulai kerja sama.</p>
            <div className="partnership-action-row center">
              <a href="/order?plan=PAID" className="partnership-pill-btn is-orange">Isi Form Order</a>
              <a href="/layanan/partnership" className="partnership-pill-btn is-dark">Kembali</a>
            </div>
          </section>
        </div>
      </section>
    </SubpageShell>
  );
}
