import { fetchData } from "@/utils/api-utils";
import { Product } from "@/utils/types";
import ProductCard from "./product-card";

import { ReactNode, Suspense } from "react";
import { ProductSkeleton } from "./product-skeleton";

export default async function ProductList({
  children,
  endpoint,
}: {
  children: ReactNode;
  endpoint: string;
}) {
  const products: Product[] = await fetchData(endpoint);

  return (
    <div className="container mx-auto md:py-10 py-5 md:px-0 px-2">
      {children}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <Suspense fallback={<ProductSkeleton />}>
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
