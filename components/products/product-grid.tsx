import { fetchData } from "@/utils/api-utils";
import { Product } from "@/utils/types";
import ProductCard from "./product-card";

interface ProductListProps {
  endpoint: string;
}

export default async function ProductBarList({ endpoint }: ProductListProps) {
  const products: Product[] = await fetchData(endpoint);

  return (
    <div className="container mx-auto py-4 px-3 sm:px-4 md:py-5  md:px-0">
      {products && products?.length > 0 ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4  gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {products?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}
