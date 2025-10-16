"use client";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductHeaderProps {
  product: Pick<Product, "name" | "imageUrl">;
}

const ProductHeader = ({ product }: ProductHeaderProps) => {
  const router = useRouter();
  return (
    <div className="relative w-full h-[300px]">
      <Button
        className="absolute top-4 left-4 z-50 rounded-full"
        variant="secondary"
        size={"icon"}
        onClick={() => router.back()}
      >
        <ChevronLeftIcon />
      </Button>
      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        className="object-contain"
      />
      <Button
        className="absolute top-4 right-4 z-50 rounded-full"
        variant="secondary"
        size={"icon"}
      >
        <ScrollTextIcon />
      </Button>
    </div>
  );
};

export default ProductHeader;
