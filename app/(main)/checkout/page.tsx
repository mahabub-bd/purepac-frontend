"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, CreditCard, DollarSign, MapPin, Phone, ShieldCheck, Truck } from "lucide-react"
import { toast } from "sonner"

import { CartItemProductPage } from "@/components/cart/cart-item-product-page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCartContext } from "@/contexts/cart-context"
import { cn, formatCurrencyEnglish } from "@/lib/utils"
import type { CartItem } from "@/utils/types"

export default function CheckoutPage() {
  const router = useRouter()
  const { getCartTotals, clearCart, cart } = useCartContext()

  const { originalSubtotal, discountedSubtotal, itemCount, productDiscounts } = getCartTotals()

  // Add shipping method state
  const [shippingMethod, setShippingMethod] = useState<string>("inside-dhaka")

  // Add payment method state
  const [paymentMethod, setPaymentMethod] = useState<string>("cash-on-delivery")

  // Add bKash number state
  const [bkashNumber, setBkashNumber] = useState<string>("")
  const [bkashTrxID, setBkashTrxID] = useState<string>("")

  // Calculate shipping cost based on selected method
  const shippingCost = shippingMethod === "inside-dhaka" ? 80 : 120

  // Add shipping cost to total
  const total = discountedSubtotal + shippingCost

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setTouched({ ...touched, [name]: true })
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched({ ...touched, [name]: true })
  }

  const isFieldInvalid = (name: keyof typeof form) => {
    if (!touched[name]) return false
    if (name === "firstName" || name === "email" || name === "address") {
      return !form[name]
    }
    return false
  }

  const handleSubmit = async () => {
    // Mark all fields as touched for validation
    const allTouched = Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    setTouched(allTouched)

    if (!form.firstName || !form.email || !form.address) {
      toast.error("Please fill in all required fields")
      return
    }

    // Validate bKash payment details if selected
    if (paymentMethod === "bkash") {
      if (!bkashNumber.trim()) {
        toast.error("Please enter your bKash number")
        return
      }
      if (!bkashTrxID.trim()) {
        toast.error("Please enter the bKash Transaction ID")
        return
      }
    }

    setIsSubmitting(true)
    try {
      // Simulate placing order
      await new Promise((res) => setTimeout(res, 1500))

      toast.success("Order placed successfully!")
      await clearCart()
      router.push("/thank-you") // You can create this page
    } catch (error) {
      console.error(error)
      toast.error("Failed to place order")
    } finally {
      setIsSubmitting(false)
    }
  }

  // If cart is empty, show message and redirect button
  if (!cart?.items?.length) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Truck className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-8 text-muted-foreground">Add some items to your cart before proceeding to checkout</p>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Checkout</h1>
          <p className="mt-1 text-muted-foreground">Complete your order by providing your details below</p>
        </div>
        <Button variant="ghost" size="sm" asChild className="mt-4 sm:mt-0">
          <Link href="/cart" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to cart
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Information */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b pb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Shipping Information</h2>
                <p className="text-sm text-muted-foreground">Enter your shipping address details</p>
              </div>
            </div>

            <div className="space-y-5 px-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center">
                    First Name <span className="ml-1 text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={cn(isFieldInvalid("firstName") && "border-red-500")}
                    placeholder="Enter your first name"
                  />
                  {isFieldInvalid("firstName") && <p className="text-xs text-red-500">First name is required</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                  />
                </div>
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
                    className={cn(isFieldInvalid("email") && "border-red-500")}
                    placeholder="Enter your email address"
                  />
                  {isFieldInvalid("email") && <p className="text-xs text-red-500">Email is required</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

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
                  className={cn(isFieldInvalid("address") && "border-red-500")}
                  placeholder="Enter your street address"
                />
                {isFieldInvalid("address") && <p className="text-xs text-red-500">Address is required</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="Enter your postal code"
                  />
                </div>
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
            </div>
          </div>

          {/* Shipping Method */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-4">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Shipping Method</h2>
                <p className="text-sm text-muted-foreground">Select your preferred delivery option</p>
              </div>
            </div>

            <div className="px-1">
              <RadioGroup
                value={shippingMethod}
                onValueChange={setShippingMethod}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <div
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-4",
                    shippingMethod === "inside-dhaka" && "border-primary bg-primary/5",
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="inside-dhaka" id="inside-dhaka" />
                    <Label htmlFor="inside-dhaka" className="flex cursor-pointer flex-col">
                      <span className="font-medium">Inside Dhaka</span>
                      <span className="text-sm text-muted-foreground">Delivery within 1-2 days</span>
                    </Label>
                  </div>
                  <span className="font-medium">{formatCurrencyEnglish(80)}</span>
                </div>

                <div
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-4",
                    shippingMethod === "outside-dhaka" && "border-primary bg-primary/5",
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="outside-dhaka" id="outside-dhaka" />
                    <Label htmlFor="outside-dhaka" className="flex cursor-pointer flex-col">
                      <span className="font-medium">Outside Dhaka</span>
                      <span className="text-sm text-muted-foreground">Delivery within 2-3 days</span>
                    </Label>
                  </div>
                  <span className="font-medium">{formatCurrencyEnglish(120)}</span>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Payment Method</h2>
                <p className="text-sm text-muted-foreground">Select your preferred payment option</p>
              </div>
            </div>

            <div className="px-1">
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <div
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-4",
                    paymentMethod === "cash-on-delivery" && "border-primary bg-primary/5",
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" />
                    <Label htmlFor="cash-on-delivery" className="flex cursor-pointer flex-col">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="font-medium">Cash On Delivery</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Pay when you receive your order</span>
                    </Label>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex items-center rounded-lg border p-4",
                    paymentMethod === "bkash" && "border-primary bg-primary/5",
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="bkash" id="bkash" />
                    <Label htmlFor="bkash" className="flex cursor-pointer flex-col">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="font-medium">bKash Payment</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Pay using bKash mobile banking</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              {/* bKash Payment Details - Displayed below the payment options when bKash is selected */}
              {paymentMethod === "bkash" && (
                <div className="mt-4 space-y-4">
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <p className="font-medium mb-2">bKash Payment Instructions:</p>
                    <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                      <li>
                        Send money to: <span className="font-medium">01XXXXXXXXX</span>
                      </li>
                      <li>
                        Use the reference:{" "}
                        <span className="font-medium">Order #{Math.floor(100000 + Math.random() * 900000)}</span>
                      </li>
                      <li>Enter the bKash number and Transaction ID below</li>
                    </ol>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bkash-number">bKash Number</Label>
                      <Input
                        id="bkash-number"
                        value={bkashNumber}
                        onChange={(e) => setBkashNumber(e.target.value)}
                        placeholder="Enter your bKash number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bkash-trxid">Transaction ID</Label>
                      <Input
                        id="bkash-trxid"
                        value={bkashTrxID}
                        onChange={(e) => setBkashTrxID(e.target.value)}
                        placeholder="Enter bKash Transaction ID"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold">Order Items ({itemCount})</h2>
              <p className="text-sm text-muted-foreground">Review your items before placing your order</p>
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

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrencyEnglish(shippingCost)}</span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-lg">{formatCurrencyEnglish(total)}</span>
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={isSubmitting} size="lg" className="mt-2 w-full">
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Delivery to {shippingMethod === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Payment via {paymentMethod === "cash-on-delivery" ? "Cash On Delivery" : "bKash"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Secure checkout process</span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-xs text-muted-foreground">
                  By placing your order, you agree to our{" "}
                  <Link href="/terms" className="underline underline-offset-2">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline underline-offset-2">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
