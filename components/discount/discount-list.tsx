"use client";

import { format } from "date-fns";
import {
  Calendar,
  Edit,
  Loader2,
  PercentIcon,
  Plus,
  Search,
  Tag,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyEnglish } from "@/lib/utils";
import { fetchData, patchData } from "@/utils/api-utils";
import { DiscountType, type Product } from "@/utils/types";
import DeleteConfirmationDialog from "../admin/delete-confirmation-dialog";
import { PageHeader } from "../admin/page-header";

export function DiscountList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "upcoming" | "expired"
  >("all");
  const [discountTypeFilter, setDiscountTypeFilter] = useState<
    "all" | "percentage" | "fixed"
  >("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchDiscountedProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, statusFilter, discountTypeFilter]);

  const fetchDiscountedProducts = async () => {
    setIsLoading(true);
    try {
      const allProducts = await fetchData<Product[]>("products?limit=100");

      const discountedProducts = allProducts.filter(
        (product) => product.discountType
      );
      setProducts(discountedProducts);
      setFilteredProducts(discountedProducts);
    } catch (error) {
      console.error("Error fetching discounted products:", error);
      toast.error("Failed to load discounted products");
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((product) => {
        const now = new Date();
        const startDate = new Date(product.discountStartDate ?? 0);
        const endDate = new Date(product.discountEndDate ?? 0);

        switch (statusFilter) {
          case "active":
            return now >= startDate && now <= endDate;
          case "upcoming":
            return now < startDate;
          case "expired":
            return now > endDate;
          default:
            return true;
        }
      });
    }

    // Apply discount type filter
    if (discountTypeFilter !== "all") {
      result = result.filter((product) => {
        return discountTypeFilter === "percentage"
          ? product.discountType === DiscountType.PERCENTAGE
          : product.discountType === DiscountType.FIXED;
      });
    }

    setFilteredProducts(result);
  };

  const getDiscountStatus = (product: Product) => {
    const now = new Date();
    const startDate = new Date(product.discountStartDate ?? 0);
    const endDate = new Date(product.discountEndDate ?? 0);

    if (now > endDate) return "expired";
    if (now < startDate) return "upcoming";
    return "active";
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleRemoveDiscount = async () => {
    if (!selectedProduct) return;

    try {
      await patchData(`products/${selectedProduct.id}`, {
        discountType: null,
        discountValue: null,
        discountStartDate: null,
        discountEndDate: null,
      });

      toast.success("Discount removed successfully");
      fetchDiscountedProducts();
    } catch (error) {
      console.error("Error removing discount:", error);
      toast.error("Failed to remove discount");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDiscountTypeFilter("all");
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Tag className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No discounted products found</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        {searchQuery || statusFilter !== "all" || discountTypeFilter !== "all"
          ? "No products match your search criteria. Try different filters."
          : "Get started by adding discounts to your products."}
      </p>
      {!(
        searchQuery ||
        statusFilter !== "all" ||
        discountTypeFilter !== "all"
      ) && (
        <Button asChild className="mt-6">
          <Link href="/admin/marketing/discounts/add">
            <Plus className="mr-2 h-4 w-4" /> Create Discount
          </Link>
        </Button>
      )}
      {(searchQuery ||
        statusFilter !== "all" ||
        discountTypeFilter !== "all") && (
        <Button variant="outline" className="mt-6" onClick={clearFilters}>
          <XCircle className="mr-2 h-4 w-4" /> Clear Filters
        </Button>
      )}
    </div>
  );

  const calculateDiscountedPrice = (product: Product) => {
    if (!product.discountType || !product.discountValue)
      return product.sellingPrice;

    if (product.discountType === DiscountType.PERCENTAGE) {
      return product.sellingPrice * (1 - product.discountValue / 100);
    } else {
      return Math.max(0, product.sellingPrice - product.discountValue);
    }
  };

  const formatDiscountValue = (product: Product) => {
    if (!product.discountType || !product.discountValue) return "";

    if (product.discountType === DiscountType.PERCENTAGE) {
      return `${product.discountValue}%`;
    } else {
      return `${product.discountValue}`;
    }
  };

  const renderListView = () => (
    <div className="space-y-2">
      {filteredProducts.map((product) => {
        const discountStatus = getDiscountStatus(product);
        const discountedPrice = calculateDiscountedPrice(product);
        const savings = product.sellingPrice - discountedPrice;
        const savingsPercentage = (savings / product.sellingPrice) * 100;

        return (
          <div
            key={product.id}
            className="p-4 border rounded-lg hover:bg-muted/50"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{product.name}</h3>
                  <Badge
                    variant={
                      discountStatus === "active"
                        ? "default"
                        : discountStatus === "upcoming"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {discountStatus === "active"
                      ? "Active"
                      : discountStatus === "upcoming"
                      ? "Upcoming"
                      : "Expired"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {product.productSku}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">
                    {formatCurrencyEnglish(discountedPrice)}
                  </span>
                  <span className="text-sm line-through text-muted-foreground">
                    {formatCurrencyEnglish(product.sellingPrice)}
                  </span>
                  <span className="text-xs text-green-600">
                    Save {formatCurrencyEnglish(savings)} (
                    {savingsPercentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <PercentIcon className="h-3 w-3 mr-1" />
                    {formatDiscountValue(product)}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(
                      new Date(product.discountStartDate ?? 0),
                      "MMM d"
                    )}{" "}
                    - {format(new Date(product.discountEndDate ?? 0), "MMM d")}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteClick(product)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="w-full p-4 md:p-6 space-y-6">
        <PageHeader
          title="Product Discounts"
          description="Manage your product discounts and promotions"
          actionLabel="Create Discount"
          actionHref="/admin/marketing/discounts/add"
        />

        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search discounted products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(
                  value as "all" | "active" | "upcoming" | "expired"
                )
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={discountTypeFilter}
              onValueChange={(value) =>
                setDiscountTypeFilter(value as "all" | "percentage" | "fixed")
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery ||
              statusFilter !== "all" ||
              discountTypeFilter !== "all") && (
              <Button variant="ghost" size="icon" onClick={clearFilters}>
                <XCircle className="h-4 w-4" />
                <span className="sr-only">Clear filters</span>
              </Button>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              {filteredProducts.length} discounted product
              {filteredProducts.length !== 1 ? "s" : ""}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Loading discounted products...
                </p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            renderEmptyState()
          ) : (
            renderListView()
          )}
        </div>
      </div>

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleRemoveDiscount}
      />
    </>
  );
}
