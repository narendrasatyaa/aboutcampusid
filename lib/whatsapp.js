function normalizePhoneNumber(value) {
  const raw = String(value || "").trim().replace(/[^0-9+]/g, "");
  if (!raw) return "";
  if (raw.startsWith("+")) return raw.slice(1);
  if (raw.startsWith("0")) return `62${raw.slice(1)}`;
  return raw;
}

async function sendViaFonnte({ token, target, message }) {
  const response = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      target,
      message,
      countryCode: "62",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Fonnte API failed: ${response.status} ${errorBody}`);
  }

  return { sent: true, provider: "fonnte" };
}

async function sendViaCustomProvider({ apiUrl, apiToken, target, message }) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      target,
      message,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`WhatsApp API failed: ${response.status} ${errorBody}`);
  }

  return { sent: true, provider: "custom" };
}

export async function sendWhatsAppNotification({ orderNumber, customerName, phone, serviceType, notes }) {
  const fonnteToken = process.env.FONNTE_TOKEN;
  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const adminPhone = normalizePhoneNumber(process.env.WHATSAPP_ADMIN_PHONE);

  if (!adminPhone) {
    return { sent: false, reason: "WHATSAPP_ADMIN_PHONE belum diatur" };
  }

  if (!fonnteToken && (!apiUrl || !apiToken)) {
    return {
      sent: false,
      reason: "Konfigurasi WA belum lengkap. Isi FONNTE_TOKEN atau WHATSAPP_API_URL + WHATSAPP_API_TOKEN.",
    };
  }

  const message = [
    "Order baru masuk di website About Campus ID",
    `No Order: ${orderNumber}`,
    `Nama: ${customerName}`,
    `No WA: ${phone}`,
    `Layanan: ${serviceType}`,
    `Catatan: ${notes || "-"}`,
    `Dashboard: ${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/orders`,
  ].join("\n");

  if (fonnteToken) {
    return sendViaFonnte({
      token: fonnteToken,
      target: adminPhone,
      message,
    });
  }

  return sendViaCustomProvider({
    apiUrl,
    apiToken,
    target: adminPhone,
    message,
  });
}
