import { NextResponse } from "next/server";
import { getDecodedUser } from "@/lib/auth";

export async function GET() {
  const user = await getDecodedUser();
  if (!user) return NextResponse.json({ ok: false });
  return NextResponse.json({
    ok: true,
    customerId: user.customerId,
    shopperId: user.shopperId,
    email: user.email,
  });
}
