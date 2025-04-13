// components/brand-list.tsx
import { fetchData } from "@/utils/api-utils";
import { Brand } from "@/utils/types";
import BrandCard from "./brand-card";

import { ReactNode, Suspense } from "react";
import BrandSkeleton from "./brand-skeleton";

export default async function BrandList({
  children,
  endpoint,
}: {
  children: ReactNode;
  endpoint: string;
}) {
  const brands: Brand[] = await fetchData(endpoint);

  return (
    <div className="container mx-auto md:py-10 py-5 md:px-0 px-2">
      {children}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <Suspense fallback={<BrandSkeleton />}>
          {brands.map((brand: Brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
