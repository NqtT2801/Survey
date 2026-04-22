import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_COOKIE,
  makeAdminCookieValue,
  verifyAdminPassword,
} from "@/lib/auth";

const schema = z.object({ password: z.string().min(1) });

export async function POST(req: Request) {
  const body = schema.safeParse(await req.json().catch(() => ({})));
  if (!body.success) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }
  if (!verifyAdminPassword(body.data.password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE.name,
    value: await makeAdminCookieValue(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_COOKIE.maxAge,
  });
  return res;
}
