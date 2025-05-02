"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";

import {
  fetchData,
  formPostData,
  patchData,
  postData,
} from "@/utils/api-utils";
import {
  Supplier,
  Unit,
  type Brand,
  type Category,
  type Product,
} from "@/utils/types";
import { useRouter } from "next/navigation";

import { productSchema } from "@/utils/form-validation";
import { InfoBox, Section } from "../helper";

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
  brands: Brand[];
  categories: Category[];
}

export function ProductForm({
  mode,
  product,
  brands,
  categories,
}: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [imagePreview, setImagePreview] = useState(
    product?.attachment?.url || ""
  );
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    number | null
  >(null);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      sellingPrice: product?.sellingPrice || 0,
      purchasePrice: product?.purchasePrice || 0,
      stock: product?.stock || 0,
      unitId: product?.unit?.id || 0,
      productSku: product?.productSku || "",
      imageUrl: product?.attachment?.url || "",
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      brandId: product?.brand?.id || 0,
      categoryId: product?.category?.id || 0,
      supplierId: product?.supplier?.id || 0,
    },
  });

  useEffect(() => {
    // Initialize main category and subcategories for edit mode
    const initializeCategories = async () => {
      if (mode === "edit" && product?.category) {
        const mainCategory = categories.find(
          (c) =>
            c.id === product.category?.parentId ||
            (c.isMainCategory && c.id === product.category?.id)
        );

        if (mainCategory) {
          setSelectedMainCategory(mainCategory.id);
          await fetchSubCategories(mainCategory.id);

          // If category has a parent, it's a subcategory
          if (product.category.parentId) {
            form.setValue("categoryId", product.category.id);
          }
        }
      }
    };

    initializeCategories();
  }, [product, categories, mode, form]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [unitsResponse, suppliersResponse] = await Promise.all([
          fetchData<Unit[]>("units"),
          fetchData<Supplier[]>("suppliers"),
        ]);

        setUnits(unitsResponse);
        setSuppliers(suppliersResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load initial data");
      }
    };

    fetchInitialData();
  }, []);

  const fetchSubCategories = async (parentId: number) => {
    setIsLoadingSubCategories(true);
    try {
      const response = await fetchData<Category[]>(
        `categories?parentId=${parentId}`
      );
      setSubCategories(response);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to load subcategories");
    } finally {
      setIsLoadingSubCategories(false);
    }
  };

  const handleMainCategoryChange = async (value: string) => {
    const mainCategoryId = Number(value);
    setSelectedMainCategory(mainCategoryId);

    // Find the selected main category
    const selectedCategory = categories.find((c) => c.id === mainCategoryId);

    if (selectedCategory) {
      // Fetch subcategories for this main category
      await fetchSubCategories(mainCategoryId);

      // If there are subcategories, reset the categoryId
      if (subCategories.length > 0) {
        form.setValue("categoryId", 0);
      } else {
        // If no subcategories, use the main category directly
        form.setValue("categoryId", mainCategoryId);
      }
    }
  };

  const generateSku = () => {
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

    form.setValue("productSku", `${prefix}-${middle}-${suffix}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);

    const fileUrl = URL.createObjectURL(selectedFile);
    setImagePreview(fileUrl);

    form.setValue("imageUrl", "");
  };

  const handleSubmit = async (data: ProductFormValues) => {
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

      const endpoint =
        mode === "create" ? "products" : `products/${product?.id}`;
      const method = mode === "create" ? postData : patchData;

      const response = await method(endpoint, productData);

      if (response?.statusCode === 200 || response?.statusCode === 201) {
        const successMessage =
          mode === "create"
            ? "Product created successfully"
            : "Product updated successfully";
        toast.success(successMessage);
        router.back();
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
      if (imagePreview && !imagePreview.startsWith("http")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="p-6 space-y-6">
          <Section title="Basic Information">
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
          </Section>

          <Section title="Product Identification">
            <div className="grid grid-cols-1 gap-6">
              {/* Row 1: SKU and Unit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="productSku"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>SKU</FormLabel>
                      <div className="grid gap-4  grid-cols-2 w-full">
                        <FormControl className="w-full">
                          <Input
                            placeholder="Enter product SKU"
                            {...field}
                            className="w-full"
                          />
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
                  name="unitId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Unit</FormLabel>
                      <FormControl className="w-full">
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={
                            field.value && field.value > 0
                              ? field.value.toString()
                              : undefined
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {units?.map((unit: Unit) => (
                              <SelectItem
                                key={unit.id}
                                value={unit.id.toString()}
                              >
                                {unit.name}
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

              {/* Row 2: Supplier and Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Supplier</FormLabel>
                      <FormControl className="w-full">
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={
                            field.value && field.value > 0
                              ? field.value.toString()
                              : undefined
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers?.map((supplier: Supplier) => (
                              <SelectItem
                                key={supplier.id}
                                value={supplier.id.toString()}
                              >
                                {supplier?.name}
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
                  name="brandId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Brand</FormLabel>
                      <FormControl className="w-full">
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={
                            field.value && field.value > 0
                              ? field.value.toString()
                              : undefined
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
              </div>

              {/* Row 3: Main Category and Sub Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem className="w-full">
                  <FormLabel>Main Category</FormLabel>
                  <Select
                    onValueChange={handleMainCategoryChange}
                    value={selectedMainCategory?.toString() || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select main category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => c.isMainCategory)
                        .map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>

                <FormItem className="w-full">
                  <FormLabel>Sub Category</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("categoryId", Number(value))
                    }
                    value={form.watch("categoryId")?.toString() || ""}
                    disabled={!selectedMainCategory || isLoadingSubCategories}
                  >
                    <SelectTrigger className="w-full">
                      {isLoadingSubCategories ? (
                        <span>Loading subcategories...</span>
                      ) : (
                        <SelectValue placeholder="Select sub category" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.length > 0 ? (
                        subCategories.map((subCategory) => (
                          <SelectItem
                            key={subCategory.id}
                            value={subCategory.id.toString()}
                          >
                            {subCategory.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-sm p-2 text-muted-foreground">
                          No subcategories available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </div>
            </div>
          </Section>

          <Section title="Pricing & Inventory">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>
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
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Price</FormLabel>
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
            <InfoBox
              title="Inventory Management"
              description="Stock levels will automatically update when orders are processed. You can manually adjust stock levels at any time."
            />
          </Section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="Media">
              <FormField
                control={form.control}
                name="imageUrl"
                render={() => (
                  <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        {imagePreview ? (
                          <div className="relative w-32 h-32 border rounded-md overflow-hidden bg-gray-50">
                            <Image
                              src={imagePreview}
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
                              document.getElementById("product-upload")?.click()
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
            </Section>

            <Section title="Status">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <SwitchCard
                      label="Active Status"
                      description="Product will be visible to customers"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <SwitchCard
                      label="Featured Product"
                      description="Product will appear in featured sections"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </Section>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t">
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

const SwitchCard = ({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center justify-between rounded-lg border p-4">
    <div className="space-y-0.5">
      <p className="text-base font-medium">{label}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);
