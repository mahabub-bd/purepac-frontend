import { fetchDataPagination } from "@/utils/api-utils";
import type { Product } from "@/utils/types";
import { PaginationComponent } from "../common/pagination";
import ProductCard from "./product-card";

interface ProductListProps {
  filterParams: {
    limit?: string;
    page?: string;
    category?: string;
    brand?: string;
    featured?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

interface PaginatedResponse {
  data: Product[];
  total: number;
  totalPages: number;
}

export default async function ProductBarList({
  filterParams,
}: ProductListProps) {
  const params = new URLSearchParams();

  Object.entries(filterParams).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, value);
    }
  });

  let response: PaginatedResponse;
  try {
    response = await fetchDataPagination<PaginatedResponse>(
      `products?${params.toString()}`
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          Error loading products. Please try again.
        </p>
      </div>
    );
  }

  const currentPage = Number.parseInt(filterParams.page || "1");

  const paginationUrls: Record<number, string> = {};

  // Generate URLs for all pages
  for (let page = 1; page <= response.totalPages; page++) {
    const newParams = new URLSearchParams(params.toString());
    newParams.set("page", page.toString());
    paginationUrls[page] = `?${newParams.toString()}`;
  }

  return (
    <div className="container mx-auto py-4 sm:px-1 md:py-5 md:px-0">
      {response.data && response.data.length > 0 ? (
        <>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {response.data.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={response.totalPages}
              paginationUrls={paginationUrls}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}
