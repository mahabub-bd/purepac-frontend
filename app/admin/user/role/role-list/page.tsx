import Loading from "@/app/loading";
import { RoleList } from "@/components/admin/role/role-list";
import { Suspense } from "react";

export default function RolesPage() {
  return (
    <div className="p-6 space-y-6 border rounded-sm">
      <Suspense fallback={<Loading />}>
        <RoleList />
      </Suspense>
    </div>
  );
}
