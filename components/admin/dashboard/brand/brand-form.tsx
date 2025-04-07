"use client";

import type React from "react";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { formPostData, patchData, postData } from "@/utils/api-utils";
import type { Brand } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  description: z.string().min(1, "Description is required"),
  logoUrl: z.string().optional(), // Made optional since we'll use file upload
  isActive: z.boolean().default(true),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandFormProps {
  mode: "create" | "edit";
  brand?: Brand;
  onSuccess: () => void;
}

export function BrandForm({ mode, brand, onSuccess }: BrandFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string>(
    brand?.attachment?.url || ""
  );

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name || "",
      description: brand?.description || "",
      logoUrl: brand?.attachment?.url || "",
      isActive: brand?.isActive ?? true,
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);

      const fileUrl = URL.createObjectURL(selectedFile);
      setLogoPreview(fileUrl);

      form.setValue("logoUrl", "");
    }
  };

  const onSubmit = async (data: BrandFormValues) => {
    setIsSubmitting(true);
    try {
      let attachmentId = brand?.attachment?.id;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await formPostData("attachment", formData);
        attachmentId = result.data.id;
      }

      const brandData = {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        attachment: attachmentId,
      };

      let response;
      if (mode === "create") {
        response = await postData("brands", brandData);
      } else if (mode === "edit" && brand) {
        response = await patchData(`brands/${brand.id}`, brandData);
      }

      if (response?.statusCode === 200 || response?.statusCode === 201) {
        toast.success(
          mode === "create"
            ? "Brand created successfully"
            : "Brand updated successfully"
        );
        onSuccess();
      } else {
        toast.error(response?.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error submitting brand form:", error);
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
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="logoUrl"
            render={({}) => (
              <FormItem>
                <FormLabel>Logo</FormLabel>
                <div className="flex flex-col gap-4">
                  {logoPreview && (
                    <div className="relative w-32 h-32 border rounded-md overflow-hidden bg-gray-50">
                      <Image
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("logo-upload")?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose File
                    </Button>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <span className="text-sm text-muted-foreground">
                      {fileName || "No file chosen"}
                    </span>
                  </div>
                </div>
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
                    placeholder="Enter brand description"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
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
              <>{mode === "create" ? "Create Brand" : "Update Brand"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
