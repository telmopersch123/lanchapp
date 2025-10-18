"use server";

import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import Stripe from "stripe";
import { CartProduct } from "../contexts/cart";
import { removeCpfMask } from "../helpers/cpf";

interface CreateStripeCheckout {
  orderId: number;
  products: CartProduct[];
  slug: string;
  consumptionMethod: string;
  cpf: string;
}

export const createStripeCheckout = async ({
  orderId,
  products,
  slug,
  consumptionMethod,
  cpf,
}: CreateStripeCheckout) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key not found");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });
  const origin = (await headers()).get("origin") as string;

  const productsWithPrices = await db.product.findMany({
    where: {
      id: {
        in: products.map((product) => product.id),
      },
    },
  });
  const searchParams = new URLSearchParams({ cpf });
  searchParams.set("consumptionMethod", consumptionMethod);
  searchParams.set("cpf", removeCpfMask(cpf));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "boleto"],
    mode: "payment",
    metadata: {
      orderId,
    },
    line_items: products.map((product) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: product.name,
          images: [product.imageUrl],
        },
        unit_amount:
          Number(productsWithPrices.find((p) => p.id === product.id)!.price) *
          100,
      },
      quantity: product.quantity,
    })),
    success_url: `${origin}/${slug}/orders?${searchParams.toString()}`,
    cancel_url: `${origin}/${slug}/menu?${searchParams.toString()}`,
  });

  return { sessionId: session.id };
};
