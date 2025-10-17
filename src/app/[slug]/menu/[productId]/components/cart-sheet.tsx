import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useContext } from "react";
import CartItem from "../../components/cart-item";
import { CartContext } from "../../contexts/cart";

const CartSheet = () => {
  const { isOpen, toggleCart, products } = useContext(CartContext);
  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-[80%]">
        <SheetHeader>
          <SheetTitle className="text-left border-b">Carrinho</SheetTitle>
        </SheetHeader>
        <div className="py-5">
          {products.map((product) => (
            <CartItem key={product.id} item={product} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
