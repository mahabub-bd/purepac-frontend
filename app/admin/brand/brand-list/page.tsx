import Loading from "@/app/loading";
import { BrandList } from "@/components/admin/brand/brand-list";
import { Suspense } from "react";

export default async function BrandsPage({
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
      : 10;

  return (
    <div className="p-6 space-y-6 border rounded-sm">
      <Suspense fallback={<Loading />}>
        <BrandList
          initialPage={page}
          initialLimit={limit}
          initialSearchParams={resolvedParams}
        />
      </Suspense>
    </div>
  );
}
