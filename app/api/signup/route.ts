import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const latency = Number(searchParams.get("latency") ?? "600");
  const outcome = (searchParams.get("outcome") ?? "success") as "success" | "error";

  const body = await req.json().catch(() => ({}));
  // Basic shape check
  if (!body?.email || !body?.schoolId || !body?.curriculumId) {
    await new Promise(r => setTimeout(r, latency));
    return NextResponse.json({ status: "error", message: "Missing required fields." }, { status: 400 });
  }

  await new Promise(r => setTimeout(r, latency));
  if (outcome === "error") {
    return NextResponse.json({ status: "error", message: "Mock API: forced error" }, { status: 400 });
  }
  return NextResponse.json({ status: "ok", message: "Account created! Verify your student email." });
}
