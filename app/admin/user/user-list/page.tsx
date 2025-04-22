import Loading from "@/app/loading";
import { UserList } from "@/components/admin/user/user-list";
import { Suspense } from "react";

export default function UsersPage() {
  return (
    <div className="p-6 space-y-6 border rounded-sm">
      <Suspense fallback={<Loading />}>
        <UserList />
      </Suspense>
    </div>
  );
}
