import { fetchData } from "@/utils/api-utils";
import { Product } from "@/utils/types";
import ProductCard from "./product-card";

export default async function FeaturedProducts() {
  const products: Product[] = await fetchData("products");

  return (
    <div className="container mx-auto md:py-10 py-5">
      <h1 className="mb-8 text-3xl font-bold text-center">Features Product</h1>
      <div className="  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
