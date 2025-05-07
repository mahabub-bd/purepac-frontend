"use client";

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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { mobileLogin, verifyOtp } from "@/actions/auth";
import { OtpVerificationModal } from "@/components/auth/otp-verification-modal";
import { CartItemProductPage } from "@/components/cart/cart-item-product-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCartContext } from "@/contexts/cart-context";
import { cn, formatCurrencyEnglish } from "@/lib/utils";
import { fetchData } from "@/utils/api-utils";
import type {
  Address,
  CartItem,
  PaymentMethod,
  ShippingMethod,
  User as UserType,
} from "@/utils/types";
import { Loader2 } from "lucide-react";
import { AddressSelector } from "./address-selector";

type CheckoutFormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  createAccount: boolean;
};

export default function CheckoutPage({ user }: { user?: UserType }) {
  const { getCartTotals, clearCart, cart, appliedCoupon } = useCartContext();

  const { originalSubtotal, discountedSubtotal, itemCount, productDiscounts } =
    getCartTotals();

  // Data states
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected states
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  // Account verification states
  const [isVerified, setIsVerified] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Address state
  const [showAddressForm, setShowAddressForm] = useState(true);

  // Calculate order totals
  const shippingCost =
    shippingMethods.find(
      (method) => method.id.toString() === selectedShippingMethod
    )?.cost || 0;
  const couponDiscount = appliedCoupon?.discount || 0;
  const total =
    Number(discountedSubtotal) + Number(shippingCost) - Number(couponDiscount);

  // Initialize form
  const form = useForm<CheckoutFormValues>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.mobileNumber || "",
      address: "",
      city: "",
      country: "Bangladesh",
      createAccount: false,
    },
    mode: "onBlur",
  });

  const { watch, setValue } = form;
  const createAccount = watch("createAccount");
  const phoneValue = watch("phone");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const [shippingResponse, paymentResponse] = await Promise.all([
          fetchData("shipping-methods") as Promise<ShippingMethod[]>,
          fetchData("order-payment-methods") as Promise<PaymentMethod[]>,
        ]);

        setShippingMethods(shippingResponse as ShippingMethod[]);
        setPaymentMethods(
          (paymentResponse as PaymentMethod[]).filter(
            (method) => method.code !== "bkash"
          )
        );

        if ((shippingResponse as ShippingMethod[]).length > 0) {
          setSelectedShippingMethod(shippingResponse[0].id.toString());
        }
        if (paymentResponse.length > 0) {
          setSelectedPaymentMethod(paymentResponse[0].code);
        }
      } catch (error) {
        console.error("Error fetching methods:", error);
        toast.error("Failed to load checkout options");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMethods();
  }, []);

  // Handle phone verification
  const handleVerifyPhone = async () => {
    if (!phoneValue) {
      toast.error("Phone number is required");
      return;
    }

    const formattedNumber = phoneValue.startsWith("+")
      ? phoneValue
      : `+880${phoneValue.replace(/^0+/, "")}`;

    try {
      await mobileLogin(formattedNumber);
      setShowOtpModal(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  // Handle OTP verification success
  const handleOtpSuccess = (userId: string) => {
    setIsVerified(true);
    setUserId(userId);
    setShowOtpModal(false);
    toast.success("Phone number verified successfully");
  };

  // Handle address selection
  const handleAddressSelect = (address: Address) => {
    setShowAddressForm(false);
    setValue("address", address.street);
    setValue("city", address.city);
    setValue("country", address.division);
  };

  const handleAddNewAddress = () => {
    setShowAddressForm(true);
    setValue("address", "");
    setValue("city", "");
    setValue("country", "Bangladesh");
  };

  // Submit order
  const onSubmit = async (data: CheckoutFormValues) => {
    if (createAccount && !user && !isVerified) {
      toast.error("Please verify your phone number to create an account");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare order data
      const orderData = {
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          userId: user?.id || userId,
          createAccount: createAccount,
        },
        shipping: {
          method: selectedShippingMethod,
          address: {
            street: data.address,
            city: data.city,
            country: data.country,
          },
        },
        payment: {
          method: selectedPaymentMethod,
        },
        items: cart.items.map((item: CartItem) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.sellingPrice,
        })),
        coupon: appliedCoupon?.code,
        total,
      };
      console.log(orderData);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      await clearCart();

      toast.success("Order placed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
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
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Customer Information */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b pb-4">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <h2 className="text-lg font-semibold">
                        Customer Information
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Enter your contact details
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 px-1">
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: "Name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Your full name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="your@email.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      rules={{ required: "Phone number is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="01XXXXXXXXX"
                                className={cn(
                                  "flex-1",
                                  (isVerified || user) && "border-green-500"
                                )}
                                disabled={!!user || isVerified}
                              />
                            </FormControl>
                            {!user && !isVerified && (
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={handleVerifyPhone}
                              >
                                Verify
                              </Button>
                            )}
                            {(isVerified || user) && (
                              <Badge className="bg-green-500">Verified</Badge>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 border-b pb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <h2 className="text-lg font-semibold">
                        Shipping Address
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Where should we deliver your order?
                      </p>
                    </div>
                  </div>

                  <div className="px-1 space-y-5">
                    {user && (
                      <AddressSelector
                        userId={String(user.id)}
                        onAddressSelect={handleAddressSelect}
                        onAddNewClick={handleAddNewAddress}
                      />
                    )}

                    {showAddressForm && (
                      <>
                        <FormField
                          control={form.control}
                          name="address"
                          rules={{ required: "Address is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address *</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="House #, Road #, Area"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="city"
                          rules={{ required: "City is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Your city" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input {...field} disabled />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
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
                        How would you like to receive your order?
                      </p>
                    </div>
                  </div>

                  <div className="px-1">
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
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-4">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <h2 className="text-lg font-semibold">Payment Method</h2>
                      <p className="text-sm text-muted-foreground">
                        How would you like to pay?
                      </p>
                    </div>
                  </div>

                  <div className="px-1">
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
                                <span className="font-medium">
                                  {method.name}
                                </span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {method.description}
                              </span>
                            </Label>
                          </div>
                          {!method.isActive && (
                            <Badge variant="outline" className="bg-yellow-50">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                {/* Account Creation */}
                {!user && (
                  <FormField
                    control={form.control}
                    name="createAccount"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Create an account</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Save your information for faster checkout next time
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

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
                    {cart.items.map((item: CartItem) => (
                      <div key={item.id} className="pt-4 first:pt-0">
                        <CartItemProductPage item={item} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Order Summary */}
                <div className="lg:hidden space-y-4 border rounded-lg p-5">
                  <div className="border-b pb-4">
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
                          <span>
                            -{formatCurrencyEnglish(productDiscounts)}
                          </span>
                        </div>
                      )}

                      {appliedCoupon && (
                        <div className="flex justify-between text-sm text-green-600">
                          <div className="flex items-center">
                            <span>Coupon</span>
                            <Badge
                              variant="outline"
                              className="ml-2 bg-green-50"
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
                        <span>
                          {formatCurrencyEnglish(Number(shippingCost))}
                        </span>
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
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>

          {/* Desktop Order Summary */}
          <div className="hidden lg:block">
            <div className="sticky top-4 border rounded-lg p-5 bg-background/50 backdrop-blur-sm">
              <div className="border-b pb-4">
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
                        <Badge variant="outline" className="ml-2 bg-green-50">
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
                    <span>{formatCurrencyEnglish(Number(shippingCost))}</span>
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
                  onClick={form.handleSubmit(onSubmit)}
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>

                <div className="mt-4 space-y-3 text-sm">
                  {selectedShippingMethod && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span>
                        {shippingMethods.find(
                          (m) => m.id.toString() === selectedShippingMethod
                        )?.name || "Standard Shipping"}
                      </span>
                    </div>
                  )}
                  {selectedPaymentMethod && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      <span>
                        {paymentMethods.find(
                          (m) => m.code === selectedPaymentMethod
                        )?.name || "Credit Card"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Secure checkout</span>
                  </div>
                  {user && (
                    <div className="flex items-center gap-2 text-green-600">
                      <User className="h-4 w-4" />
                      <span>
                        Signed in as {user.email || user.mobileNumber}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-xs text-muted-foreground">
                    By placing your order, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="underline hover:text-primary"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="underline hover:text-primary"
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
        isOpen={showOtpModal}
        phoneNumber={
          phoneValue.startsWith("+")
            ? phoneValue
            : `+880${phoneValue.replace(/^0+/, "")}`
        }
        onClose={() => setShowOtpModal(false)}
        onSuccess={handleOtpSuccess}
        onResendOtp={mobileLogin}
        onVerifyOtp={verifyOtp}
      />
    </div>
  );
}
