export const ASSISTANT_NAME = "Campus Buddy";

export const ASSISTANT_MENU = [
  {
    label: "Menu",
    command: "/menu",
    description: "Lihat daftar perintah yang didukung",
  },
  {
    label: "Layanan",
    command: "/layanan",
    description: "Ringkasan layanan aktif dan coming soon",
  },
  {
    label: "Partnership",
    command: "/partnership",
    description: "Penjelasan alur order partnership",
  },
  {
    label: "FREE",
    command: "/free",
    description: "Syarat dan alur partnership gratis",
  },
  {
    label: "PAID",
    command: "/paid",
    description: "Syarat dan alur partnership berbayar",
  },
  {
    label: "Research",
    command: "/research",
    description: "Informasi layanan riset & consulting",
  },
  {
    label: "Store",
    command: "/store",
    description: "Informasi official store",
  },
  {
    label: "Kontak",
    command: "/kontak",
    description: "Kontak admin dan jalur bantuan",
  },
];

export const ASSISTANT_LINKS = {
  menu: "/",
  layanan: "/layanan/partnership",
  partnership: "/layanan/partnership",
  free: "/layanan/partnership/free",
  paid: "/layanan/partnership/paid",
  research: "/layanan/research",
  store: "/layanan/store",
  kontak: "/#kontak",
};

export const ASSISTANT_COMMAND_HINTS = {
  menu: "Lihat menu perintah dan shortcut halaman",
  layanan: "Ringkasan layanan aktif dan coming soon",
  partnership: "Alur order partnership dan perbedaan FREE/PAID",
  free: "Syarat paket FREE partnership",
  paid: "Alur paket PAID partnership",
  research: "Informasi layanan research & consulting",
  store: "Informasi official store",
  kontak: "Kontak admin dan bantuan manual",
};

export const ASSISTANT_SITE_FACTS = [
  "Website ini adalah aboutcampusid.my.id.",
  "About Campus ID adalah produk/platform informasi dan publikasi event kampus.",
  "Layanan aktif utama adalah Media Officer Partnership.",
  "FREE partnership punya syarat follow dan like yang harus dipenuhi.",
  "PAID partnership memakai alur order dan pembayaran yang dipisah.",
  "Research & Consulting masih coming soon.",
  "Official Store masih coming soon.",
  "Kontak utama tersedia via WhatsApp dan Instagram.",
];

const COMMAND_ALIASES = {
  menu: "menu",
  help: "menu",
  layanan: "layanan",
  laynanan: "layanan",
  service: "layanan",
  partnership: "partnership",
  free: "free",
  paid: "paid",
  research: "research",
  riset: "research",
  store: "store",
  kontak: "kontak",
  contact: "kontak",
  helpdesk: "kontak",
};

export function normalizeAssistantText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export function detectAssistantCommand(value) {
  const text = normalizeAssistantText(value);
  if (!text) return null;

  const firstToken = text.split(/\s+/)[0] || "";
  const command = firstToken.replace(/^\/+/, "");

  if (!command) return null;
  return COMMAND_ALIASES[command] || null;
}

