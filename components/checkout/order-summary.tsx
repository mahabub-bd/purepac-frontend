"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyEnglish } from "@/lib/utils";
import type {
  PaymentMethod,
  ShippingMethod,
  User as UserType,
} from "@/utils/types";
import {
  CreditCard,
  FileText,
  Loader2,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Tag,
  TicketPercent,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";

interface OrderSummaryProps {
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
}

export function OrderSummary({
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
}: OrderSummaryProps) {
  return (
    <div className="space-y-4 bg-white rounded-lg border p-4 md:p-6">
      <div className="border-b pb-3 md:pb-4">
        <h2 className="text-base md:text-lg font-semibold">Order Summary</h2>
      </div>

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
    </div>
  );
}
