"use client";

import type React from "react";

import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  MapPin,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CartItemProductPage } from "@/components/cart/cart-item-product-page";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCartContext } from "@/contexts/cart-context";
import { cn, formatCurrencyEnglish } from "@/lib/utils";
import { fetchData } from "@/utils/api-utils";
import type {
  CartItem,
  PaymentMethod,
  ShippingMethod,
  User as UserType,
} from "@/utils/types";
import { Loader2 } from "lucide-react";
import { OtpVerificationModal } from "../auth/otp-verification-modal";
import { AddressSelector } from "./address-selector";

// Define the Address interface based on the API response
interface Address {
  id: number; // Change from string to number to match the API response
  street: string;
  area?: string;
  city: string;
  division: string;
  type: string;
  isDefault: boolean;
}

export default function CheckoutPage({ user }: { user?: UserType }) {
  const router = useRouter();
  const { getCartTotals, clearCart, cart, appliedCoupon } = useCartContext();

  const { originalSubtotal, discountedSubtotal, itemCount, productDiscounts } =
    getCartTotals();

  // Fetch states
  const [isLoadingShippingMethods, setIsLoadingShippingMethods] =
    useState(true);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(true);

  // Data states
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Selected states
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

  // Account creation state
  const [createAccount, setCreateAccount] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Address state
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // Calculate shipping cost based on selected method
  const shippingCost = shippingMethods.find(
    (method) => method.id.toString() === selectedShippingMethod
  )?.cost
    ? Number.parseFloat(
        shippingMethods.find(
          (method) => method.id.toString() === selectedShippingMethod
        )?.cost || "0"
      )
    : 0;

  const couponDiscount = appliedCoupon?.discount || 0;
  const total = discountedSubtotal + shippingCost - couponDiscount;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: user?.mobileNumber || "",
    address: "",
    city: "",
    country: "Bangladesh",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Fetch shipping methods and payment methods
  useEffect(() => {
    const fetchShippingMethods = async () => {
      setIsLoadingShippingMethods(true);
      try {
        const response = await fetchData("shipping-methods");
        setShippingMethods(response as ShippingMethod[]);
        if ((response as ShippingMethod[]).length > 0) {
          setSelectedShippingMethod(
            (response as ShippingMethod[])[0].id.toString()
          );
        }
      } catch (error) {
        console.error("Error fetching shipping methods:", error);
        toast.error("Failed to load shipping methods");
      } finally {
        setIsLoadingShippingMethods(false);
      }
    };

    const fetchPaymentMethods = async () => {
      setIsLoadingPaymentMethods(true);
      try {
        const response = await fetchData("order-payment-methods");
        // Filter out bKash payment method
        const filteredMethods = (response as PaymentMethod[]).filter(
          (method) => method.code !== "bkash"
        );
        setPaymentMethods(filteredMethods);
        if (filteredMethods.length > 0) {
          setSelectedPaymentMethod(filteredMethods[0].code);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        toast.error("Failed to load payment methods");
      } finally {
        setIsLoadingPaymentMethods(false);
      }
    };

    fetchShippingMethods();
    fetchPaymentMethods();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const isFieldInvalid = (name: keyof typeof form) => {
    if (!touched[name]) return false;
    if (name === "name" || name === "email" || name === "address") {
      return !form[name];
    }
    return false;
  };

  const handleVerifyPhone = () => {
    if (!form.phone) {
      toast.error("Phone number is required", {
        description: "Please enter your phone number to continue",
      });
      return;
    }

    // const formattedPhone = form.phone.startsWith("+")
    //   ? form.phone
    //   : form.phone.startsWith("0")
    //   ? `+88${form.phone}`
    //   : `+880${form.phone}`;

    setIsOtpModalOpen(true);
  };

  const handleOtpSuccess = (newUserId: string) => {
    setIsVerified(true);
    setUserId(newUserId);
    toast.success("Phone verified", {
      description: "Your phone number has been verified successfully",
    });
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setShowAddressForm(false);

    setForm({
      ...form,
      address: address.street,
      city: address.city,
      country: address.division,
    });
  };

  const handleAddNewAddress = () => {
    setSelectedAddress(null);
    setShowAddressForm(true);

    setForm({
      ...form,
      address: "",
      city: "",
      country: "Bangladesh",
    });
  };

  const handleSubmit = async () => {
    // Mark all fields as touched for validation
    const allTouched = Object.keys(form).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    if (!form.name || !form.email || !form.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    // If guest user wants to create account but hasn't verified phone
    if (createAccount && !user && !isVerified) {
      toast.error("Phone verification required", {
        description: "Please verify your phone number to create an account",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate placing order
      await new Promise((res) => setTimeout(res, 1500));

      toast.success("Order placed successfully!");
      await clearCart();
      router.push("/thank-you"); // You can create this page
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If cart is empty, show message and redirect button
  if (!cart?.items?.length) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Truck className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-8 text-muted-foreground">
          Add some items to your cart before proceeding to checkout
        </p>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const isLoading = isLoadingShippingMethods || isLoadingPaymentMethods;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Checkout</h1>
          <p className="mt-1 text-muted-foreground">
            Complete your order by providing your details below
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild className="mt-4 sm:mt-0">
          <Link href="/cart" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to cart
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading checkout information...
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b pb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">
                    Shipping Information
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your shipping address details
                  </p>
                </div>
              </div>

              <div className="space-y-5 px-1">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center">
                    Full Name <span className="ml-1 text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={cn(isFieldInvalid("name") && "border-red-500")}
                    placeholder="Enter your full name"
                  />
                  {isFieldInvalid("name") && (
                    <p className="text-xs text-red-500">Name is required</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      Email <span className="ml-1 text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={cn(
                        isFieldInvalid("email") && "border-red-500"
                      )}
                      placeholder="Enter your email address"
                    />
                    {isFieldInvalid("email") && (
                      <p className="text-xs text-red-500">Email is required</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center">
                      Phone Number <span className="ml-1 text-red-500">*</span>
                    </Label>
                    <div className="flex">
                      <Input
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className={cn(
                          "flex-1",
                          (isVerified || user) && "border-green-500 pr-10"
                        )}
                        disabled={!!user}
                      />
                      {!user ? (
                        !isVerified ? (
                          <Button
                            type="button"
                            variant="secondary"
                            className="ml-2 whitespace-nowrap"
                            onClick={handleVerifyPhone}
                          >
                            Verify
                          </Button>
                        ) : (
                          <div className="relative">
                            <Badge className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-500">
                              Verified
                            </Badge>
                          </div>
                        )
                      ) : (
                        <div className="relative">
                          <Badge className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-500">
                            Verified
                          </Badge>
                        </div>
                      )}
                    </div>
                    {user && (
                      <p className="text-xs text-muted-foreground">
                        Your verified phone number is associated with your
                        account
                      </p>
                    )}
                  </div>
                </div>

                {/* Address Selection */}
                {user && (
                  <div className="mb-4">
                    <AddressSelector
                      userId={String(user.id)}
                      onAddressSelect={(address) =>
                        handleAddressSelect(address as Address)
                      }
                      onAddNewClick={handleAddNewAddress}
                    />
                  </div>
                )}

                {/* Address Form */}
                {showAddressForm && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center">
                        Address <span className="ml-1 text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={cn(
                          isFieldInvalid("address") && "border-red-500"
                        )}
                        placeholder="Enter your street address"
                      />
                      {isFieldInvalid("address") && (
                        <p className="text-xs text-red-500">
                          Address is required
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Enter your city"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        placeholder="Enter your country"
                      />
                    </div>
                  </>
                )}

                {!user && (
                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox
                      id="create-account"
                      checked={createAccount}
                      onCheckedChange={(checked) =>
                        setCreateAccount(checked === true)
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="create-account"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Create an account for faster checkout
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Save your information for future orders
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Method */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-4">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">Shipping Method</h2>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred delivery option
                  </p>
                </div>
              </div>

              <div className="px-1">
                {shippingMethods.length > 0 ? (
                  <RadioGroup
                    value={selectedShippingMethod}
                    onValueChange={setSelectedShippingMethod}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    {shippingMethods.map((method) => (
                      <div
                        key={method.id}
                        className={cn(
                          "flex items-center justify-between rounded-lg border p-4",
                          selectedShippingMethod === method.id.toString() &&
                            "border-primary bg-primary/5"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={method.id.toString()}
                            id={`shipping-${method.id}`}
                          />
                          <Label
                            htmlFor={`shipping-${method.id}`}
                            className="flex cursor-pointer flex-col"
                          >
                            <span className="font-medium">{method.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {method.deliveryTime}
                            </span>
                          </Label>
                        </div>
                        <span className="font-medium">
                          {formatCurrencyEnglish(
                            Number.parseFloat(method.cost)
                          )}
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No shipping methods available
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">Payment Method</h2>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred payment option
                  </p>
                </div>
              </div>

              <div className="px-1">
                {paymentMethods.length > 0 ? (
                  <RadioGroup
                    value={selectedPaymentMethod}
                    onValueChange={setSelectedPaymentMethod}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={cn(
                          "flex items-center justify-between rounded-lg border p-4",
                          selectedPaymentMethod === method.code &&
                            "border-primary bg-primary/5"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={method.code}
                            id={`payment-${method.id}`}
                          />
                          <Label
                            htmlFor={`payment-${method.id}`}
                            className="flex cursor-pointer flex-col"
                          >
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2" />
                              <span className="font-medium">{method.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {method.description}
                            </span>
                          </Label>
                        </div>
                        {!method.isActive && (
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-600 border-yellow-200"
                          >
                            Inactive
                          </Badge>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No payment methods available
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h2 className="text-lg font-semibold">
                  Order Items ({itemCount})
                </h2>
                <p className="text-sm text-muted-foreground">
                  Review your items before placing your order
                </p>
              </div>

              <div className="space-y-4 divide-y">
                {cart?.items.map((item: CartItem) => (
                  <div key={item.id} className="pt-4 first:pt-0">
                    <CartItemProductPage item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-4 border rounded-lg p-5 bg-background/50 backdrop-blur-sm">
              <div className="border-b pb-4 mb-4">
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrencyEnglish(originalSubtotal)}</span>
                  </div>

                  {productDiscounts > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Product Discounts</span>
                      <span>-{formatCurrencyEnglish(productDiscounts)}</span>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <div className="flex items-center">
                        <span>Coupon</span>
                        <Badge
                          variant="outline"
                          className="ml-2 bg-green-50 text-green-600 border-green-200"
                        >
                          {appliedCoupon.code.toUpperCase()}
                        </Badge>
                      </div>
                      <span>
                        -{formatCurrencyEnglish(appliedCoupon.discount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatCurrencyEnglish(shippingCost)}</span>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-lg">
                      {formatCurrencyEnglish(total)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  size="lg"
                  className="mt-2 w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>

                <div className="mt-4 space-y-3">
                  {selectedShippingMethod && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>
                        Delivery via{" "}
                        {shippingMethods.find(
                          (m) => m.id.toString() === selectedShippingMethod
                        )?.name || "Selected shipping method"}
                      </span>
                    </div>
                  )}
                  {selectedPaymentMethod && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      <span>
                        Payment via{" "}
                        {paymentMethods.find(
                          (m) => m.code === selectedPaymentMethod
                        )?.name || "Selected payment method"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Secure checkout process</span>
                  </div>
                  {user ? (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <User className="h-4 w-4" />
                      <span>
                        Signed in as {user.email || user.mobileNumber}
                      </span>
                    </div>
                  ) : (
                    createAccount &&
                    isVerified && (
                      <div className="flex items-center gap-2 text-xs text-green-600">
                        <User className="h-4 w-4" />
                        <span>Account will be created after checkout</span>
                      </div>
                    )
                  )}
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-xs text-muted-foreground">
                    By placing your order, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="underline underline-offset-2"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="underline underline-offset-2"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        phoneNumber={form.phone}
        onSuccess={handleOtpSuccess}
      />
    </div>
  );
}
