import CategoriesList from "@/components/homepage/Category/categories-list";
import FeaturedProducts from "@/components/products/featured-products";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <CategoriesList />
      <FeaturedProducts />
    </main>
  );
}
