import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Função auxiliar para converter Decimal -> number
export function serializeDecimal(obj: any) {
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
