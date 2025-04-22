import Loading from "@/app/loading";
import { CustomerList } from "@/components/admin/customer/customer-list";
import { Suspense } from "react";

export default function CustomersPage() {
  return (
    <div className="p-6 space-y-6 border rounded-sm">
      <Suspense fallback={<Loading />}>
        <CustomerList />
      </Suspense>
    </div>
  );
}
