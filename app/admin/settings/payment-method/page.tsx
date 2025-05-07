import { PaymentMethodList } from "@/components/admin/payment-method/payment-method-list";

export default async function ShippingMethodPage() {
  return (
    <div className="p-6 space-y-6 border rounded-sm">
      <PaymentMethodList />
    </div>
  );
}
