import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminKeyValue,
  verifyAdminSessionToken,
} from "../../../../lib/admin-auth";

function verifyAdminAccess(request) {
  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (verifyAdminSessionToken(sessionToken)) {
    return { ok: true };
  }

  const reqKey = request.headers.get("x-admin-key");
  return verifyAdminKeyValue(reqKey);
}

const patchSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["NEW", "PROCESSING", "DONE", "CANCELED"]),
});

export async function GET(request) {
  const auth = verifyAdminAccess(request);
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
  const auth = verifyAdminAccess(request);
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
