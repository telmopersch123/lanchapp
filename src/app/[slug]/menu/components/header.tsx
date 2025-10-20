"use client";
import { Restaurant } from "@prisma/client";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

interface RestaurantHeaderProps {
  restaurant: Pick<Restaurant, "name" | "coverImageUrl" | "avatarImageUrl">;
}

const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const consumptionMethod = searchParams.get("consumptionMethod");
  const handleOrdersClick = () => {
    router.push(`/${slug}/orders?consumptionMethod=${consumptionMethod}`);
  };
  return (
    <div className="relative min-h-[300px]  w-full">
      <Button
        className="absolute top-4 left-4 z-50 rounded-full"
        variant="secondary"
        size={"icon"}
        onClick={() => router.push(`/${slug}`)}
      >
        <ChevronLeftIcon />
      </Button>
      <Image
        src={restaurant.coverImageUrl}
        alt={restaurant.name}
        fill
        className="object-cover object-cente md:hidden"
      />
      <div className="absolute hidden md:block inset-0 bg-destructive ">
        <Image
          src={restaurant.avatarImageUrl}
          alt={restaurant.name}
          width={70}
          height={70}
          className="rounded-full absolute top-0 bottom-0 left-0 right-0 m-auto"
        />
      </div>
      <Button
        className="absolute top-4 right-4 z-50 rounded-full"
        variant="secondary"
        size={"icon"}
        onClick={handleOrdersClick}
      >
        <ScrollTextIcon />
      </Button>
    </div>
  );
};

export default RestaurantHeader;
