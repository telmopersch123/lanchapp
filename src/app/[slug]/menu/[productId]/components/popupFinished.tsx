"use client";

import { CheckCircleIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PopupFinished = () => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("cpf");
    const newUrl =
      params.toString().length > 0 ? `?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });

    setOpen(false);
  };
  const handleViewOrders = () => {
    const params = new URLSearchParams(searchParams.toString());
    const pathParts = pathname.split("/");
    const slug = pathParts[1];
    router.push(`/${slug}/orders?${params.toString()}`);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
        setOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[380px] rounded-2xl">
        <DialogHeader className="flex flex-col items-center">
          <CheckCircleIcon className="text-green-500 w-10 h-10 mb-2" />
          <DialogTitle className="text-xl text-center">
            Pedido Finalizado
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Seu pedido foi realizado com sucesso!
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-center m-auto gap-3 mt-4">
          <Button variant="destructive" onClick={handleViewOrders}>
            Ver Pedidos
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PopupFinished;
