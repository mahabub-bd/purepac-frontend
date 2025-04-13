import { HeadingPrimary } from "@/components/common/heading-primary";
import BrandList from "@/components/homepage/brands/brand-list";
import CategoriesList from "@/components/homepage/Category/categories-list";
import ProductList from "@/components/products/product-list";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section (add your hero component here) */}

      {/* Categories Section */}
      <section className="md:py-10 py-5 bg-gray-50">
        <div className="container mx-auto px-4">
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
        <div className="container mx-auto px-4">
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
        <div className="container mx-auto px-4">
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

      {/* Special Offers Section (optional) */}
      <section className="md:py-10 py-5 bg-gray-50">
        <div className="container mx-auto px-4">
          <ProductList endpoint="products">
            <HeadingPrimary
              title="SPECIAL OFFERS"
              subtitle="Limited-time deals just for you"
              className="mb-8"
              titleClassName="text-green-600"
            />
          </ProductList>
        </div>
      </section>
    </main>
  );
}
