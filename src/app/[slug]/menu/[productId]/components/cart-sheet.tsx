import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/helpers/format-currency";
import { useContext, useState } from "react";
import CartItem from "../../components/cart-item";
import { CartContext } from "../../contexts/cart";
import FinishOrder from "./finish-order";

const CartSheet = () => {
  const [finishOrder, setFinishOrder] = useState(false);
  const { isOpen, toggleCart, products, total } = useContext(CartContext);
  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-[80%]">
        <SheetHeader>
          <SheetTitle className="text-left border-b">Carrinho</SheetTitle>
        </SheetHeader>
        <div className="py-5 flex flex-col h-full">
          <div className="flex-auto">
            {products.map((product) => (
              <CartItem key={product.id} item={product} />
            ))}
          </div>
          <Card className="mb-6">
            <CardContent className="p-5">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-sm font-semibold">{formatCurrency(total)}</p>
              </div>
            </CardContent>
          </Card>
          <Button className="w-full" onClick={() => setFinishOrder(true)}>
            Finalizar Pedido
          </Button>
          <FinishOrder open={finishOrder} setOpen={setFinishOrder} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
