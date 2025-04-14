import { fetchData } from "@/utils/api-utils";
import { Brand } from "@/utils/types";
import { ReactNode, Suspense } from "react";
import BrandCard from "./brand-card";
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
    <div className="container mx-auto py-4 px-3 sm:px-4 md:py-8 lg:py-10">
      {children}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        <Suspense
          fallback={
            <div className="col-span-full grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {[...Array(6)].map((_, i) => (
                <BrandSkeleton key={i} />
              ))}
            </div>
          }
        >
          {brands?.map((brand: Brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}
