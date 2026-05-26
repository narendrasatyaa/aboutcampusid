import { z } from "zod";
import { prisma } from "../../../../../lib/prisma";
import { firestore } from "../../../../../lib/firebase-admin";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminKeyValue,
  verifyAdminSessionToken,
} from "../../../../../lib/admin-auth";

function verifyAdminAccess(request) {
  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (verifyAdminSessionToken(sessionToken)) {
    return { ok: true };
  }

  const reqKey = request.headers.get("x-admin-key");
  return verifyAdminKeyValue(reqKey);
}

const patchSchema = z.object({
  customerName: z.string().min(2).optional(),
  phone: z.string().min(9).optional(),
  serviceType: z.string().min(2).optional(),
  orderType: z.enum(["FREE", "PAID"]).optional(),
  instagramUsername: z.string().optional().nullable(),
  orderDetails: z.string().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  paymentProofFileName: z.string().optional().nullable(),
  status: z.enum(["NEW", "PROCESSING", "DONE", "CANCELED"]).optional(),
});

export async function GET(request, { params }) {
  const auth = verifyAdminAccess(request);
  if (!auth.ok) {
    return Response.json({ error: auth.message }, { status: 401 });
  }

  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      logs: {
        orderBy: { createdAt: "desc" },
        take: 30,
      },
    },
  });

  if (!order) {
    return Response.json({ error: "Order tidak ditemukan" }, { status: 404 });
  }

  return Response.json({ order });
}

export async function PATCH(request, { params }) {
  const auth = verifyAdminAccess(request);
  if (!auth.ok) {
    return Response.json({ error: auth.message }, { status: 401 });
  }

  const { orderId } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Payload update tidak valid" }, { status: 400 });
  }

  const {
    customerName,
    phone,
    serviceType,
    orderType,
    instagramUsername,
    orderDetails,
    notes,
    paymentProofFileName,
    status,
  } = parsed.data;

  const data = {};
  if (typeof customerName === "string") data.customerName = customerName;
  if (typeof phone === "string") data.phone = phone;
  if (typeof serviceType === "string") data.serviceType = serviceType;
  if (typeof orderType === "string") data.orderType = orderType;
  if (typeof instagramUsername !== "undefined") data.instagramUsername = instagramUsername || null;
  if (typeof orderDetails !== "undefined") data.orderDetails = orderDetails || null;
  if (typeof notes !== "undefined") data.notes = notes || null;
  if (typeof paymentProofFileName !== "undefined") data.paymentProofFileName = paymentProofFileName || null;
  if (typeof status === "string") data.status = status;

  if (Object.keys(data).length === 0) {
    return Response.json({ error: "Tidak ada data yang diupdate" }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data,
  });

  if (firestore) {
    await firestore.collection("orders").doc(updated.orderNumber).set(
      {
        orderNumber: updated.orderNumber,
        status: updated.status,
        customerName: updated.customerName,
        phone: updated.phone,
        serviceType: updated.serviceType,
        orderType: updated.orderType,
        instagramUsername: updated.instagramUsername || null,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }

  await prisma.orderLog.create({
    data: {
      orderId: updated.id,
      action: status ? `STATUS_${updated.status}` : "ORDER_UPDATED",
      actor: "admin",
    },
  });

  return Response.json({ ok: true, order: updated });
}

export async function DELETE(request, { params }) {
  const auth = verifyAdminAccess(request);
  if (!auth.ok) {
    return Response.json({ error: auth.message }, { status: 401 });
  }

  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true },
  });

  if (!order) {
    return Response.json({ error: "Order tidak ditemukan" }, { status: 404 });
  }

  await prisma.order.delete({ where: { id: orderId } });
  return Response.json({ ok: true });
}
