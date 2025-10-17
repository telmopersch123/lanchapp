"use server";

import { db } from "@/lib/prisma";
import { ConsumptionMethod } from "@prisma/client";
import { removeCpfMask } from "../helpers/cpf";

interface CreateOrderInput {
  customerName: string;
  customerCpf: string;
  products: Array<{ id: string; quantity: number }>;
  consumptionMethod: ConsumptionMethod;
  slug: string;
}

export const createOrder = async (input: CreateOrderInput) => {
  const restaurant = await db.restaurant.findUnique({
    where: {
      slug: input.slug,
    },
  });
  if (!restaurant) {
    throw new Error("Restaurante não encontrado");
  }

  const productsWithPrices = await db.product.findMany({
    where: {
      id: {
        in: input.products.map((product) => product.id),
      },
    },
  });
  const productsWithPricesAndQuantity = input.products.map((product) => ({
    productId: product.id,
    price: Number(productsWithPrices.find((p) => p.id === product.id)!.price),
    quantity: product.quantity,
  }));
  await db.order.create({
    data: {
      status: "PENDING",
      customerName: input.customerName,
      customerCPF: removeCpfMask(input.customerCpf),
      orderProduct: {
        createMany: {
          data: productsWithPricesAndQuantity,
        },
      },
      total: productsWithPricesAndQuantity.reduce(
        (total, product) => total + Number(product.price) * product.quantity,
        0
      ),
      consumptionMethod: input.consumptionMethod,
      restaurant: {
        connect: {
          id: restaurant.id,
        },
      },
    },
  });
};
