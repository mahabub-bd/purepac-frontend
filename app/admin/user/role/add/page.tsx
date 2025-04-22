"use client";

import { RoleForm } from "@/components/admin/role/role-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddRolePage() {
  const router = useRouter();

  const handleSuccess = () => {
    toast.success("Role created successfully");
    router.push("/admin/user/role/role-list");
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Role Information</CardTitle>
              <CardDescription>
                Enter the details for the new role.
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/user/role/role-list">Back to Role List</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <RoleForm mode="create" onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
