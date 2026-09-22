import { NextResponse } from "next/server";
import { getBearerToken, parseToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function userIdFromRequest(request: Request) {
  const token = getBearerToken(request);
  const payload = token ? parseToken(token) : null;
  return typeof payload?.sub === "string" ? payload.sub : null;
}

export async function GET(request: Request) {
  const userId = userIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return NextResponse.json({ notifications, unreadCount: notifications.filter((item) => !item.isRead).length });
}

export async function PATCH(request: Request) {
  const userId = userIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  return NextResponse.json({ status: "read" });
}
