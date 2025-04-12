"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { formPostData, patchData, postData } from "@/utils/api-utils";

import {
  ProductUnit,
  type Brand,
  type Category,
  type Product,
} from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  unitprice: z.coerce.number().min(0.01, "unitprice must be greater than 0"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  unit: z.string().min(1, "Unit is required"),
  productSku: z.string().min(1, "SKU is required"),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  brandId: z.number().min(1, "Brand is required"),
  categoryId: z.number().min(1, "Category is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
  brands: Brand[];
  categories: Category[];
  onSuccess: () => void;
}

export function ProductForm({
  mode,
  product,
  brands,
  categories,
  onSuccess,
}: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string>(
    product?.attachment?.url || ""
  );
  const [activeTab, setActiveTab] = useState<string>("basic");

  const generateSku = () => {
    // Generate a random alphanumeric SKU with format: XX-NNNN-XX
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    const prefix = Array(2)
      .fill(0)
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join("");
    const middle = Array(4)
      .fill(0)
      .map(() => numbers.charAt(Math.floor(Math.random() * numbers.length)))
      .join("");
    const suffix = Array(2)
      .fill(0)
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join("");

    const sku = `${prefix}-${middle}-${suffix}`;
    form.setValue("productSku", sku);
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      unitprice: product?.unitprice || 0,
      stock: product?.stock || 0,
      unit: product?.unit || ProductUnit.PIECE,
      productSku: product?.productSku || "",
      imageUrl: product?.attachment?.url || "",
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      brandId: product?.brand?.id || 0,
      categoryId: product?.category?.id || 0,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);

      const fileUrl = URL.createObjectURL(selectedFile);
      setLogoPreview(fileUrl);

      form.setValue("imageUrl", "");
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      let attachmentId = product?.attachment?.id;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await formPostData("attachment", formData);
        attachmentId = result.data.id;
      }

      const productData = {
        ...data,
        attachment: attachmentId,
      };

      let response;

      if (mode === "create") {
        response = await postData("products", productData);
      } else if (mode === "edit" && product) {
        response = await patchData(`products/${product.id}`, productData);
      }

      if (response?.statusCode === 200 || response?.statusCode === 201) {
        toast.success(
          mode === "create"
            ? "Product created successfully"
            : "Product updated successfully"
        );
        onSuccess();
      } else {
        toast.error(response?.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error submitting product form:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (logoPreview && !logoPreview.startsWith("http")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
                <TabsTrigger value="media">Media & Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1  gap-4">
                  <FormField
                    control={form.control}
                    name="productSku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <div className="grid grid-cols-2 gap-4">
                          <FormControl>
                            <Input placeholder="Enter product SKU" {...field} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={generateSku}
                            className="whitespace-nowrap bg-green-200"
                          >
                            Generate SKU
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                className="capitalize"
                                placeholder="Select unit"
                              />
                            </SelectTrigger>
                            <SelectContent className="capitalize">
                              {Object.values(ProductUnit).map((unit) => (
                                <SelectItem
                                  className="capitalize"
                                  key={unit}
                                  value={unit}
                                >
                                  {unit.replace("_", " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="brandId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            defaultValue={
                              field.value ? field.value.toString() : undefined
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select brand" />
                            </SelectTrigger>
                            <SelectContent>
                              {brands.map((brand) => (
                                <SelectItem
                                  key={brand.id}
                                  value={brand.id.toString()}
                                >
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            defaultValue={
                              field.value ? field.value.toString() : undefined
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter product description"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="unitprice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-muted/30 p-4 rounded-lg border border-muted flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                      Inventory Management
                    </p>
                    <p>
                      Stock levels will automatically update when orders are
                      processed. You can manually adjust stock levels at any
                      time.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({}) => (
                      <FormItem>
                        <FormLabel>Product Image</FormLabel>
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-4">
                            {logoPreview ? (
                              <div className="relative w-32 h-32 border rounded-md overflow-hidden bg-gray-50">
                                <Image
                                  src={logoPreview || "/placeholder.svg"}
                                  alt="Product preview"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-32 h-32 border rounded-md bg-muted/20">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex flex-col gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  document
                                    .getElementById("product-upload")
                                    ?.click()
                                }
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Choose File
                              </Button>
                              <span className="text-sm text-muted-foreground">
                                {fileName || "No file chosen"}
                              </span>
                            </div>
                          </div>
                          <Input
                            id="product-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Active Status
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Product will be visible to customers
                          </div>
                          <FormMessage />
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

                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Featured Product
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Product will appear in featured sections
                          </div>
                          <FormMessage />
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Creating..." : "Updating..."}
              </>
            ) : (
              <>{mode === "create" ? "Create Product" : "Update Product"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
