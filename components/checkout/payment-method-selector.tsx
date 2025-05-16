"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/utils/types";
import { CreditCard, DollarSign } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedMethod: string;
  onSelectMethod: (methodCode: string) => void;
}

export function PaymentMethodSelector({
  paymentMethods,
  selectedMethod,
  onSelectMethod,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4 md:space-y-5 bg-white rounded-lg border p-4 md:p-6">
      <div className="flex items-center gap-2 border-b pb-3 md:pb-4">
        <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-primary" />
        <div>
          <h2 className="text-base md:text-lg font-semibold">Payment Method</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            How would you like to pay?
          </p>
        </div>
      </div>

      <div>
        <RadioGroup
          value={selectedMethod}
          onValueChange={onSelectMethod}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={cn(
                "flex items-center justify-between rounded-lg border p-3 md:p-4",
                selectedMethod === method.code && "border-primary bg-primary/5"
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
                <Badge variant="outline" className="bg-yellow-50 text-xs">
                  Inactive
                </Badge>
              )}
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
