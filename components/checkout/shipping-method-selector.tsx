"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, formatCurrencyEnglish } from "@/lib/utils";
import type { ShippingMethod } from "@/utils/types";
import { Truck } from "lucide-react";

interface ShippingMethodSelectorProps {
  shippingMethods: ShippingMethod[];
  selectedMethod: string;
  onSelectMethod: (methodId: string) => void;
}

export function ShippingMethodSelector({
  shippingMethods,
  selectedMethod,
  onSelectMethod,
}: ShippingMethodSelectorProps) {
  return (
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
          value={selectedMethod}
          onValueChange={onSelectMethod}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {shippingMethods.map((method) => (
            <div
              key={method.id}
              className={cn(
                "flex items-center justify-between rounded-lg border p-3 md:p-4",
                selectedMethod === method.id.toString() &&
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
                {formatCurrencyEnglish(Number.parseFloat(method.cost))}
              </span>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
