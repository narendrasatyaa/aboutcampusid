import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aboutcampusid.my.id";
const normalizedSiteUrl = siteUrl.replace(/\/$/, "");

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "About Campus ID",
  alternateName: "About Campus",
  url: normalizedSiteUrl,
  logo: `${normalizedSiteUrl}/images/logo-bg.png`,
  sameAs: ["https://instagram.com/aboutcampus_id"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: "+62-852-2644-6178",
      areaServed: "ID",
      availableLanguage: ["id", "en"],
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "About Campus ID",
  alternateName: "About Campus",
  url: normalizedSiteUrl,
  inLanguage: "id-ID",
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "About Campus ID | Media Officer Partnership, Riset, dan Official Store",
    template: "%s | About Campus ID",
  },
  description:
    "About Campus ID adalah platform media partner kampus, publikasi event, riset, consulting, dan official store untuk mahasiswa Indonesia.",
  keywords: [
    "About Campus ID",
    "About Campus",
    "media partner kampus",
    "publikasi event kampus",
    "partnership kampus",
    "riset kampus",
    "official store mahasiswa",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  openGraph: {
    type: "website",
    siteName: "About Campus ID",
    locale: "id_ID",
    url: normalizedSiteUrl,
    title: "About Campus ID | Media Officer Partnership, Riset, dan Official Store",
    description:
      "About Campus ID adalah platform media partner kampus, publikasi event, riset, consulting, dan official store untuk mahasiswa Indonesia.",
    images: [
      {
        url: "/images/logo-bg.png",
        width: 1200,
        height: 1200,
        alt: "About Campus ID Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aboutcampus_id",
    creator: "@aboutcampus_id",
    title: "About Campus ID | Media Officer Partnership, Riset, dan Official Store",
    description:
      "About Campus ID adalah platform media partner kampus, publikasi event, riset, consulting, dan official store untuk mahasiswa Indonesia.",
    images: ["/images/logo-bg.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        {/* font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
