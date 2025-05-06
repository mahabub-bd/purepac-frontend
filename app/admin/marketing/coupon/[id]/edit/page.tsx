"use client";

import { CouponForm } from "@/components/admin/coupon/coupon-form";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { fetchData } from "@/utils/api-utils";
import { Coupon } from "@/utils/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const couponId = params.id as string;

  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCouponData = async () => {
      try {
        const couponData = await fetchData<Coupon>(`coupons/${couponId}`);
        setCoupon(couponData);
      } catch (error) {
        console.error("Error fetching coupon:", error);
        toast.error("Failed to load coupon data");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCouponData();
  }, [couponId, router]);

  const handleSuccess = () => {
    toast.success("Coupon updated successfully");
    router.back();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading coupon data...
          </p>
        </div>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Coupon not found</h2>
          <p className="text-muted-foreground mt-2">
            The requested coupon could not be found.
          </p>
          <Button asChild className="mt-4">
            <Link href="/admin/marketing/coupon-list">Back to Coupons</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-6 p-2 space-y-6 border rounded-sm">
      <div className="md:p-6 p-2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <CardTitle>Coupon Information</CardTitle>
            <CardDescription>Update the coupon details.</CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/marketing/coupon-list">Back to Coupon List</Link>
          </Button>
        </div>
      </div>

      <CouponForm mode="edit" coupon={coupon} onSuccess={handleSuccess} />
    </div>
  );
}
