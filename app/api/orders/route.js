import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { sendWhatsAppNotification } from "../../../lib/whatsapp";
import { firestore, verifyIdToken } from "../../../lib/firebase-admin";
import {
  FOLLOW_TARGET_ACCOUNT,
  REQUIRED_FOLLOW_COUNT,
  normalizeInstagramHandle,
} from "../../../lib/partnership-requirements";

const orderSchema = z.object({
  customerName: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z
    .string()
    .min(9, "Nomor WA tidak valid")
    .regex(/^[0-9+]+$/, "Nomor WA hanya boleh angka dan tanda +"),
  serviceType: z.string().min(2),
  orderType: z.enum(["FREE", "PAID"]).default("FREE"),
  instagramUsername: z.string().optional().or(z.literal("")),
  followChecklistConfirmed: z.boolean().optional().default(false),
  likeChecklistConfirmed: z.boolean().optional().default(false),
  followedAccounts: z.array(z.string()).optional().default([]),
  likedPosts: z.array(z.string()).optional().default([]),
  orderDetails: z.string().min(8, "Detail order minimal 8 karakter"),
  paymentProofFileName: z.string().optional().or(z.literal("")),
  posterFileNames: z.array(z.string()).max(5, "Maksimal upload poster 5 file").optional().default([]),
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
    // optional Firebase ID token in Authorization header: 'Bearer <idToken>'
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    let actor = "system";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const idToken = authHeader.split(" ")[1];
      try {
        const decoded = await verifyIdToken(idToken);
        actor = decoded.uid || "system";
      } catch (err) {
        return Response.json({ error: "Invalid authentication token" }, { status: 401 });
      }
    }

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

    const followedAccounts = (parsed.data.followedAccounts || [])
      .map(normalizeInstagramHandle)
      .filter(Boolean);
    const likedPosts = (parsed.data.likedPosts || [])
      .map((item) => item.trim())
      .filter(Boolean);
    const posterFileNames = (parsed.data.posterFileNames || [])
      .map((item) => item.trim())
      .filter(Boolean);

    if (posterFileNames.length === 0) {
      return Response.json(
        {
          error: "Minimal upload 1 poster",
        },
        { status: 400 }
      );
    }

    if (parsed.data.orderType === "FREE") {
      if (!parsed.data.instagramUsername?.trim()) {
        return Response.json(
          {
            error: "Username Instagram wajib diisi untuk paket FREE",
          },
          { status: 400 }
        );
      }

      if (!parsed.data.followChecklistConfirmed) {
        return Response.json(
          {
            error: "Checklist konfirmasi follow wajib dicentang",
          },
          { status: 400 }
        );
      }

      if (!parsed.data.likeChecklistConfirmed) {
        return Response.json(
          {
            error: "Checklist konfirmasi like wajib dicentang",
          },
          { status: 400 }
        );
      }

      if (followedAccounts.length < REQUIRED_FOLLOW_COUNT) {
        return Response.json(
          {
            error: `Minimal ${REQUIRED_FOLLOW_COUNT} akun panitia harus follow @${FOLLOW_TARGET_ACCOUNT} untuk paket FREE`,
          },
          { status: 400 }
        );
      }

    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: parsed.data.customerName,
        phone: parsed.data.phone,
        serviceType: parsed.data.serviceType,
        orderType: parsed.data.orderType,
        instagramUsername: parsed.data.instagramUsername || null,
        followChecklistConfirmed: Boolean(parsed.data.followChecklistConfirmed),
        likeChecklistConfirmed: Boolean(parsed.data.likeChecklistConfirmed),
        followedAccounts,
        likedPosts,
        orderDetails: parsed.data.orderDetails,
        paymentProofFileName: parsed.data.paymentProofFileName || null,
        posterFileNames,
        notes: parsed.data.notes || null,
      },
    });

    if (firestore) {
      await firestore.collection("orders").doc(orderNumber).set({
        orderNumber,
        userUid: actor !== "system" ? actor : null,
        customerName: order.customerName,
        phone: order.phone,
        serviceType: order.serviceType,
        orderType: order.orderType,
        instagramUsername: order.instagramUsername || null,
        status: order.status,
        paymentProofFileName: order.paymentProofFileName || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    await prisma.orderLog.create({
      data: {
        orderId: order.id,
        action: "ORDER_CREATED",
        actor,
      },
    });

    let notificationSent = false;
    try {
      const notifyResult = await sendWhatsAppNotification({
        orderNumber,
        customerName: order.customerName,
        phone: order.phone,
        serviceType: order.serviceType,
        notes: `${order.notes || "-"}\nType: ${order.orderType}\nDetail: ${order.orderDetails || "-"}\nBukti Bayar: ${order.paymentProofFileName || "-"}\nPoster: ${(order.posterFileNames || []).join(", ") || "-"}\nTarget Admin: @${FOLLOW_TARGET_ACCOUNT}\nFollower Panitia: ${order.followedAccounts.length}\nLike Confirmed: ${order.likeChecklistConfirmed ? "YES" : "NO"}`,
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
