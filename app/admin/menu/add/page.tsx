"use client";

import { MenuForm } from "@/components/admin/menu/menu-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function AddMenuPage() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Add New Menu Item</CardTitle>
              <CardDescription>
                Create a new menu item. Fill in all the required information.
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/menu/menu-list">Back to Menu</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <MenuForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
