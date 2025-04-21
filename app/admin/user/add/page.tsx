"use client";

import { UserForm } from "@/components/admin/user/user-form";
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

export default function AddUserPage() {
  const router = useRouter();

  const handleSuccess = () => {
    toast.success("User created successfully");
    router.push("/admin/users/user-list");
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Enter the details for the new user.
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/user/user-list">Back to User List</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <UserForm mode="create" onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
