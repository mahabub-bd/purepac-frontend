"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

import { deleteData, fetchData } from "@/utils/api-utils";
import { Coupon } from "@/utils/types";
import { MoreHorizontal, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import { LoadingIndicator } from "../loading-indicator";
import { PageHeader } from "../page-header";

export function CouponList() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await fetchData("coupons");
      setCoupons(response as Coupon[]);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Failed to load coupons. Please try again.");
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDeleteClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCoupon) return;

    try {
      await deleteData("coupons", selectedCoupon.id);
      fetchCoupons();
      toast.success("Coupon deleted successfully");
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon. Please try again.");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Tag className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold">No coupons found</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Get started by creating your first coupon.
      </p>
      <Button asChild className="mt-4">
        <Link href="/admin/marketing/coupon/add">
          <Plus className="mr-2 h-4 w-4" /> Add Coupon
        </Link>
      </Button>
    </div>
  );

  const renderTableView = () => (
    <div className="md:p-6 p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Valid Period</TableHead>
            <TableHead>Max Discount</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell className="font-medium">
                <Badge variant="outline" className="font-mono">
                  {coupon.code}
                </Badge>
              </TableCell>
              <TableCell>
                {coupon.discountType === "percentage"
                  ? `${coupon.value}%`
                  : `${coupon.value}`}
              </TableCell>
              <TableCell>
                {coupon.timesUsed} / {coupon.maxUsage}
              </TableCell>
              <TableCell>
                {formatDateTime(coupon.validFrom)} -{" "}
                {formatDateTime(coupon.validUntil)}
              </TableCell>
              <TableCell>{coupon?.maxDiscountAmount}</TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant={coupon.isActive ? "default" : "secondary"}>
                  {coupon.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDateTime(coupon.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/admin/marketing/coupon/${coupon?.code}/edit`}
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteClick(coupon)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <div className="w-full md:p-6 p-2">
        <PageHeader
          title="Coupons"
          description="Manage discount coupons and promotions"
          actionLabel="Add Coupon"
          actionHref="/admin/marketing/coupon/add"
        />

        <div className="space-y-4">
          {isLoading ? (
            <LoadingIndicator message="Loading coupons..." />
          ) : coupons.length === 0 ? (
            renderEmptyState()
          ) : (
            <div>{renderTableView()}</div>
          )}
        </div>

        <div className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            {coupons.length} {coupons.length === 1 ? "coupon" : "coupons"}
          </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        defaultToast={false}
      />
    </>
  );
}
