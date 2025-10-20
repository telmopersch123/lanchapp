"use client";
import { Prisma } from "@prisma/client";
import { ChefHatIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/helpers/format-currency";

import { CartContext } from "../../contexts/cart";
import CartSheet from "./cart-sheet";

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          avatarImageUrl: true;
          name: true;
        };
      };
    };
  }>;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { toggleCart, addProduct } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleIncrement = () => setQuantity((prev) => prev + 1);

  const handleAddToCart = () => {
    addProduct({ ...product, quantity });
    toggleCart();
  };

  return (
    <>
      <div className="relative flex flex-col z-50 rounded-t-3xl px-5 py-5 mt-[-1.5rem] flex-auto overflow-hidden md:px-10 md:py-8 md:mt-[-2rem] md:gap-6">
        <div className="flex-auto overflow-hidden">
          <div className="flex items-center gap-1 md:gap-2">
            <Image
              src={product.restaurant.avatarImageUrl}
              alt={product.restaurant.name}
              width={16}
              height={16}
              className="rounded-full md:w-6 md:h-6"
            />
            <p className="text-xs text-muted-foreground md:text-sm">
              {product.restaurant.name}
            </p>
          </div>

          <h2 className="mt-1 text-xl font-semibold md:text-2xl">
            {product.name}
          </h2>

          <div className="flex items-center justify-between mt-3 md:mt-5">
            <h3 className="text-xl font-semibold md:text-2xl">
              {formatCurrency(Number(product.price))}
            </h3>
            <div className="flex items-center gap-3 text-center">
              <Button
                onClick={handleDecrement}
                variant="outline"
                className="rounded-xl h-8 w-8 md:h-10 md:w-10"
              >
                <ChevronLeftIcon />
              </Button>
              <p className="w-4 text-sm md:w-6 md:text-base">{quantity}</p>
              <Button
                onClick={handleIncrement}
                variant="destructive"
                className="rounded-xl h-8 w-8 md:h-10 md:w-10"
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-64 mt-6 md:h-80">
            <div className="space-y-3">
              <h4 className="font-semibold text-base md:text-lg">Sobre</h4>
              <p className="text-sm text-muted-foreground md:text-base">
                {product.description}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-1.5">
                <ChefHatIcon size={18} />
                <h4 className="font-semibold text-base md:text-lg">
                  Ingredientes
                </h4>
              </div>
              <ul className="list-disc px-5 text-sm text-muted-foreground md:text-base">
                {product.ingredients.length === 0 && (
                  <li>Ingredientes não informados</li>
                )}
                {product.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </ScrollArea>
        </div>

        <Button
          onClick={handleAddToCart}
          className="w-full rounded-full mt-4 md:mt-6 py-3 md:py-4 text-base md:text-lg"
        >
          Adicionar no Carrinho
        </Button>
      </div>
      <CartSheet />
    </>
  );
};

export default ProductDetails;
