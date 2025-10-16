import { formatCurrency } from "@/helpers/format-currency";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ProductsListProps {
  products: Product[];
}

const ProductsList = ({ products }: ProductsListProps) => {
  const { slug } = useParams<{ slug: string }>();
  return (
    <div className="space-y-3">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/${slug}/menu/${product.id}`}
          className="flex items-center justify-between gap-10 py-3 border-b"
        >
          <div>
            <h3 className="text-sm font-semibold">{product.name}</h3>
            <p className="text-sm line-clamp-2 text-muted-foreground">
              {product.description}
            </p>
            <p className="text-sm font-semibold pt-3">
              {formatCurrency(Number(product.price))}
            </p>
          </div>

          <div className="relative min-h-[82px] min-w-[120px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductsList;
