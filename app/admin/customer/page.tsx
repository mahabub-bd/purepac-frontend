import { CustomerList } from "@/components/admin/dashboard/customer/customer-list";

export default function CustomersPage() {
  return (
    <div className="flex flex-col w-full h-full p-4 space-y-4">
      <CustomerList />
    </div>
  );
}
