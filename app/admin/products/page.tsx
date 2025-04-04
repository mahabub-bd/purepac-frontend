import { ProductList } from "@/components/admin/dashboard/products/product-list";

export default function ProductsPage() {
  return (
    <div className="flex flex-col w-full h-full p-4 space-y-4">
      <ProductList />
    </div>
  );
}
