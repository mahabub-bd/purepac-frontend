"use client";

import {
  ArrowLeft,
  Check,
  CreditCard,
  DollarSign,
  Edit,
  FileText,
  Loader2,
  MapPin,
  Package,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Tag,
  TicketPercent,
  Truck,
  User,
  UserPlus,
  X,
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
import { fetchData, patchData, postData } from "@/utils/api-utils";
import { clearLocalCoupon } from "@/utils/cart-storage";
import type {
  Address,
  CartItem,
  PaymentMethod,
  ShippingMethod,
  User as UserType,
} from "@/utils/types";
import { LoadingIndicator } from "../admin/loading-indicator";
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

  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const [isVerified, setIsVerified] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(true);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);

  const shippingCost =
    shippingMethods.find(
      (method) => method.id.toString() === selectedShippingMethod
    )?.cost || 0;
  const couponDiscount = appliedCoupon?.discount || 0;
  const total =
    Number(discountedSubtotal) + Number(shippingCost) - Number(couponDiscount);

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

  const handleOtpSuccess = (userId: string) => {
    setIsVerified(true);
    setUserId(userId);
    setShowOtpModal(false);
    toast.success("Phone number verified successfully");

    if (!form.watch("name") || !form.watch("email")) {
      fetchUserInfo(userId);
    }
  };

  const fetchUserInfo = async (userId: string) => {
    try {
      const userData = (await fetchData(`users/${userId}`)) as UserType;
      if (userData) {
        if (userData.name && !form.watch("name")) {
          setValue("name", userData.name);
        }
        if (userData.email && !form.watch("email")) {
          setValue("email", userData.email);
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

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

  const handleUpdateUserInfo = async () => {
    const name = form.getValues("name");
    const email = form.getValues("email");

    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsUpdatingInfo(true);
    try {
      const userIdToUpdate = user?.id || userId;
      if (!userIdToUpdate) {
        toast.error("User ID not available");
        return;
      }

      await patchData(`users/${userIdToUpdate}`, {
        name,
        email,
      });

      toast.success("Profile information updated successfully");
      setIsEditingInfo(false);
    } catch (error) {
      console.error("Error updating user info:", error);
      toast.error("Failed to update profile information");
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    console.log(data);

    if (createAccount && !user && !isVerified) {
      toast.error("Please verify your phone number to create an account");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        addressId: 4,
        userId: user?.id || userId || null,
        shippingMethodId: Number(selectedShippingMethod),
        paymentMethodId: paymentMethods.find(
          (method) => method.code === selectedPaymentMethod
        )?.id,
        items: cart.items.map((item: CartItem) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        couponId: appliedCoupon?.id || null,
        totalValue: total,
      };

      const response = await postData("orders", orderData);

      await clearCart();
      await clearLocalCoupon();

      toast.success("Order placed successfully!");

      window.location.href = `/order-confirmation/${response.data.orderId}`;
    } catch (error) {
      console.error("Order submission error:", error);
      if (error instanceof Error) {
        toast.error(
          error.message || "Failed to place order. Please try again."
        );
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className="container mx-auto py-8 px-4 md:py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingCart className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
        </div>
        <h1 className="mb-4 text-xl md:text-2xl font-bold">
          Your cart is empty
        </h1>
        <p className="mb-6 md:mb-8 text-sm md:text-base text-muted-foreground">
          Add some items to your cart before proceeding to checkout
        </p>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12">
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
            Checkout
          </h1>
          <p className="mt-1 text-sm md:text-base text-muted-foreground">
            Complete your order by providing your details below
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mt-3 sm:mt-0 self-start sm:self-auto"
        >
          <Link href="/cart" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to cart
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <LoadingIndicator message="Loading checkout information..." />
      ) : (
        <div className="grid gap-6 md:gap-8 lg:grid-cols-12">
          {/* Main Form */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 md:space-y-8"
              >
                {/* Customer Information */}
                <div className="space-y-4 md:space-y-5 bg-white rounded-lg border p-4 md:p-6">
                  <div className="flex items-center justify-between gap-2 border-b pb-3 md:pb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      <div>
                        <h2 className="text-base md:text-lg font-semibold">
                          Customer Information
                        </h2>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Enter your contact details
                        </p>
                      </div>
                    </div>
                    {(isVerified || user) && !isEditingInfo && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingInfo(true)}
                        className="text-xs md:text-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    )}
                    {isEditingInfo && (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingInfo(false)}
                          className="text-xs md:text-sm"
                          disabled={isUpdatingInfo}
                        >
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={handleUpdateUserInfo}
                          className="text-xs md:text-sm"
                          disabled={isUpdatingInfo}
                        >
                          {isUpdatingInfo ? (
                            <>
                              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" /> Save
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 md:space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: "Name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Your full name"
                              disabled={
                                !isEditingInfo &&
                                ((!!user && !isVerified) ||
                                  (isVerified && !isEditingInfo))
                              }
                            />
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
                          <FormLabel>Email </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="your@email.com"
                              disabled={
                                !isEditingInfo &&
                                ((!!user && !isVerified) ||
                                  (isVerified && !isEditingInfo))
                              }
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
                                className="whitespace-nowrap"
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
                <div className="space-y-4 md:space-y-5 bg-white rounded-lg border p-4 md:p-6">
                  <div className="flex items-center gap-2 border-b pb-3 md:pb-4">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <div>
                      <h2 className="text-base md:text-lg font-semibold">
                        Shipping Address
                      </h2>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Where should we deliver your order?
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-5">
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
                <div className="space-y-4 md:space-y-5 bg-white rounded-lg border p-4 md:p-6">
                  <div className="flex items-center gap-2 border-b pb-3 md:pb-4">
                    <Truck className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <div>
                      <h2 className="text-base md:text-lg font-semibold">
                        Shipping Method
                      </h2>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        How would you like to receive your order?
                      </p>
                    </div>
                  </div>

                  <div>
                    <RadioGroup
                      value={selectedShippingMethod}
                      onValueChange={setSelectedShippingMethod}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {shippingMethods.map((method) => (
                        <div
                          key={method.id}
                          className={cn(
                            "flex items-center justify-between rounded-lg border p-3 md:p-4",
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
                              <span className="font-medium text-sm md:text-base">
                                {method.name}
                              </span>
                              <span className="text-xs md:text-sm text-muted-foreground">
                                {method.deliveryTime}
                              </span>
                            </Label>
                          </div>
                          <span className="font-medium text-sm md:text-base">
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
                <div className="space-y-4 md:space-y-5 bg-white rounded-lg border p-4 md:p-6">
                  <div className="flex items-center gap-2 border-b pb-3 md:pb-4">
                    <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <div>
                      <h2 className="text-base md:text-lg font-semibold">
                        Payment Method
                      </h2>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        How would you like to pay?
                      </p>
                    </div>
                  </div>

                  <div>
                    <RadioGroup
                      value={selectedPaymentMethod}
                      onValueChange={setSelectedPaymentMethod}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={cn(
                            "flex items-center justify-between rounded-lg border p-3 md:p-4",
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
                                <DollarSign className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                <span className="font-medium text-sm md:text-base">
                                  {method.name}
                                </span>
                              </div>
                              <span className="text-xs md:text-sm text-muted-foreground">
                                {method.description}
                              </span>
                            </Label>
                          </div>
                          {!method.isActive && (
                            <Badge
                              variant="outline"
                              className="bg-yellow-50 text-xs"
                            >
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
                      <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Create an account
                          </FormLabel>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Save your information for faster checkout next time
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {/* Order Items */}
                <div className="space-y-4 md:space-y-5 bg-white rounded-lg border p-4 md:p-6">
                  <div className="flex items-center gap-2 border-b pb-3 md:pb-4">
                    <Package className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <div>
                      <h2 className="text-base md:text-lg font-semibold">
                        Order Items ({itemCount})
                      </h2>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Review your items before placing your order
                      </p>
                    </div>
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
                <div className="lg:hidden space-y-4 bg-white rounded-lg border p-4 md:p-6">
                  <div className="border-b pb-3 md:pb-4">
                    <h2 className="text-base md:text-lg font-semibold">
                      Order Summary
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <OrderSummaryContent
                      originalSubtotal={originalSubtotal}
                      productDiscounts={productDiscounts}
                      appliedCoupon={appliedCoupon}
                      shippingCost={Number(shippingCost)}
                      total={total}
                      isSubmitting={isSubmitting}
                      onSubmit={form.handleSubmit(onSubmit)}
                      selectedShippingMethod={selectedShippingMethod}
                      selectedPaymentMethod={selectedPaymentMethod}
                      shippingMethods={shippingMethods}
                      paymentMethods={paymentMethods}
                      user={user}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </div>

          {/* Desktop Order Summary */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-4 bg-white rounded-lg border p-6">
              <div className="border-b pb-4">
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>

              <div className="space-y-4 mt-4">
                <OrderSummaryContent
                  originalSubtotal={originalSubtotal}
                  productDiscounts={productDiscounts}
                  appliedCoupon={appliedCoupon}
                  shippingCost={Number(shippingCost)}
                  total={total}
                  isSubmitting={isSubmitting}
                  onSubmit={form.handleSubmit(onSubmit)}
                  selectedShippingMethod={selectedShippingMethod}
                  selectedPaymentMethod={selectedPaymentMethod}
                  shippingMethods={shippingMethods}
                  paymentMethods={paymentMethods}
                  user={user}
                />
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

function OrderSummaryContent({
  originalSubtotal,
  productDiscounts,
  appliedCoupon,
  shippingCost,
  total,
  isSubmitting,
  onSubmit,
  selectedShippingMethod,
  selectedPaymentMethod,
  shippingMethods,
  paymentMethods,
  user,
}: {
  originalSubtotal: number;
  productDiscounts: number;
  appliedCoupon: { code: string; discount: number } | null;
  shippingCost: number;
  total: number;
  isSubmitting: boolean;
  onSubmit: () => void;
  selectedShippingMethod: string;
  selectedPaymentMethod: string;
  shippingMethods: ShippingMethod[];
  paymentMethods: PaymentMethod[];
  user?: UserType;
}) {
  return (
    <>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <ShoppingBag className="h-3 w-3" /> Subtotal
          </span>
          <span>{formatCurrencyEnglish(originalSubtotal)}</span>
        </div>

        {productDiscounts > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" /> Product Discounts
            </span>
            <span>-{formatCurrencyEnglish(productDiscounts)}</span>
          </div>
        )}

        {appliedCoupon && (
          <div className="flex justify-between text-sm text-green-600">
            <div className="flex items-center">
              <span className="flex items-center gap-1">
                <TicketPercent className="h-3 w-3 mr-1" /> Coupon
              </span>
              <Badge variant="outline" className="ml-2 bg-green-50 text-xs">
                {appliedCoupon.code.toUpperCase()}
              </Badge>
            </div>
            <span>-{formatCurrencyEnglish(appliedCoupon.discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Truck className="h-3 w-3" /> Shipping
          </span>
          <span>{formatCurrencyEnglish(Number(shippingCost))}</span>
        </div>

        <Separator className="my-2" />

        <div className="flex justify-between font-medium">
          <span className="flex items-center gap-1">
            <Receipt className="h-4 w-4" /> Total
          </span>
          <span className="text-lg">{formatCurrencyEnglish(total)}</span>
        </div>
      </div>

      <Button
        onClick={onSubmit}
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
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Place Order
          </>
        )}
      </Button>

      <div className="mt-4 space-y-3 text-xs md:text-sm">
        {selectedShippingMethod && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Truck className="h-3 w-3 md:h-4 md:w-4" />
            <span>
              {shippingMethods.find(
                (m) => m.id.toString() === selectedShippingMethod
              )?.name || "Standard Shipping"}
            </span>
          </div>
        )}
        {selectedPaymentMethod && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
            <span>
              {paymentMethods.find((m) => m.code === selectedPaymentMethod)
                ?.name || "Credit Card"}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <ShieldCheck className="h-3 w-3 md:h-4 md:w-4" />
          <span>Secure checkout</span>
        </div>
        {user && (
          <div className="flex items-center gap-2 text-green-600">
            <User className="h-3 w-3 md:h-4 md:w-4" />
            <span>Signed in as {user?.name || user.mobileNumber}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-6 mt-6">
        <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-1 sm:gap-2">
          <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span>By placing your order, you agree to our</span>
          <Link
            href="/terms"
            className="underline hover:text-primary transition-colors"
          >
            Terms of Service
          </Link>
          <span>and</span>
          <Link
            href="/privacy"
            className="underline hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </>
  );
}
