"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Section } from "../helper";

import { cn, formatDateTime } from "@/lib/utils";
import { fetchData, patchData, postData } from "@/utils/api-utils";
import type { Product, Purchase } from "@/utils/types";

const purchaseSchema = z.object({
  productId: z.number().min(1, "Product is required"),
  supplierId: z.number().min(1, "Supplier is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  purchaseDate: z.date(),
  status: z.enum(["pending", "shipped", "delivered", "cancelled"]),
  notes: z.string().optional(),
});

type PurchaseFormValues = z.infer<typeof purchaseSchema>;

interface PurchaseFormProps {
  mode: "create" | "edit";
  purchase?: Purchase;
}

export function PurchaseForm({ mode, purchase }: PurchaseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      productId: purchase?.product.id || undefined,
      supplierId: purchase?.product?.supplier?.id || undefined,
      quantity: purchase?.quantity || 1,
      purchaseDate: purchase?.purchaseDate
        ? new Date(purchase.purchaseDate)
        : new Date(),
      status:
        (purchase?.status as
          | "pending"
          | "delivered"
          | "cancelled"
          | "shipped") || "pending",
      notes: purchase?.notes || "",
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const products = await fetchData<Product[]>("products");
        if (!products || products.length === 0) {
          toast.error("No products available");
          router.back();
          return;
        }
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
        router.back();
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [router]);

  const handleSubmit = async (data: PurchaseFormValues) => {
    setIsSubmitting(true);

    try {
      const selectedProduct = products.find((p) => p.id === data.productId);

      if (!selectedProduct && mode === "create") {
        throw new Error("Selected product not found");
      }

      const purchaseData = {
        productId: data.productId,
        supplierId: selectedProduct?.supplier?.id,
        quantity: data.quantity,
        purchaseDate: data.purchaseDate.toISOString(),
        status: data.status,
        notes: data.notes,
      };

      const endpoint = "purchases";
      const method = mode === "create" ? postData : patchData;
      const url = mode === "create" ? endpoint : `${endpoint}/${purchase?.id}`;

      const response = await method(url, purchaseData);
      console.log(response);

      if (response.statusCode === 201 || response.statusCode === 200) {
        toast.success(
          mode === "create"
            ? "Purchase created successfully"
            : "Purchase updated successfully"
        );
        router.back();
      } else {
        toast.error(response?.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error instanceof Error) {
        toast.error(error.message || "An unexpected error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="p-6 space-y-6">
          <Section title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Purchase Date</FormLabel>
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
                              formatDateTime(field.value.toISOString())
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 z-50 bg-white border rounded-md"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
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
                name="productId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Product</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const productId = Number(value);
                        field.onChange(productId);
                        const selectedProduct = products.find(
                          (p) => p.id === productId
                        );
                        if (selectedProduct?.supplier) {
                          form.setValue(
                            "supplierId",
                            selectedProduct?.supplier?.id
                          );
                        }
                      }}
                      value={field.value?.toString()}
                      disabled={isLoadingProducts}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          {isLoadingProducts ? (
                            <SelectValue placeholder="Loading products..." />
                          ) : (
                            <SelectValue placeholder="Select a product" />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product: Product) => (
                          <SelectItem
                            key={product.id}
                            value={product.id.toString()}
                          >
                            {product.name} (Supplier:{" "}
                            {product?.supplier?.name || "Unknown"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Enter quantity"
                        className="w-full"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Section>

          <Section title="Notes">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes"
                      className="min-h-[100px] w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Section>
        </div>

        <div className="flex justify-end p-6">
          <Button type="submit" disabled={isSubmitting || isLoadingProducts}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Creating..." : "Updating..."}
              </>
            ) : (
              <>{mode === "create" ? "Create Purchase" : "Update Purchase"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
