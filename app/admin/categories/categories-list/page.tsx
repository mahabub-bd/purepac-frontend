import Loading from "@/app/loading";
import { CategoryList } from "@/components/admin/category/category-list";
import { Suspense } from "react";

export default async function CategoriesPage({
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
      : 7;

  return (
    <div className="p-6 space-y-6 border rounded-sm">
      <Suspense fallback={<Loading />}>
        <CategoryList
          initialPage={page}
          initialLimit={limit}
          initialSearchParams={resolvedParams}
        />
      </Suspense>
    </div>
  );
}
