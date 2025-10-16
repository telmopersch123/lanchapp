"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { formatCurrency } from "@/helpers/format-currency";
import { Prisma } from "@prisma/client";
import { ChefHatIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";
import { CartContext } from "../../contexts/card";
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
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleAddToCart = () => {
    addProduct({ ...product, quantity });
    toggleCart();
  };

  return (
    <>
      <div className="relative flex flex-col z-50 rounded-t-3xl px-5 py-5 mt-[-1.5rem] flex-auto overflow-hidden">
        <div className="flex-auto overflow-hidden">
          <div className="flex items-center gap-1 ">
            <Image
              src={product.restaurant.avatarImageUrl}
              alt={product.restaurant.name}
              width={16}
              height={16}
              className="rounded-full"
            />
            <p className="text-xs text-muted-foreground">
              {product.restaurant.name}
            </p>
          </div>
          <h2 className="mt-1 text-xl font-semibold">{product.name}</h2>

          <div className="flex items-center justify-between mt-3">
            <h3 className="text-xl font-semibold">
              {formatCurrency(Number(product.price))}
            </h3>
            <div className="flex items-center gap-3 text-center">
              <Button
                onClick={handleDecrement}
                variant="outline"
                className="rounded-xl h-8 w-8"
              >
                <ChevronLeftIcon />
              </Button>
              <p className="w-4">{quantity}</p>
              <Button
                onClick={handleIncrement}
                variant="destructive"
                className="rounded-xl h-8 w-8"
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-full">
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold">Sobre</h4>
              <p className="text-sm  text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-1.5">
                <ChefHatIcon size={18} />
                <h4 className="font-semibold">Ingredientes</h4>
              </div>
              <ul className="list-disc px-5 text-sm text-muted-foreground">
                {product.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </ScrollArea>
        </div>
        <Button onClick={handleAddToCart} className="w-full rounded-full">
          Adicionar no Carrinho
        </Button>
      </div>
      <CartSheet />
    </>
  );
};

export default ProductDetails;
