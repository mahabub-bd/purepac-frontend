import { HeadingPrimary } from "@/components/common/heading-primary";
import { AnimatedCarousel } from "@/components/homepage/banner/hero/animated-carousel";
import BrandList from "@/components/homepage/brands/brand-list";
import CategoriesList from "@/components/homepage/Category/categories-list";
import { NewsletterSection } from "@/components/homepage/subscriber/newsletter";
import ProductList from "@/components/products/product-list";

export default function Home() {
  return (
    <main className="min-h-screen">
      <AnimatedCarousel />
      {/* Categories Section */}
      <section className="md:py-10 py-5 bg-gray-50">
        <div className="container mx-auto ">
          <CategoriesList endpoint="categories">
            <HeadingPrimary
              title="FEATURED CATEGORIES"
              subtitle="Get your desired product from featured category"
              className="mb-8"
            />
          </CategoriesList>
        </div>
      </section>

      {/* Best Selling Products Section */}
      <section className="md:py-10 py-5">
        <div className="container mx-auto ">
          <ProductList endpoint="products">
            <HeadingPrimary
              title="BEST SELLERS"
              subtitle="Top products loved by our customers"
              className="mb-8"
              titleClassName="text-red-600" // Add emphasis to best sellers
            />
          </ProductList>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="md:py-10 py-5 bg-gray-50">
        <div className="container mx-auto ">
          <ProductList endpoint="products">
            <HeadingPrimary
              title="FEATURED PRODUCTS"
              subtitle="Discover our most popular items"
              className="mb-8"
            />
          </ProductList>
        </div>
      </section>

      {/* Brands Section */}
      <section className="md:py-10 py-5">
        <div className="container mx-auto ">
          <BrandList endpoint="brands">
            <HeadingPrimary
              title="OUR BRANDS"
              subtitle="Shop from trusted brands you love"
              className="mb-8"
            />
          </BrandList>
        </div>
      </section>

      <section className="md:py-10 py-5 bg-gray-50">
        <div className="container mx-auto ">
          <ProductList endpoint="products/discounted?page=1&limit=20">
            <HeadingPrimary
              title="SPECIAL OFFERS"
              subtitle="Limited-time deals just for you"
              className="mb-8"
              titleClassName="text-green-600"
            />
          </ProductList>
        </div>
      </section>
      {/* Subscribe Section */}
      <section className="md:py-10 py-5 ">
        <div className="container mx-auto ">
          <NewsletterSection />
        </div>
      </section>
    </main>
  );
}
