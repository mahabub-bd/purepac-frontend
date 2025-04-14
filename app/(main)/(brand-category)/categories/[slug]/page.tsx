import CategoryBrandProductList from "@/components/products/brand-category-product-list";
import { SortBar } from "@/components/products/sort-bar";
import { buildQueryString } from "@/utils/api-utils";

export default async function BrandPage({
  searchParams,
  params,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    featured?: string;
  }>;
}) {
  const queryParams = {
    slug: (await params).slug,
    sort: (await searchParams).sort,
    minPrice: (await searchParams).minPrice,
    maxPrice: (await searchParams).maxPrice,
    featured: (await searchParams).featured,
  };

  const url = `categories?${buildQueryString(queryParams)}`;

  return (
    <div className="container mx-auto px-4 py-4">
      <SortBar currentSort={(await searchParams).sort} />
      <CategoryBrandProductList endpoint={url} path="brands" />
    </div>
  );
}
