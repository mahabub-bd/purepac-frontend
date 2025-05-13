import { postData } from "@/utils/api-utils";
import type { Address, CartItem } from "@/utils/types";
import { toast } from "sonner";

interface OrderData {
  addressId: number;
  userId: string | null;
  shippingMethodId: number;
  paymentMethodId: number;
  items: { productId: number; quantity: number }[];
  couponId: number | null;
  totalValue: number;
}

export async function createAddress(addressData: {
  userId: string;
  street: string;
  city: string;
  division: string;
  type: string;
  isDefault: boolean;
}) {
  try {
    const response = await postData("addresses", addressData);
    return response.data;
  } catch (error) {
    console.error("Error creating address:", error);
    throw new Error("Failed to create address");
  }
}

export async function placeOrder(orderData: OrderData) {
  try {
    const response = await postData("orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Order submission error:", error);
    throw new Error("Failed to place order");
  }
}

export async function processCheckout({
  user,
  selectedAddress,
  formData,
  showAddressForm,
  cart,
  selectedShippingMethod,
  selectedPaymentMethod,
  paymentMethods,
  appliedCoupon,
  total,
  clearCart,
}: {
  user: any;
  selectedAddress: Address | null;
  formData: any;
  showAddressForm: boolean;
  cart: { items: CartItem[] };
  selectedShippingMethod: string;
  selectedPaymentMethod: string;
  paymentMethods: any[];
  appliedCoupon: any;
  total: number;
  clearCart: () => Promise<void>;
}) {
  let addressId: number;

  // If showing form but no address selected, create a new address first
  if (!selectedAddress && showAddressForm && user?.id) {
    try {
      const newAddressData = {
        userId: user.id,
        street: formData.address,
        city: formData.city,
        division: formData.country,
        type: "shipping",
        isDefault: false, // Don't make default automatically
      };

      // Create new address
      const newAddress = await createAddress(newAddressData);
      addressId = newAddress.id;
    } catch (error) {
      toast.error("Failed to create address");
      throw error;
    }
  } else if (selectedAddress) {
    // Use selected address
    addressId = selectedAddress.id;
  } else {
    toast.error("No address selected");
    throw new Error("No address selected");
  }

  // Place the order with the address
  const orderData: OrderData = {
    addressId: addressId,
    userId: user?.id || null,
    shippingMethodId: Number(selectedShippingMethod),
    paymentMethodId: paymentMethods.find(
      (method) => method.code === selectedPaymentMethod
    )?.id,
    items: cart.items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
    couponId: appliedCoupon?.id || null,
    totalValue: total,
  };

  const orderResponse = await placeOrder(orderData);
  await clearCart();

  return orderResponse;
}
