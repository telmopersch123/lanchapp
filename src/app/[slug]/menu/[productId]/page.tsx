import { serializeDecimal } from "@/data/get-restaurant-by-slug";
import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductHeader from "./components/productHeader";

interface ProductPageProps {
  params: Promise<{ slug: string; productId: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug, productId } = await params;
  const product = await db.product.findUnique({ where: { id: productId } });
  const productsConverted = serializeDecimal(product);
  if (!product) return notFound();
  return (
    <>
      <ProductHeader product={productsConverted} />
      <h1>Product Page</h1>
      {slug}
      {productId}
    </>
  );
};

export default ProductPage;
