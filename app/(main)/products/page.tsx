import { ProductFilters } from "@/components/products/product-filters";
import ProductBarList from "@/components/products/product-grid";
import { SortBar } from "@/components/products/sort-bar";
import { buildQueryString, fetchData } from "@/utils/api-utils";
import { Brand, Category } from "@/utils/types";

async function fetchCategories() {
  try {
    const data: Category[] = await fetchData("categories");
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function fetchBrands() {
  try {
    const data: Brand[] = await fetchData("brands");
    return data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

const priceRanges = [
  { min: 0, max: 5000, label: "Under BDT 5,000" },
  { min: 5000, max: 10000, label: "BDT 5,000 - 10,000" },
  { min: 10000, max: 50000, label: "BDT 10,000 - 50,000" },
  { min: 50000, max: 100000, label: "BDT 50,000 - 100,000" },
  { min: 100000, max: Number.POSITIVE_INFINITY, label: "Above BDT 100,000" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    limit?: string;
    category?: string;
    brand?: string;
    featured?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const [categories, brands] = await Promise.all([
    fetchCategories(),
    fetchBrands(),
  ]);

  const productsEndpoint = `products?${buildQueryString({
    limit: (await searchParams).limit || "20",
    category: (await searchParams).category,
    brand: (await searchParams).brand,
    featured: (await searchParams).featured,
    sort: (await searchParams).sort,
    minPrice: (await searchParams).minPrice,
    maxPrice: (await searchParams).maxPrice,
  })}`;

  return (
    <div className="container mx-auto px-4 py-4">
      <SortBar currentSort={(await searchParams).sort} />
      <div className="flex flex-col md:flex-row justify-between gap-6 ">
        <ProductFilters
          categories={categories}
          brands={brands}
          priceRanges={priceRanges}
          currentCategory={(await searchParams).category}
          currentBrand={(await searchParams).brand}
          currentFeatured={(await searchParams).featured === "true"}
          currentPriceRange={{
            min: (await searchParams).minPrice,
            max: (await searchParams).maxPrice,
          }}
        />

        <ProductBarList endpoint={productsEndpoint} />
      </div>
    </div>
  );
}
