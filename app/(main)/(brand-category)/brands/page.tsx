import { HeadingPrimary } from "@/components/common/heading-primary";
import BrandList from "@/components/homepage/brands/brand-list";

export default async function BrandPage() {
  return (
    <section className="md:py-10 py-5">
      <div className="container mx-auto px-4">
        <BrandList endpoint="brands">
          <HeadingPrimary
            title="OUR BRANDS"
            subtitle="Shop from trusted brands you love"
            className="mb-8"
          />
        </BrandList>
      </div>
    </section>
  );
}
