"use client";
import { useEffect, useState } from "react";

import PopupFinished from "../[productId]/components/popupFinished";

interface LastOrder {
  id: number;
  status: string;
}

interface PopupHandlerProps {
  cpf: string | null;
}

const PopupHandler = ({ cpf }: PopupHandlerProps) => {
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    if (!cpf) return;

    const prevOrderIdKey = `prevOrderId-${cpf}`;
    const storedPrevOrderId = sessionStorage.getItem(prevOrderIdKey);

    const fetchLastOrder = async () => {
      const res = await fetch(`/api/last-order?cpf=${cpf}`);
      const data: { lastOrder: LastOrder | null } = await res.json();
      if (!data.lastOrder) return;
      // caso 1: nunca teve pedido antes (CPF novo)
      if (!storedPrevOrderId && data.lastOrder.status === "PAYMENT_CONFIRMED") {
        setLastOrder(data.lastOrder);
        sessionStorage.setItem(prevOrderIdKey, data.lastOrder.id.toString());
        return;
      }
      // caso 2: já tinha pedido, verifica se é novo
      if (
        data.lastOrder.status === "PAYMENT_CONFIRMED" &&
        data.lastOrder.id.toString() !== storedPrevOrderId
      ) {
        setLastOrder(data.lastOrder);
        sessionStorage.setItem(prevOrderIdKey, data.lastOrder.id.toString());
      }
    };

    fetchLastOrder();
  }, [cpf]);

  if (!lastOrder || lastOrder.status !== "PAYMENT_CONFIRMED") return null;

  return <PopupFinished />;
};

export default PopupHandler;
