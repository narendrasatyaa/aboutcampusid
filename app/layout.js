import "./globals.css";

export const metadata = {
  title: "About Campus ID - Solusi Dunia Pendidikan",
  description:
    "Platform edukasi, media partner, mentorship, riset, dan store untuk mahasiswa Indonesia.",
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
