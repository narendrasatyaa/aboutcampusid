import { z } from "zod";
import { prisma } from "../../../../lib/prisma";

function verifyAdminKey(request) {
  const reqKey = request.headers.get("x-admin-key");
  const envKey = process.env.ADMIN_DASHBOARD_KEY;

  if (!envKey) {
    return { ok: false, message: "ADMIN_DASHBOARD_KEY belum diatur" };
  }

  if (!reqKey || reqKey !== envKey) {
    return { ok: false, message: "Admin key tidak valid" };
  }

  return { ok: true };
}

const patchSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["NEW", "PROCESSING", "DONE", "CANCELED"]),
});

export async function GET(request) {
  const auth = verifyAdminKey(request);
  if (!auth.ok) {
    return Response.json({ error: auth.message }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return Response.json({ orders });
}

export async function PATCH(request) {
  const auth = verifyAdminKey(request);
  if (!auth.ok) {
    return Response.json({ error: auth.message }, { status: 401 });
  }

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Payload update tidak valid" }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: parsed.data.orderId },
    data: { status: parsed.data.status },
  });

  await prisma.orderLog.create({
    data: {
      orderId: updated.id,
      action: `STATUS_${updated.status}`,
      actor: "admin",
    },
  });

  return Response.json({ ok: true, order: updated });
}
