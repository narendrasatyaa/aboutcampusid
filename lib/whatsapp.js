export async function sendWhatsAppNotification({ orderNumber, customerName, phone, serviceType, notes }) {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const adminPhone = process.env.WHATSAPP_ADMIN_PHONE;

  if (!apiUrl || !apiToken || !adminPhone) {
    return { sent: false, reason: "WA config is missing" };
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

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      target: adminPhone,
      message,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`WhatsApp API failed: ${response.status} ${errorBody}`);
  }

  return { sent: true };
}
