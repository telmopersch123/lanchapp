import { getRestaurantBySlug } from "@/data/get-restaurant-by-slug";
import { notFound } from "next/navigation";
import RestaurantCategories from "./components/categories";
import RestaurantHeader from "./components/header";

interface RestaurantMenuPageProps {
  params: Promise<{ slug: string }>;
  searchParams: { consumptionMethod: string };
}

const isConsumptionMethodValid = (consumptionMethod: string) => {
  return ["TAKEAWAY", "DINE_IN"].includes(consumptionMethod);
};

const RestaurantMenuPage = async ({
  params,
  searchParams,
}: RestaurantMenuPageProps) => {
  const { slug } = await params;
  const { consumptionMethod } = searchParams;
  if (!isConsumptionMethodValid(consumptionMethod)) return notFound();
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) return notFound();
  return (
    <h1>
      <RestaurantHeader restaurant={restaurant} />
      <RestaurantCategories restaurant={restaurant} />
    </h1>
  );
};

export default RestaurantMenuPage;