export function buildCommandResponse(command) {
  const normalized = COMMAND_ALIASES[command] || command;

  switch (normalized) {
    case "menu":
      return {
        title: "Menu Campus Buddy",
        reply: [
          "Ini menu singkat yang bisa kamu pilih:",
          "- /layanan: ringkasan layanan",
          "- /partnership: alur partnership",
          "- /free: syarat FREE",
          "- /paid: alur PAID",
          "- /research: research & consulting",
          "- /store: official store",
          "- /kontak: kontak admin",
        ].join("\n"),
        suggestions: ["/layanan", "/partnership", "/free", "/paid"],
        links: [
          { label: "Partnership", href: ASSISTANT_LINKS.partnership },
          { label: "Research", href: ASSISTANT_LINKS.research },
          { label: "Store", href: ASSISTANT_LINKS.store },
        ],
      };
    case "layanan":
      return {
        title: "Ringkasan Layanan",
        reply: [
          "Layanan yang tersedia:",
          "1. Media Officer Partnership sebagai layanan aktif utama",
          "2. Research & Consulting masih coming soon",
          "3. Official Store masih coming soon",
          "4. Academy & Mentorship masih coming soon",
        ].join("\n"),
        suggestions: ["/partnership", "/free", "/paid"],
        links: [
          { label: "Partnership", href: ASSISTANT_LINKS.partnership },
          { label: "Research", href: ASSISTANT_LINKS.research },
          { label: "Store", href: ASSISTANT_LINKS.store },
        ],
      };
    case "partnership":
      return {
        title: "Partnership",
        reply: [
          "Partnership adalah layanan utama untuk publikasi event kampus di About Campus ID.",
          "Kamu bisa pilih alur FREE atau PAID sesuai kebutuhan dan syarat event.",
          "Kalau mau lanjut, pilih /free atau /paid agar saya arahkan lebih spesifik.",
        ].join("\n"),
        suggestions: ["/free", "/paid", "/kontak"],
        links: [
          { label: "FREE Partnership", href: ASSISTANT_LINKS.free },
          { label: "PAID Partnership", href: ASSISTANT_LINKS.paid },
        ],
      };
    case "free":
      return {
        title: "FREE Partnership",
        reply: [
          "FREE partnership cocok untuk event yang memenuhi syarat follow dan like yang ditetapkan.",
          "Biasanya user perlu mengisi form, memastikan checklist selesai, lalu menunggu verifikasi admin.",
          "Kalau kamu mau, saya bisa jelaskan alurnya langkah demi langkah.",
        ].join("\n"),
        suggestions: ["/partnership", "/paid", "/kontak"],
        links: [{ label: "Halaman FREE", href: ASSISTANT_LINKS.free }],
      };
    case "paid":
      return {
        title: "PAID Partnership",
        reply: [
          "PAID partnership memakai alur order yang lebih langsung: isi form, lanjut pembayaran, lalu upload bukti.",
          "Setelah bukti terkirim, admin akan memproses order sesuai data yang masuk.",
        ].join("\n"),
        suggestions: ["/partnership", "/kontak", "/menu"],
        links: [{ label: "Halaman PAID", href: ASSISTANT_LINKS.paid }],
      };
    case "research":
      return {
        title: "Research & Consulting",
        reply: "Research & Consulting masih coming soon. Nanti akan dibuka untuk layanan riset akademik dan konsultasi data.",
        suggestions: ["/layanan", "/kontak"],
        links: [{ label: "Research", href: ASSISTANT_LINKS.research }],
      };
    case "store":
      return {
        title: "Official Store",
        reply: "Official Store masih coming soon. Nantinya akan berisi merchandise dan produk digital pendukung event kampus.",
        suggestions: ["/layanan", "/kontak"],
        links: [{ label: "Store", href: ASSISTANT_LINKS.store }],
      };
    case "kontak":
      return {
        title: "Kontak Admin",
        reply: "Kalau kamu butuh bantuan langsung, hubungi admin via WhatsApp atau buka halaman layanan yang sesuai.",
        suggestions: ["/menu", "/layanan", "/partnership"],
        links: [
          { label: "WhatsApp Admin", href: "https://wa.me/6285226446178?text=Halo%20Admin%20About%20Campus%20ID" },
          { label: "Kontak Website", href: ASSISTANT_LINKS.kontak },
        ],
      };
    default:
      return null;
  }
}

export function buildAssistantSystemPrompt() {
  return [
    "Kamu adalah Campus Buddy, assistant untuk website aboutcampusid.my.id dan produk About Campus ID.",
    "Tugasmu hanya menjawab seputar website, fitur, layanan, alur order, dan navigasi halaman aboutcampusid.my.id.",
    "Bahasa utama harus Indonesia, singkat, jelas, dan helpful.",
    "Kalau user mengetik command seperti /menu atau /layanan, jelaskan menu yang relevan secara terstruktur.",
    "Kalau pertanyaan di luar scope, arahkan ke WhatsApp admin atau halaman yang relevan.",
    "Jangan mengarang informasi yang tidak ada di knowledge berikut.",
    "Knowledge ringkas:",
    ...ASSISTANT_SITE_FACTS.map((item) => `- ${item}`),
    "Jika user meminta navigasi, berikan link yang sesuai.",
  ].join("\n");
}
