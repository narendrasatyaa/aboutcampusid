"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AiAssistantLauncher from "./AiAssistantLauncher";

export default function SubpageShell({ children }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const serviceItems = [
    {
      title: "Media Officer Partnership",
      description: "Layanan aktif untuk publikasi event kampus.",
      href: "/layanan/partnership",
      icon: "fa-handshake",
    },
    {
      title: "Research & Consulting",
      description: "Coming soon untuk riset dan konsultasi akademik.",
      href: "/layanan/research",
      icon: "fa-flask",
    },
    {
      title: "Official Store",
      description: "Coming soon untuk merchandise dan produk digital.",
      href: "/layanan/store",
      icon: "fa-store",
    },
  ];

  const infoItems = [
    {
      title: "Keunggulan",
      description: "Kenapa alur order dibuat seperti ini.",
      href: "/#keunggulan",
      icon: "fa-bolt",
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
    setMenuOpen(false);
  }, [pathname]);

  const isServiceActive = pathname.startsWith("/layanan/") || pathname.startsWith("/partnership");

  return (
    <>
      <div className="subpage-shell">
        <header className={`subpage-header ${isScrolled ? "is-scrolled" : ""}`} id="header">
          <div className="bar">
            <div className="bar-left">
              <a href="/" className="logo" style={{ textDecoration: "none" }}>
                <div className="logo-icon">
                  <img src="/images/logo-bg.png" alt="About Campus ID Logo" />
                </div>
              </a>
              <nav className={menuOpen ? "open" : ""}>
                <ul>
                  <li className="nav-has-submenu">
                    <span className={`nav-parent ${isServiceActive ? "active-link" : ""}`}>
                      Layanan <i className="fas fa-chevron-down" />
                    </span>
                    <div className="nav-mega-panel nav-mega-services">
                      <div className="nav-mega-grid">
                        {serviceItems.map((item) => (
                          <a key={item.href} href={item.href} className="nav-mega-card">
                            <div className="nav-mega-icon"><i className={`fas ${item.icon}`} /></div>
                            <div>
                              <h4>{item.title}</h4>
                              <p>{item.description}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </li>
                  <li className="nav-has-submenu">
                    <span className="nav-parent">
                      Informasi <i className="fas fa-chevron-down" />
                    </span>
                    <div className="nav-mega-panel nav-mega-info">
                      <div className="nav-mega-list">
                        {infoItems.map((item) => (
                          <a key={item.href} href={item.href} className="nav-mega-card nav-mega-card-list">
                            <div className="nav-mega-icon"><i className={`fas ${item.icon}`} /></div>
                            <div>
                              <h4>{item.title}</h4>
                              <p>{item.description}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="bar-right">
              <nav className={menuOpen ? "open" : ""}>
                <ul>
                  <li>
                    <a href="https://drive.google.com/file/d/1e0aiAnv6rpkgbUYmo4UCUOvoE4NCTDTZ/view?usp=sharing" className="nav-cta" target="_blank" rel="noreferrer">
                      Panduan Media Patner
                    </a>
                  </li>
                  <li>
                    <a href="https://wa.me/6285226446178?text=Halo%20Admin%20About%20Campus%20ID" className="nav-cta" target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
                  </li>
                </ul>
              </nav>
              <button
                type="button"
                className={`menu-toggle ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle menu"
              >
                <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`} />
              </button>
            </div>
          </div>
        </header>

        <nav className="mobile-bottom-nav" aria-label="Navigasi mobile">
          <a href="/">
            <i className="fas fa-house" />
            <span>Beranda</span>
          </a>
          <a href="/layanan/partnership" className={isServiceActive ? "is-active" : ""}>
            <i className="fas fa-layer-group" />
            <span>Layanan</span>
          </a>
        </nav>

        <main className="subpage-main">{children}</main>

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
                  Platform penyedia layanan edukasi, media, mentorship, riset, dan store untuk mahasiswa di seluruh Indonesia.
                </p>
              </div>
              <div>
                <h4>Link Cepat</h4>
                <ul>
                  <li><a href="/">Beranda</a></li>
                  <li><a href="/layanan/partnership">Partnership Center</a></li>
                  <li><a href="/layanan/research">Research & Consulting</a></li>
                  <li><a href="/layanan/store">Store</a></li>
                </ul>
              </div>
              <div>
                <h4>Hubungi Kami</h4>
                <ul className="footer-contact">
                  <li><i className="fab fa-whatsapp" /><a href="https://wa.me/6285226446178" target="_blank" rel="noreferrer">WhatsApp</a></li>
                  <li><i className="fab fa-instagram" /><a href="https://instagram.com/aboutcampus_id" target="_blank" rel="noreferrer">@aboutcampus_id</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="copyright">&copy; {new Date().getFullYear()} About Campus ID.</div>
        </footer>
      </div>

      <AiAssistantLauncher />
    </>
  );
}
