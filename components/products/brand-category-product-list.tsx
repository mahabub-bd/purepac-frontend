import { fetchData } from "@/utils/api-utils";
import { Brand, Category, Product } from "@/utils/types";
import { HeadingPrimary } from "../common/heading-primary";
import ProductCard from "./product-card";

interface ProductListProps {
  endpoint: string;
  path: "brands" | "categories";
  searchParams?: {
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default async function CategoryBrandProductList({
  endpoint,
  path,
}: ProductListProps) {
  let title = "";
  let products: Product[] = [];

  try {
    const response = (await fetchData(endpoint)) as unknown;

    if (path === "brands" && Array.isArray(response)) {
      const brand = response[0] as Brand;
      title = brand?.name || "";
      products = brand?.products || [];
    } else {
      const category = Array.isArray(response)
        ? (response[0] as Category)
        : null;
      title = category?.name || "";
      products = category?.products || [];
    }
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
  }

  return (
    <div className="container mx-auto py-4 px-3 sm:px-4 md:py-8 lg:py-10 md:px-0">
      <HeadingPrimary title={title} />

      {products.length > 0 ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {products.map((product: Product) => (
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
