import { z } from "zod";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionCookieConfig,
  verifyAdminKeyValue,
} from "../../../../lib/admin-auth";

const loginSchema = z.object({
  key: z.string().min(1),
});

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Payload login tidak valid" }, { status: 400 });
  }

  const verified = verifyAdminKeyValue(parsed.data.key);
  if (!verified.ok) {
    return NextResponse.json({ error: verified.message }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionToken(),
    getAdminSessionCookieConfig()
  );

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...getAdminSessionCookieConfig(),
    maxAge: 0,
  });
  return response;
}
