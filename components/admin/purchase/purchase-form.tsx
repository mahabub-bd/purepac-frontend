"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
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
import { Section } from "../helper";

import Loading from "@/app/loading";
import { fetchData, patchData, postData } from "@/utils/api-utils";
import { purchaseSchema } from "@/utils/form-validation";
import type { Product, Purchase, Supplier } from "@/utils/types";

type PurchaseFormValues = z.infer<typeof purchaseSchema>;

interface PurchaseFormProps {
  mode: "create" | "edit";
  purchase?: Purchase;
}

export function PurchaseForm({ mode, purchase }: PurchaseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number>();
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplierId: purchase?.supplier?.id || undefined,
      items: purchase?.items?.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.purchasePrice,
      })) || [{ productId: undefined, quantity: 1, unitPrice: 0 }],
      purchaseDate: purchase?.purchaseDate
        ? new Date(purchase.purchaseDate)
        : new Date(),
      status:
        (purchase?.status as
          | "pending"
          | "shipped"
          | "delivered"
          | "cancelled") || "pending",
      notes: purchase?.notes || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliers = await fetchData<Supplier[]>("suppliers");
        setSuppliers(suppliers);

        if (purchase?.supplier?.id) {
          setIsProductsLoading(true);
          const supplierProducts = await fetchData<Product[]>(
            `products?supplier=${purchase.supplier.id}`
          );
          setProducts(supplierProducts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load initial data");
        router.back();
      } finally {
        setIsProductsLoading(false);
      }
    };

    fetchSuppliers();
  }, [router, purchase]);

  const handleSupplierChange = async (supplierId: number) => {
    try {
      setIsProductsLoading(true);
      const products = await fetchData<Product[]>(
        `products?supplier=${supplierId}`
      );
      setProducts(products);
      setSelectedSupplierId(supplierId);
      form.resetField("items");
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsProductsLoading(false);
    }
  };

  const handleSubmit = async (data: PurchaseFormValues) => {
    setIsSubmitting(true);

    try {
      const purchaseData = {
        supplierId: data.supplierId,
        items: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        purchaseDate: data.purchaseDate.toISOString(),
        status: data.status,
        notes: data.notes,
      };

      const endpoint = "purchases";
      const method = mode === "create" ? postData : patchData;
      const url = mode === "create" ? endpoint : `${endpoint}/${purchase?.id}`;

      const response = await method(url, purchaseData);

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
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="p-6 space-y-6">
          <Section title="Supplier Information">
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const supplierId = Number(value);
                      field.onChange(supplierId);
                      handleSupplierChange(supplierId);
                    }}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem
                          key={supplier.id}
                          value={supplier.id.toString()}
                        >
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Section>

          <Section title="Purchase Items">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end">
                  <FormField
                    control={form.control}
                    name={`items.${index}.productId`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Product</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const productId = Number(value);
                            field.onChange(productId);
                            const selectedProduct = products.find(
                              (p) => p.id === productId
                            );
                            if (selectedProduct) {
                              form.setValue(
                                `items.${index}.unitPrice`,
                                selectedProduct.purchasePrice
                              );
                            }
                          }}
                          value={field.value?.toString()}
                          disabled={!selectedSupplierId || isProductsLoading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                isProductsLoading
                                  ? "Loading products..."
                                  : "Select product"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {isProductsLoading ? (
                              <div className="py-2 text-center text-sm text-muted-foreground">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                                Loading products...
                              </div>
                            ) : (
                              products.map((product) => (
                                <SelectItem
                                  key={product.id}
                                  value={product.id.toString()}
                                >
                                  {product.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Quantity</FormLabel>
                        <Input
                          type="number"
                          min="1"
                          className="w-full"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem className="flex-1">
                    <FormLabel>Unit Price</FormLabel>
                    <div className="w-full p-2 rounded-md border border-input bg-background text-sm">
                      {form.watch(`items.${index}.unitPrice`).toFixed(2)}
                    </div>
                  </FormItem>

                  <Button
                    type="button"
                    variant="destructive"
                    className="h-10"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  append({ productId: 1, quantity: 1, unitPrice: 0 })
                }
                disabled={!selectedSupplierId || isProductsLoading}
              >
                {isProductsLoading ? (
                  <Loading />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add Product
              </Button>
            </div>
          </Section>

          <Section title="Order Summary">
            <div className="flex justify-between p-4 bg-muted rounded-lg">
              <div className="font-medium">
                Total Quantity:{" "}
                {form
                  .watch("items")
                  .reduce((acc, item) => acc + item.quantity, 0)}
              </div>
              <div className="font-medium">
                Total Price:{" "}
                {form
                  .watch("items")
                  .reduce(
                    (acc, item) => acc + item.quantity * item.unitPrice,
                    0
                  )
                  .toFixed(2)}
              </div>
            </div>
          </Section>

          <Section title="Purchase Details">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <Input
                      type="date"
                      className="w-full"
                      value={field.value.toISOString().split("T")[0]}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <Input {...field} className="w-full" />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Section>
        </div>

        <div className="flex justify-end p-6">
          <Button type="submit" disabled={isSubmitting || isProductsLoading}>
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
