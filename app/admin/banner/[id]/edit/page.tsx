"use client";

import { BannerForm } from "@/components/admin/banner/banner-form";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { fetchData } from "@/utils/api-utils";
import type { Banner } from "@/utils/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditBannerPage() {
  const params = useParams();
  const bannerId = params.id as string;

  const [banner, setBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBanner = async () => {
    try {
      const response = await fetchData<Banner>(`banners/${bannerId}`);
      setBanner(response);
    } catch (error) {
      console.error("Error fetching banner:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, [bannerId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Banner not found</p>
      </div>
    );
  }

  return (
    <div className="md:p-6 p:2 space-y-6 border rouunded-sm">
      <div className="md:p-6 p:2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <CardTitle>Edit Banner</CardTitle>
            <CardDescription>Update the banner information.</CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/banner/banner-list">Back to Banners</Link>
          </Button>
        </div>
      </div>

      <BannerForm mode="edit" banner={banner} />
    </div>
  );
}
