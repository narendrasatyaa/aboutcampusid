import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aboutcampusid.my.id";

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
    "media partner kampus",
    "publikasi event kampus",
    "partnership kampus",
    "riset kampus",
    "official store mahasiswa",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "About Campus ID",
    locale: "id_ID",
    title: "About Campus ID | Media Officer Partnership, Riset, dan Official Store",
    description:
      "About Campus ID adalah platform media partner kampus, publikasi event, riset, consulting, dan official store untuk mahasiswa Indonesia.",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Campus ID | Media Officer Partnership, Riset, dan Official Store",
    description:
      "About Campus ID adalah platform media partner kampus, publikasi event, riset, consulting, dan official store untuk mahasiswa Indonesia.",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
