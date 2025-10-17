import { db } from "@/lib/prisma";
import { isValidCpf, removeCpfMask } from "../menu/helpers/cpf";
import CpfForm from "./components/cpf-form";
import OrdersList from "./components/order-list";

interface OrdersPageProps {
  searchParams: Promise<{ cpf: string }>;
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const { cpf } = await searchParams;
  if (!cpf) {
    <CpfForm />;
  }

  if (!isValidCpf(cpf)) {
    return <CpfForm />;
  }
  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      customerCPF: removeCpfMask(cpf),
    },
    include: {
      restaurant: {
        select: {
          name: true,
          avatarImageUrl: true,
        },
      },
      orderProduct: {
        include: {
          product: true,
        },
      },
    },
  });
  return <OrdersList orders={orders} />;
};

export default OrdersPage;
