import { HeadingPrimary } from "@/components/common/heading-primary";
import CategoriesList from "@/components/homepage/Category/categories-list";
import ProductList from "@/components/products/product-list";

export default function Home() {
  return (
    <main className="min-h-screen">
      <CategoriesList endpoint="categories">
        <HeadingPrimary
          title="FEATURED CATEGORIES"
          subtitle="Get your desired product from featured category"
        />
      </CategoriesList>
      <ProductList endpoint="products">
        <HeadingPrimary
          title="FEATURED PRODUCTS"
          subtitle="Discover our most popular items"
        />
      </ProductList>
    </main>
  );
}
