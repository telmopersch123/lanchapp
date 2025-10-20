import { Prisma } from "@prisma/client";

import { db } from "@/lib/prisma";

// Função auxiliar para converter Decimal -> number
export function serializeDecimal<T>(obj: T) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      value instanceof Prisma.Decimal ? Number(value) : value
    )
  );
}

export const getRestaurantBySlug = async (slug: string) => {
  const restaurant = await db.restaurant.findUnique({
    where: {
      slug,
    },
    include: {
      menuCategories: {
        include: { product: true },
      },
    },
  });

  // Converter antes de retornar
  return serializeDecimal(restaurant);
};
