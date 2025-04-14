import { fetchData } from "@/utils/api-utils";
import { Product } from "@/utils/types";
import { ReactNode } from "react";
import ProductCard from "./product-card";

export default async function ProductList({
  children,
  endpoint,
}: {
  children: ReactNode;
  endpoint: string;
}) {
  const products: Product[] = await fetchData(endpoint);

  return (
    <div className="container mx-auto py-4 px-3 sm:px-4 md:py-8 lg:py-10 md:px-0">
      {children}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {products?.slice(0, 10)?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
