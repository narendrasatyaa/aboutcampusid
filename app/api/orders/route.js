import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { sendWhatsAppNotification } from "../../../lib/whatsapp";

const orderSchema = z.object({
  customerName: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z
    .string()
    .min(9, "Nomor WA tidak valid")
    .regex(/^[0-9+]+$/, "Nomor WA hanya boleh angka dan tanda +"),
  serviceType: z.string().min(2),
  notes: z.string().max(500).optional().or(z.literal("")),
});

function createOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `AC-${y}${m}${d}-${random}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: parsed.error.issues[0]?.message || "Data order tidak valid",
        },
        { status: 400 }
      );
    }

    const orderNumber = createOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: parsed.data.customerName,
        phone: parsed.data.phone,
        serviceType: parsed.data.serviceType,
        notes: parsed.data.notes || null,
      },
    });

    await prisma.orderLog.create({
      data: {
        orderId: order.id,
        action: "ORDER_CREATED",
        actor: "system",
      },
    });

    let notificationSent = false;
    try {
      const notifyResult = await sendWhatsAppNotification({
        orderNumber,
        customerName: order.customerName,
        phone: order.phone,
        serviceType: order.serviceType,
        notes: order.notes,
      });
      notificationSent = Boolean(notifyResult.sent);
    } catch {
      notificationSent = false;
    }

    return Response.json(
      {
        ok: true,
        orderNumber,
        notificationSent,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Terjadi kesalahan server",
      },
      { status: 500 }
    );
  }
}
