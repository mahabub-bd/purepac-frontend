import { ProductList } from "@/components/admin/products/product-list";
import { ProductListSkeleton } from "@/components/admin/products/product-list-skeleton";
import { Suspense } from "react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const page =
    typeof resolvedParams.page === "string"
      ? Number.parseInt(resolvedParams.page)
      : 1;
  const limit =
    typeof resolvedParams.limit === "string"
      ? Number.parseInt(resolvedParams.limit)
      : 8;

  return (
    <div className="p-6 space-y-6">
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList
          initialPage={page}
          initialLimit={limit}
          initialSearchParams={resolvedParams}
        />
      </Suspense>
    </div>
  );
}
