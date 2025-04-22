import Loading from "@/app/loading";
import { MenuList } from "@/components/admin/menu/menu-list";
import { Suspense } from "react";

export default async function MenusPage({
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
        <MenuList
          initialPage={page}
          initialLimit={limit}
          initialSearchParams={resolvedParams}
        />
      </Suspense>
    </div>
  );
}
