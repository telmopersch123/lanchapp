import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key not found");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });
  const signasture = request.headers.get("stripe-signature");
  if (!signasture) return new Response("Missing signasture", { status: 400 });

  const text = await request.text();

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe webhook secret not found");
  }
  const event = stripe.webhooks.constructEvent(
    text,
    signasture,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case "checkout.session.completed":
      const orderId = event.data.object.metadata?.orderId;
      if (!orderId) {
        return NextResponse.json({ received: true });
      }
      const order = await db.order.update({
        where: {
          id: Number(orderId),
        },
        data: {
          status: "PAYMENT_CONFIRMED",
        },
        include: {
          restaurant: {
            select: {
              slug: true,
            },
          },
        },
      });
      revalidatePath(`/${order.restaurant.slug}/orders`);
      break;
    case "charge.failed":
      const orderIdFailed = event.data.object.metadata?.orderId;
      if (!orderId) {
        return NextResponse.json({ received: true });
      }
      const orderFailed = await db.order.update({
        where: {
          id: Number(orderIdFailed),
        },
        data: {
          status: "PAYMENT_FAILED",
        },
        include: {
          restaurant: {
            select: {
              slug: true,
            },
          },
        },
      });
      revalidatePath(`/${orderFailed.restaurant.slug}/orders`);
      break;
    default:
      return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
