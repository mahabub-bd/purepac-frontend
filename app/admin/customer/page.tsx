import { CustomerList } from "@/components/admin/customer/customer-list";

export default function CustomersPage() {
  return (
    <div className="flex flex-col w-full h-full p-4 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      <CustomerList />
    </div>
  );
}
