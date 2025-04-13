import { HeadingPrimary } from "@/components/common/heading-primary";
import ProductList from "@/components/products/product-list";

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div>
      <ProductList endpoint="products">
        <HeadingPrimary
          title={slug}
          subtitle="Discover our most popular items"
        />
      </ProductList>
    </div>
  );
}
