"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrencyEnglish } from "@/lib/utils";
import { patchData } from "@/utils/api-utils";
import { DiscountType, type Product } from "@/utils/types";
import { ProductSelector } from "./product-selector";

const discountFormSchema = z.object({
  discountType: z.enum([DiscountType.PERCENTAGE, DiscountType.FIXED], {
    required_error: "Please select a discount type",
  }),
  discountValue: z.coerce
    .number({
      required_error: "Please enter a discount value",
      invalid_type_error: "Please enter a valid number",
    })
    .positive("Discount must be greater than 0"),
  startDate: z.date({
    required_error: "Please select a start date",
  }),
  endDate: z.date({
    required_error: "Please select an end date",
  }),
  productIds: z.array(z.number()).min(1, "Please select at least one product"),
});

type DiscountFormValues = z.infer<typeof discountFormSchema>;

interface DiscountFormProps {
  products: Product[];
}

export function DiscountForm({ products }: DiscountFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      discountType: DiscountType.PERCENTAGE,
      discountValue: 0,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default to 7 days from now
      productIds: [],
    },
  });

  const discountType = form.watch("discountType");
  const selectedProductIds = form.watch("productIds");
  const selectedProducts = products.filter((product) =>
    selectedProductIds.includes(product.id)
  );

  async function onSubmit(data: DiscountFormValues) {
    setIsSubmitting(true);

    try {
      // Create an array of promises for each product update
      const updatePromises = data.productIds.map((productId) => {
        return patchData(`products/${productId}`, {
          discountType: data.discountType,
          discountValue: data.discountValue,
          discountStartDate: data.startDate.toISOString(),
          discountEndDate: data.endDate.toISOString(),
        });
      });

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      toast.success(`Discount applied to ${data.productIds.length} products`, {
        description:
          "The selected products have been updated with the new discount",
      });

      router.push("/admin/products/discounts/discount-list");
      router.refresh();
    } catch (error) {
      console.error("Error applying discount:", error);
      toast.error("Failed to apply discount", {
        description:
          "There was an error applying the discount. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Apply Discount
        </CardTitle>
        <CardDescription>
          Create a discount for one or multiple products
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="discountType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Discount Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={DiscountType.PERCENTAGE} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Percentage (%)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={DiscountType.FIXED} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Fixed Amount
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Value</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            step={
                              discountType === DiscountType.PERCENTAGE
                                ? "1"
                                : "0.01"
                            }
                            min="0"
                            max={
                              discountType === DiscountType.PERCENTAGE
                                ? "100"
                                : undefined
                            }
                            placeholder={
                              discountType === DiscountType.PERCENTAGE
                                ? "10"
                                : "5.99"
                            }
                            {...field}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                            {discountType === DiscountType.PERCENTAGE
                              ? "%"
                              : "$"}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        {discountType === DiscountType.PERCENTAGE
                          ? "Enter a percentage between 1-100"
                          : "Enter the fixed amount to discount"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const startDate = form.getValues("startDate");
                                return startDate && date < startDate;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="productIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Products</FormLabel>
                      <FormControl>
                        <ProductSelector
                          products={products}
                          selectedProductIds={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        {selectedProductIds.length === 0
                          ? "Select products to apply the discount to"
                          : `${selectedProductIds.length} product${
                              selectedProductIds.length > 1 ? "s" : ""
                            } selected`}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {selectedProducts.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Selected Products</h3>
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 text-xs font-medium">
                    <div>Product</div>
                    <div>Original Price</div>
                    <div>Discounted Price</div>
                  </div>
                  <Separator />
                  <div className="max-h-[200px] overflow-y-auto">
                    {selectedProducts.map((product) => {
                      const discountValue =
                        form.getValues("discountValue") || 0;
                      const discountType = form.getValues("discountType");

                      let discountedPrice = product.sellingPrice;
                      if (discountType === DiscountType.PERCENTAGE) {
                        discountedPrice =
                          product.sellingPrice * (1 - discountValue / 100);
                      } else {
                        discountedPrice = Math.max(
                          0,
                          product.sellingPrice - discountValue
                        );
                      }

                      return (
                        <div
                          key={product.id}
                          className="grid grid-cols-3 gap-4 p-3 text-sm border-t first:border-0"
                        >
                          <div className="font-medium truncate">
                            {product.name}
                          </div>
                          <div>
                            {formatCurrencyEnglish(product.sellingPrice)}
                          </div>
                          <div className="text-green-600 font-medium">
                            {formatCurrencyEnglish(discountedPrice)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t p-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply Discount"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
