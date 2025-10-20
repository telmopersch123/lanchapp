"use client";
import { OrderStatus, Prisma } from "@prisma/client";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useContext } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helpers/format-currency";

import { CartContext } from "../../menu/contexts/cart";
interface OrdersListProps {
  orders: Prisma.OrderGetPayload<{
    include: {
      restaurant: { select: { name: true; avatarImageUrl: true } };
      orderProduct: { include: { product: true } };
    };
  }>[];
}

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case "FINISHED":
      return "Finalizado";
    case "PENDING":
      return "Pendente";
    case "IN_PREPARATION":
      return "Em preparo";
    case "PAYMENT_CONFIRMED":
      return "Pagamento confirmado";
    case "PAYMENT_FAILED":
      return "Pagamento falhou";
  }
};

const OrdersList = ({ orders }: OrdersListProps) => {
  const { slug } = useParams<{ slug: string }>();
  const { addProduct } = useContext(CartContext);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleAddToCart = (pedidoId: number) => {
    {
      orders
        .find((order) => order.id === pedidoId)
        ?.orderProduct.map((product) =>
          addProduct({ ...product.product, quantity: product.quantity })
        );
    }
    toast.success("Pedido adicionado ao carrinho");
  };

  const handleBackClick = () => {
    router.push(
      `/${slug}/menu?consumptionMethod=${searchParams.get("consumptionMethod")}`
    );
  };
  return (
    <div className="space-y-6 p-6">
      <Button
        onClick={handleBackClick}
        size="icon"
        variant="secondary"
        className="rounded-full"
      >
        <ChevronLeftIcon />
      </Button>

      <div className="flex items-center gap-3">
        <ScrollTextIcon />
        <h2 className="text-lg font-semibold">Pedidos</h2>
      </div>
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="py-5 space-y-4">
            <div
              className={`w-fit rounded-full px-2 py-1 text-xs font-semibold text-white ${
                order.status === OrderStatus.PENDING
                  ? "bg-gray-200 text-gray-500"
                  : "bg-green-500"
              }`}
            >
              {getStatusLabel(order.status)}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative h-5 w-5">
                <Image
                  src={order.restaurant.avatarImageUrl}
                  alt={order.restaurant.name}
                  fill
                  className="object-contain rounded-sm"
                />
              </div>
              <p className="text-sm font-semibold">{order.restaurant.name}</p>
            </div>
            <Separator />
            {order.orderProduct.map((orderProduct) => (
              <div key={orderProduct.id} className="flex items-center gap-2">
                <div className="h-4 w-4 flex items-center justify-center rounded-full text-xs bg-gray-200 font-semibold">
                  <p className="text-sm text-muted-foreground">
                    {orderProduct.quantity}
                  </p>
                </div>
                <p className="text-sm">{orderProduct.product.name}</p>
                <p className="text-sm font-semibold">
                  {formatCurrency(Number(orderProduct.product.price))}
                </p>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                {formatCurrency(Number(order.total))}
              </p>
              <p
                onClick={() => handleAddToCart(order.id)}
                className="text-xs cursor-pointer text-destructive font-semibold"
              >
                Adicionar ao carrinho
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrdersList;
