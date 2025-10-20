"use client";
import { Prisma } from "@prisma/client";
import { ClockIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/helpers/format-currency";

import CartSheet from "../[productId]/components/cart-sheet";
import { CartContext } from "../contexts/cart";
import ProductsList from "./products";

interface RestaurantCategoriesProps {
  restaurant: Prisma.RestaurantGetPayload<{
    include: { menuCategories: { include: { product: true } } };
  }>;
}

type MenuCategoryWithProducts = Prisma.MenuCategoryGetPayload<{
  include: { product: true };
}>;

const RestaurantCategories = ({ restaurant }: RestaurantCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] =
    useState<MenuCategoryWithProducts>(restaurant.menuCategories[0]);
  const { products, totalQuantity, total, toggleCart } =
    useContext(CartContext);

  const handleCategoryClick = (category: MenuCategoryWithProducts) => {
    setSelectedCategory(category);
  };
  const getCategoryButtonVariant = (category: MenuCategoryWithProducts) => {
    return category.id === selectedCategory.id ? "default" : "secondary";
  };
  return (
    <div className="flex flex-col overflow-y-auto bg-white rounded-t-3xl ">
      <div className="p-5">
        <div className="flex items-center gap-3">
          <Image
            src={restaurant.avatarImageUrl}
            alt={restaurant.name}
            width={45}
            height={45}
          />
          <div>
            <h2 className="text-lg font-semibold">{restaurant.name}</h2>
            <p className="text-xs-opacity-55">{restaurant.description}</p>
          </div>
        </div>
        <div className="flex mt-3 items-center gap-1 text-sm text-green-500">
          <ClockIcon size={12} />
          <p>Aberto!</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ScrollArea className="w-full">
          <div className="flex w-max space-x-4 p-4 pt-0">
            {restaurant.menuCategories.map((category) => (
              <Button
                onClick={() => handleCategoryClick(category)}
                key={category.id}
                variant={getCategoryButtonVariant(category)}
                size="sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <h3 className="px-5 pt-2 text-lg font-semibold">
          {selectedCategory.name}
        </h3>
        {selectedCategory.product.length > 0 && (
          <div className="p-5">
            <ProductsList products={selectedCategory.product} />
          </div>
        )}
        {products.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 flex w-full items-center justify-between border-t bg-white px-5 py-3">
            <div>
              <p className="text-xs text-muted-foreground">Total dos pedidos</p>
              <p className="text-sm font-semibold">
                {formatCurrency(total)}
                <span className="text-xs text-muted-foreground font-normal">
                  / {totalQuantity} {totalQuantity > 1 ? "itens" : "item"}
                </span>
              </p>
            </div>
            <Button onClick={toggleCart}>Ver pedido</Button>
            <CartSheet />
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantCategories;
