import { fetchData } from "@/utils/api-utils";
import { Category, Product } from "@/utils/types";
import { HeadingPrimary } from "../common/heading-primary";
import ProductCard from "./product-card";

interface ProductListProps {
  endpoint: string;
}

export default async function CategoryBrandProductList({
  endpoint,
}: ProductListProps) {
  const response: Category[] = await fetchData(endpoint);

  const products = response?.[0]?.products;

  return (
    <div className="container mx-auto py-4 px-3 sm:px-4 md:py-8 lg:py-10 md:px-0">
      <HeadingPrimary title={response[0].name} />

      {products && products?.length > 0 ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
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
