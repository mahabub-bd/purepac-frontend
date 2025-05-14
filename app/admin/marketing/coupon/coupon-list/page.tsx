import { CouponList } from "@/components/admin/coupon/coupon-list";

export default async function CouponsPage() {
  return (
    <div className="p-6 space-y-6 border rounded-sm">
      <CouponList />
    </div>
  );
}
