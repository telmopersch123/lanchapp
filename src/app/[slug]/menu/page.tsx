import { notFound } from "next/navigation";

import { getRestaurantBySlug } from "@/data/get-restaurant-by-slug";

import RestaurantCategories from "./components/categories";
import RestaurantHeader from "./components/header";
import PopupHandler from "./components/PopupHandler";

interface RestaurantMenuPageProps {
  params: Promise<{ slug: string }>; // Change to Promise
  searchParams: Promise<{
    consumptionMethod: string;
    cpf: string;
    showPopup: boolean;
  }>;
}

const isConsumptionMethodValid = (consumptionMethod: string) => {
  return ["TAKEAWAY", "DINE_IN"].includes(consumptionMethod);
};

const RestaurantMenuPage = async ({
  params,
  searchParams,
}: RestaurantMenuPageProps) => {
  const { slug } = await params;
  const { cpf, consumptionMethod } = await searchParams;

  if (!consumptionMethod) return notFound();
  if (!isConsumptionMethodValid(consumptionMethod)) return notFound();
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) return notFound();

  // let lastOrder = null;
  // if (cpf) {
  //   lastOrder = await db.order.findFirst({
  //     where: { customerCPF: cpf, status: "PAYMENT_CONFIRMED" },
  //     orderBy: { createdAt: "desc" },
  //   });
  // }

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        <RestaurantHeader restaurant={restaurant} />
        <RestaurantCategories restaurant={restaurant} />
      </div>
      <PopupHandler cpf={cpf} />
    </>
  );
};

export default RestaurantMenuPage;
