"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PaginationComponent } from "@/components/common/pagination";
import { formatCurrencyEnglish } from "@/lib/utils";
import { deleteData, fetchData, fetchDataPagination } from "@/utils/api-utils";
import type { Brand, Category, Product } from "@/utils/types";
import {
  Filter,
  Loader2,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";

interface ProductListProps {
  initialPage: number;
  initialLimit: number;
  initialSearchParams?: { [key: string]: string | string[] | undefined };
}

export function ProductList({
  initialPage,
  initialLimit,
  initialSearchParams = {},
}: ProductListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getInitialParam = (key: string) => {
    const param = searchParams?.get(key);
    return param ? param : initialSearchParams?.[key] || "";
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState(
    getInitialParam("search") as string
  );
  const [categoryFilter, setCategoryFilter] = useState(
    getInitialParam("category") as string
  );
  const [brandFilter, setBrandFilter] = useState(
    getInitialParam("brand") as string
  );
  const [statusFilter, setStatusFilter] = useState(
    getInitialParam("status") as string
  );
  const [featuredFilter, setFeaturedFilter] = useState(
    getInitialParam("featured") as string
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();

    params.set("page", currentPage.toString());
    params.set("limit", limit.toString());

    if (searchQuery) params.set("search", searchQuery);
    if (categoryFilter && categoryFilter !== "all")
      params.set("category", categoryFilter);
    if (brandFilter && brandFilter !== "all") params.set("brand", brandFilter);
    if (statusFilter && statusFilter !== "all")
      params.set("status", statusFilter);
    if (featuredFilter && featuredFilter !== "all")
      params.set("featured", featuredFilter);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    router,
    pathname,
    currentPage,
    limit,
    searchQuery,
    categoryFilter,
    brandFilter,
    statusFilter,
    featuredFilter,
  ]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", limit.toString());

      if (searchQuery) params.append("search", searchQuery);
      if (categoryFilter && categoryFilter !== "all")
        params.append("category", categoryFilter);
      if (brandFilter && brandFilter !== "all")
        params.append("brand", brandFilter);
      if (statusFilter && statusFilter !== "all")
        params.append("status", statusFilter);
      if (featuredFilter && featuredFilter !== "all")
        params.append("featured", featuredFilter);

      const response = await fetchDataPagination<{
        data: Product[];
        total: number;
        totalPages: number;
      }>(`products?${params.toString()}`);
      setProducts(response.data);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetchData<Brand[]>("brands");
      if (Array.isArray(response)) {
        setBrands(response);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to load brands");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetchData<Category[]>("categories");
      if (Array.isArray(response)) {
        setCategories(response);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    updateUrl();
  }, [
    currentPage,
    limit,
    searchQuery,
    categoryFilter,
    brandFilter,
    statusFilter,
    featuredFilter,
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await deleteData("products", selectedProduct.id);
      fetchProducts();
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setBrandFilter("");
    setStatusFilter("");
    setFeaturedFilter("");
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Package className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold">No products found</h3>
      <p className="text-sm text-muted-foreground mt-2">
        {searchQuery ||
        categoryFilter ||
        brandFilter ||
        statusFilter ||
        featuredFilter
          ? "No products match your search criteria. Try different filters."
          : "Get started by adding your first product."}
      </p>
      {!(
        searchQuery ||
        categoryFilter ||
        brandFilter ||
        statusFilter ||
        featuredFilter
      ) && (
        <Button asChild className="mt-4">
          <Link href="/products/add">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      )}
      {(searchQuery ||
        categoryFilter ||
        brandFilter ||
        statusFilter ||
        featuredFilter) && (
        <Button variant="outline" className="mt-4" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );

  const renderActiveFilters = () => {
    const hasFilters =
      searchQuery ||
      categoryFilter ||
      brandFilter ||
      statusFilter ||
      featuredFilter;

    if (!hasFilters) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {searchQuery && (
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-3 py-1"
          >
            Search: {searchQuery}
            <button onClick={() => setSearchQuery("")} className="ml-1">
              <XCircle className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {categoryFilter && categoryFilter !== "all" && (
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-3 py-1"
          >
            Category:{" "}
            {categories.find((c) => c.id.toString() === categoryFilter)?.name ||
              categoryFilter}
            <button onClick={() => setCategoryFilter("")} className="ml-1">
              <XCircle className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {brandFilter && brandFilter !== "all" && (
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-3 py-1"
          >
            Brand:{" "}
            {brands.find((b) => b.id.toString() === brandFilter)?.name ||
              brandFilter}
            <button onClick={() => setBrandFilter("")} className="ml-1">
              <XCircle className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {statusFilter && statusFilter !== "all" && (
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-3 py-1"
          >
            Status: {statusFilter}
            <button onClick={() => setStatusFilter("")} className="ml-1">
              <XCircle className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {featuredFilter && featuredFilter !== "all" && (
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-3 py-1"
          >
            {featuredFilter === "featured" ? "Featured" : "Not Featured"}
            <button onClick={() => setFeaturedFilter("")} className="ml-1">
              <XCircle className="h-3 w-3" />
            </button>
          </Badge>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-7 text-xs"
        >
          Clear all
        </Button>
      </div>
    );
  };

  const renderTableView = () => (
    <div className="md:p-6 p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="hidden md:table-cell">Brand</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">Stock</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="rounded-md overflow-hidden">
                  <Image
                    src={product?.attachment?.url || "/placeholder.svg"}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium text-wrap">
                {product.name}
              </TableCell>
              <TableCell>{product.productSku}</TableCell>
              <TableCell>{formatCurrencyEnglish(product.sellingPrice)}</TableCell>
              <TableCell className="capitalize">
                {product?.unit?.name}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {product.brand.name}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {product.category.name}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {product.stock}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant={product.isActive ? "default" : "destructive"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge
                  variant={product.isFeatured ? "default" : "secondary"}
                  className="flex items-center gap-1"
                >
                  {product.isFeatured && (
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  )}
                  {product.isFeatured ? "Featured" : "Regular"}
                </Badge>
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
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteClick(product)}
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
        <div className="flex flex-row items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Products</h2>
            <p className="text-sm text-muted-foreground">
              Manage your product inventory
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/admin/products/add">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <div className="grid gap-3 p-2">
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold">Category</h4>
                      <Select
                        value={categoryFilter}
                        onValueChange={(value) => {
                          setCategoryFilter(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold">Brand</h4>
                      <Select
                        value={brandFilter}
                        onValueChange={(value) => {
                          setBrandFilter(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All Brands" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Brands</SelectItem>
                          {brands.map((brand) => (
                            <SelectItem
                              key={brand.id}
                              value={brand.id.toString()}
                            >
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold">Status</h4>
                      <Select
                        value={statusFilter}
                        onValueChange={(value) => {
                          setStatusFilter(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold">Featured</h4>
                      <Select
                        value={featuredFilter}
                        onValueChange={(value) => {
                          setFeaturedFilter(value);
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="true">Featured</SelectItem>
                          <SelectItem value="false">Not Featured</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(categoryFilter ||
                      brandFilter ||
                      statusFilter ||
                      featuredFilter) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="mt-2"
                      >
                        Reset Filters
                      </Button>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {renderActiveFilters()}

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Loading Products...
                </p>
              </div>
            </div>
          ) : products.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="mt-6">{renderTableView()}</div>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground text-center md:text-left truncate">
              {`Showing ${products.length} of ${totalItems} products`}
            </p>
          </div>

          <div className="flex-1 w-full md:w-auto">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="#"
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
