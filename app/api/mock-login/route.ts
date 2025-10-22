import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { makeMockToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, schoolId } = await req.json();
  if (!email || !schoolId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const token = makeMockToken({ email, schoolId });
  const cookieStore = await cookies();
  cookieStore.set("godaddy_sso", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 6 });

  return NextResponse.json({ ok: true });
}
