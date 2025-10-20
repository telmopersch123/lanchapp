import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cpf = searchParams.get("cpf");

  if (!cpf) {
    return NextResponse.json({ lastOrder: null });
  }

  const lastOrder = await db.order.findFirst({
    where: { customerCPF: cpf },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ lastOrder });
}
