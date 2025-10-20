import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/format-currency";

import { CartContext, CartProduct } from "../contexts/cart";

interface CartItemProps {
  item: CartProduct;
}

const CartItem = ({ item }: CartItemProps) => {
  const { decreaseCart, increaseCart, removeProduct } = useContext(CartContext);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative h-20 w-20 rounded-lg bg-gray-100 ">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-contain"
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs max-w-[90%] truncate text-ellipsis">
            {item.name}
          </p>
          <p className="text-sm font-semibold">
            {formatCurrency(Number(item.price))}
          </p>
          <div className="flex items-center gap-1 text-center">
            <Button
              onClick={() => decreaseCart(item.id)}
              variant={"outline"}
              className="h-6 w-6 rounded-lg"
            >
              <ChevronLeftIcon />
            </Button>
            <p className="text-xs text-muted-foreground w-5">{item.quantity}</p>
            <Button
              onClick={() => increaseCart(item.id)}
              variant={"destructive"}
              className="h-6 w-6 rounded-lg"
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>
      <Button
        title="Remover"
        onClick={() => removeProduct(item.id)}
        className="h-7 w-7 rounded-lg"
        variant={"outline"}
      >
        <TrashIcon />
      </Button>
    </div>
  );
};

export default CartItem;
