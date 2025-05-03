import { getUser } from "@/actions/auth";
import { CartPage } from "@/components/cart/cart-page";

import { fetchProtectedData } from "@/utils/api-utils";
import { Cart } from "@/utils/types";

export default async function CartPageComponent() {
  const user = await getUser();
  const cart = user ? await fetchProtectedData<Cart>("cart") : null;

  return <CartPage cart={cart ?? undefined} />;
}
