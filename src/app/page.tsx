import Image from "next/image";
import Link from "next/link";

import { db } from "@/lib/prisma";

const HomePage = async () => {
  const restaurants = await db.restaurant.findMany({
    include: {
      menuCategories: {
        include: { product: true },
      },
    },
  });

  // Define se deve usar flex ou grid
  const isFlex = restaurants.length <= 2;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">
        Restaurantes Cadastrados
      </h1>

      <div
        className={`${
          isFlex
            ? "flex flex-col sm:flex-row justify-center gap-8"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        }`}
      >
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 relative mb-4">
              <Image
                src={restaurant.avatarImageUrl}
                alt={restaurant.name}
                fill
                className="object-cover rounded-full border-2 border-gray-200"
              />
            </div>

            <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
            <p className="text-gray-500 mb-4">
              {restaurant.description || "Nenhuma descrição disponível."}
            </p>

            <Link
              href={`/${restaurant.slug}`}
              className="mt-auto inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Menu
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
