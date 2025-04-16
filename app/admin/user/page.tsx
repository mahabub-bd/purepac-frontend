import { UserList } from "@/components/admin/user/user-list";

export default function UsersPage() {
  return (
    <div className="flex flex-col w-full h-full p-6 space-y-6">
      <UserList />
    </div>
  );
}
