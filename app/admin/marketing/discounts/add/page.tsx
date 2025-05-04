import { DiscountForm } from "@/components/discount/discount-from"
import { fetchData } from "@/utils/api-utils"

import type { Product } from "@/utils/types"

export const metadata = {
  title: "Create Discount",
  description: "Create a new discount for your products",
}

export default async function NewDiscountPage() {
  // Fetch all products to allow selection in the discount form
  const products = await fetchData<Product[]>("products")

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <DiscountForm products={products} />
    </div>
  )
}
