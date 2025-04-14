import CategoryBrandProductList from "@/components/products/brand-category-product-list";

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const url = `categories?slug=${slug}`;
  return <CategoryBrandProductList endpoint={url} />;
}
