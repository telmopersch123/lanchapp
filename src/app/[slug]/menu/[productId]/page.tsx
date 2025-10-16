import { serializeDecimal } from "@/data/get-restaurant-by-slug";
import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetails from "./components/product-details";
import ProductHeader from "./components/productHeader";

interface ProductPageProps {
  params: Promise<{ slug: string; productId: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug, productId } = await params;

  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      restaurant: {
        select: {
          avatarImageUrl: true,
          name: true,
          slug: true,
        },
      },
    },
  });
  const productsConverted = serializeDecimal(product);
  if (!product) return notFound();

  if (product.restaurant.slug.toUpperCase() !== slug.toUpperCase())
    return notFound();
  return (
    <>
      <div className="flex h-full flex-col">
        <ProductHeader product={productsConverted} />
        <ProductDetails product={productsConverted} />
      </div>
    </>
  );
};

export default ProductPage;
