import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { sendWhatsAppNotification } from "../../../../lib/whatsapp";

const paymentProofSchema = z.object({
  orderNumber: z.string().min(8, "Nomor order tidak valid"),
  paymentProofFileName: z.string().min(3, "Nama berkas bukti payment wajib diisi"),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = paymentProofSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: parsed.error.issues[0]?.message || "Data bukti payment tidak valid",
        },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: parsed.data.orderNumber },
    });

    if (!order) {
      return Response.json(
        {
          error: "Order tidak ditemukan",
        },
        { status: 404 }
      );
    }

    if (order.orderType !== "PAID") {
      return Response.json(
        {
          error: "Upload bukti payment hanya berlaku untuk order PAID",
        },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentProofFileName: parsed.data.paymentProofFileName,
      },
    });

    await prisma.orderLog.create({
      data: {
        orderId: order.id,
        action: "PAYMENT_PROOF_UPLOADED",
        actor: "customer",
      },
    });

    let notificationSent = false;
    try {
      const notifyResult = await sendWhatsAppNotification({
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customerName,
        phone: updatedOrder.phone,
        serviceType: `${updatedOrder.serviceType} (PAID - Bukti Payment)`,
        notes: `Bukti payment telah diupload: ${updatedOrder.paymentProofFileName || "-"}`,
      });
      notificationSent = Boolean(notifyResult.sent);
    } catch {
      notificationSent = false;
    }

    return Response.json(
      {
        ok: true,
        orderNumber: updatedOrder.orderNumber,
        notificationSent,
      },
      { status: 200 }
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
