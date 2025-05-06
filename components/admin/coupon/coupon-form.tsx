"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { patchData, postData } from "@/utils/api-utils";
import { Coupon } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  discountType: z.enum(["percentage", "fixed"]),
  value: z.string().min(1, "Value is required"),
  maxUsage: z.number().min(1, "Max usage must be at least 1"),
  validFrom: z.string().min(1, "Start date is required"),
  validUntil: z.string().min(1, "End date is required"),
  isActive: z.boolean(),
});

interface CouponFormProps {
  coupon?: Coupon;
  mode: "create" | "edit";
  onSuccess: () => void;
}

export function CouponForm({ coupon, mode, onSuccess }: CouponFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof couponSchema>>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon?.code || "",
      discountType: coupon?.discountType || "percentage",
      value: coupon?.value || "",
      maxUsage: coupon?.maxUsage || 100,
      validFrom: coupon?.validFrom || "",
      validUntil: coupon?.validUntil || "",
      isActive: coupon?.isActive ?? true,
    },
  });

  const onSubmit = async (values: z.infer<typeof couponSchema>) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await postData("coupons", values);
        toast.success("Coupon created successfully");
      } else if (mode === "edit" && coupon) {
        await patchData(`coupons/${coupon.id}`, values);
        toast.success("Coupon updated successfully");
      }
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        mode === "create"
          ? "Failed to create coupon. Please try again."
          : "Failed to update coupon. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 w-full  mx-auto">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter coupon code (e.g. SUMMER20)"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Discount Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>
                    {form.watch("discountType") === "percentage"
                      ? "Discount Percentage"
                      : "Discount Amount"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={
                        form.watch("discountType") === "percentage"
                          ? "Enter percentage (e.g. 20)"
                          : "Enter amount (e.g. 10.50)"
                      }
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="maxUsage"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Maximum Usage</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter maximum usage limit"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="validFrom"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Valid From</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select start date"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="validUntil"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Valid Until</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select end date"
                      minDate={form.watch("validFrom")}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0">
                <div className="space-y-0.5">
                  <FormLabel>Active Status</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-2  mx-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={isSubmitting}
            className="w-24"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-32">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create Coupon" : "Update Coupon"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
