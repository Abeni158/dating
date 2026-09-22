import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "global-date",
    timestamp: new Date().toISOString()
  });
}
