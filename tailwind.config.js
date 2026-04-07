/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand roles
        primary: "#23B5B5",   // Teal utama logo
        secondary: "#FA663E", // Orange hangat
        tertiary: "#FFDD59",  // Kuning highlight
        accent: "#FF1717",    // Red untuk CTA kuat/alert
        info: "#100F0D",      // Near-black untuk teks/kontras

        // Optional raw palette (langsung dari request)
        brand: {
          red: "#FF1717",
          orange: "#FA663E",
          yellow: "#FFDD59",
          teal: "#23B5B5",
          ink: "#100F0D",
        },
      },
    },
  },
  plugins: [],
};
