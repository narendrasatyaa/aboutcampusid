"use client";

import { useEffect, useState } from "react";
import AiAssistantLauncher from "./components/AiAssistantLauncher";
import SubpageShell from "./components/SubpageShell";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);


  const advantageItems = [
    {
      title: "Tepat Waktu & Fleksibel",
      description: "Layanan disesuaikan dengan jadwal dan kebutuhanmu, tanpa ribet dan prosedur berbelit.",
      icon: "fa-clock",
    },
    {
      title: "Efektif & Tepat Sasaran",
      description: "Konten dan layanan dirancang khusus untuk menyasar kebutuhan nyata mahasiswa dan institusi.",
      icon: "fa-bullseye",
    },
    {
      title: "Jangkauan Luas",
      description: "Dapat diakses dari mana saja dan menjangkau seluruh kampus di Indonesia melalui jaringan kami.",
      icon: "fa-earth-asia",
    },
    {
      title: "Komunitas Aktif",
      description: "Terhubung dengan ribuan mahasiswa aktif dari ratusan kampus di seluruh Indonesia.",
      icon: "fa-users",
    },
    {
      title: "Terpercaya & Berpengalaman",
      description: "Telah membantu ratusan event dan program kampus sejak 2021 dengan track record yang terbukti.",
      icon: "fa-medal",
    },
    {
      title: "Support Responsif",
      description: "Tim kami siap membantu dan merespons setiap pertanyaan dengan cepat melalui WhatsApp.",
      icon: "fa-headset",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (event.target.closest("#header")) {
        return;
      }

      setOpenSubmenu(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <>
      <SubpageShell>
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
                Website ini berfungsi sebagai pusat informasi layanan About Campus ID. Untuk publikasi partnership, order dipusatkan ke halaman khusus agar proses terasa lebih fokus dan intim.
              </p>
              <div className="hero-btns">
                <a href="/partnership/paid" className="btn-primary">
                  <i className="fas fa-paper-plane" /> Mulai Order Partnership
                </a>
                {/* <a href="https://wa.me/6285226446178" className="btn-ghost" target="_blank" rel="noreferrer">
                <i className="fab fa-whatsapp" /> Chat WhatsApp
              </a> */}
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-num">100K++</div>
                  <div className="stat-label">Engagement</div>
                </div>
                <div className="stat">
                  <div className="stat-num">500++</div>
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
                  <div className="hcard-title">Media Officer Partnership</div>
                  <div className="hcard-desc">Publikasi event kampus ke 100K++ Engagement. Jangkauan luas, hasil nyata.</div>
                </div>
                <div className="hcard-row">
                  <div className="hcard hcard-sm">
                    <div className="icon ic-teal"><i className="fas fa-chalkboard-teacher"></i></div>
                    <strong>Academy</strong>
                    <p>Mentorship & kelas intensif</p>
                  </div>
                  <div className="hcard hcard-sm">
                    <div className="icon ic-orange"><i className="fas fa-flask"></i></div>
                    <strong>Research</strong>
                    <p>Riset & konsultasi akademik</p>
                  </div>
                  <div className="hcard hcard-sm">
                    <div className="icon ic-blue"><i className="fas fa-store"></i></div>
                    <strong>Store</strong>
                    <p>Produk & merchandise</p>
                  </div>
                  <div className="hcard hcard-sm">
                    <div className="icon ic-purple"><i className="fas fa-handshake"></i></div>
                    <strong>Partner</strong>
                    <p>Gratis & berbayar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="layanan">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="sec-title">Layanan Informasi & <em>Publikasi</em></h2>
              <p className="sec-sub">
                Partnership adalah layanan aktif utama untuk publikasi Instagram @aboutcampus_id. Layanan lain tetap ditampilkan sebagai informasi website.
              </p>
            </div>
            <div className="services-grid">
              <div className="srv-card">
                <div className="srv-num">01</div>
                <h3>Media Officer Partnership</h3>
                <p>Layanan utama untuk publikasi event kampus ke Instagram @aboutcampus_id. Bisa pilih paket FREE atau PAID lewat halaman order khusus.</p>
                <div className="srv-tags">
                  <span className="tag">Event Kampus</span>
                  <span className="tag">Lomba Nasional</span>
                  <span className="tag">Webinar</span>
                  <span className="tag">FREE / PAID</span>
                </div>
              </div>
              <div className="srv-card">
                <div className="srv-num">02</div>
                <h3>Research & Consulting</h3>
                <p>Masih coming soon. Akan dibuka untuk layanan riset akademik dan konsultasi data.</p>
                <div className="srv-tags">
                  <span className="tag">Coming Soon</span>
                  <span className="tag">Research</span>
                  <span className="tag">Consulting</span>
                </div>
              </div>
              <div className="srv-card">
                <div className="srv-num">03</div>
                <h3>Official Merchandise</h3>
                <p>Masih coming soon. Nantinya tersedia merchandise dan produk digital pendukung event kampus.</p>
                <div className="srv-tags">
                  <span className="tag">Coming Soon</span>
                  <span className="tag">Merchandise</span>
                  <span className="tag">Digital Product</span>
                </div>
              </div>
              <div className="srv-card">
                <div className="srv-num">04</div>
                <h3>Academy & Mentorship</h3>
                <p>Masih coming soon. Program pembelajaran untuk pengembangan karir mahasiswa.</p>
                <div className="srv-tags">
                  <span className="tag">Coming Soon</span>
                  <span className="tag">Academy</span>
                  <span className="tag">Mentorship</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="keunggulan">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="sec-title" style={{ color: "white" }}>Keunggulan yang <em>Membedakan Kami</em></h2>
              <p className="sec-sub" style={{ color: "rgba(255,255,255,0.55)" }}>
                Kami bukan sekadar platform, kami mitra pertumbuhan yang hadir di setiap langkah perjalananmu.
              </p>
            </div>
            <div className="adv-grid">
              {advantageItems.map((item) => (
                <div key={item.title} className="adv-card">
                  <div className="adv-icon"><i className={`fas ${item.icon}`} /></div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimoni">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="sec-title">Apa Kata <em>Mereka?</em></h2>
            </div>
            <div className="testi-grid">
              <div className="testi-card">
                <div className="quote-icon">"</div>
                <p className="testi-text">Assalamualaikum dan selamat siang kak, maaf menganggu waktunya kak, aku llyas dari panitia event seminar nasional UMS, mau ngucapin maturnuwun ya mas udh mau bantu publikasi, semoga aboutcampus_id makin maju dan semakin bermanfaat bagi banyak-orang.</p>
                <div className="testi-author">
                  <div className="testi-avatar">IL</div>
                  <div>
                    <div className="testi-name">Ilyas</div>
                    <div className="testi-role">Panitia Seminar Nasional</div>
                  </div>
                </div>
              </div>
              <div className="testi-card">
                <div className="quote-icon">"</div>
                <p className="testi-text">Selamat siang kak, maaf menganggu waktunya kak, aku Devia dari panitia event seminar nasional tahun 2022, makasih bangett ya kak udah mau bantu publikasi, karena bantuan kaka program. seminar di kampusku jadi dapet peserta banyakk banget kak, bahkan sampe overload, sekali lagi makasihh ya kak atas bantuan dari aboutcampus_id.</p>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background: "linear-gradient(135deg,var(--orange),var(--orange2))" }}>DV</div>
                  <div>
                    <div className="testi-name">Devia</div>
                    <div className="testi-role">Panitia Event Kampus</div>
                  </div>
                </div>
              </div>
              <div className="testi-card">
                <div className="quote-icon">"</div>
                <p className="testi-text">Selamat siang как, perenaikan aku Arina sebagai salah satu panitia event bisnis plan tingkat nasional tahun 2021, aku mau ucapin terimakasih yaa kak udah mau bantu publikasi event kami kak, berkat bantuan publikasi dari pihak aboutcampus id peserta lomba bisnis plan kami mengingkat 60% kak.</p>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background: "linear-gradient(135deg,#9b59b6,#6c3483)" }}>SA</div>
                  <div>
                    <div className="testi-name">Siti Aminah</div>
                    <div className="testi-role">Panitia Lomba Nasional</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="cta-band">
        <div className="wrap">
          <h2>Siap Publikasi Event Kampus? <em>Order Sekarang</em></h2>
          <a className="wa-btn" href="/layanan/partnership" aria-label="Mulai order partnership">
            <i className="fas fa-paper-plane" /> Buka Halaman Order
          </a>
        </div>
      </section> */}

        <AiAssistantLauncher />
      </SubpageShell>
    </>
  );
}