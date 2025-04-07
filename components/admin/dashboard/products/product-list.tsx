"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import { ProductForm } from "./product-form";

import { formatCurrencyEnglish } from "@/lib/utils";
import { deleteData, fetchData } from "@/utils/api-utils";
import type { Brand, Category, Product } from "@/utils/types";
import {
  ArrowUpDown,
  Download,
  Eye,
  FileText,
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
import { useEffect, useState } from "react";
import { toast } from "sonner";

type SortField = "name" | "price" | "stock" | "sku";
type SortDirection = "asc" | "desc";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<"grid" | "table">("table");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetchData<Product[]>("products");

      if (Array.isArray(response)) {
        setProducts(response);
        filterProducts(response);
      } else {
        setProducts([]);
        setFilteredProducts([]);
        toast.error("Received invalid data format for products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products. Please try again.");
      setProducts([]);
      setFilteredProducts([]);
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

  const filterProducts = (productList = products) => {
    let filtered = [...productList];

    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.description.toLowerCase().includes(lowerCaseQuery) ||
          product.productSku.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (categoryFilter && categoryFilter !== "all") {
      const categoryId = Number.parseInt(categoryFilter);
      filtered = filtered.filter(
        (product) => product.category.id === categoryId
      );
    }

    if (brandFilter && brandFilter !== "all") {
      const brandId = Number.parseInt(brandFilter);
      filtered = filtered.filter((product) => product.brand.id === brandId);
    }

    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((product) => product.isActive === isActive);
    }

    if (featuredFilter && featuredFilter !== "all") {
      const isFeatured = featuredFilter === "featured";
      filtered = filtered.filter(
        (product) => product.isFeatured === isFeatured
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.unitprice - b.unitprice;
          break;
        case "stock":
          comparison = a.stock - b.stock;
          break;
        case "sku":
          comparison = a.productSku.localeCompare(b.productSku);
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [
    searchQuery,
    categoryFilter,
    brandFilter,
    statusFilter,
    featuredFilter,
    sortField,
    sortDirection,
    products,
  ]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
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

  const handleFormSuccess = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    fetchProducts();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setBrandFilter("");
    setStatusFilter("");
    setFeaturedFilter("");
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
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
        <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
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

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden flex flex-col h-full">
          <div className="relative aspect-square bg-muted/20">
            <Image
              src={product?.attachment?.url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain p-2"
            />
            {product.isFeatured && (
              <div className="absolute top-2 right-2">
                <Badge className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  Featured
                </Badge>
              </div>
            )}
          </div>
          <CardContent className="p-4 flex-grow">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-medium line-clamp-2">{product.name}</h3>
              <Badge
                variant={product.isActive ? "default" : "destructive"}
                className="shrink-0"
              >
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              SKU: {product.productSku}
            </div>
            <div className="mt-1 font-semibold">
              {formatCurrencyEnglish(product.unitprice)}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline">{product.brand.name}</Badge>
              <Badge variant="outline">{product.category.name}</Badge>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <div className="text-sm">
              Stock: <span className="font-medium">{product.stock}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(product)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDeleteClick(product)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>
              <button
                className="flex items-center gap-1 hover:text-primary transition-colors"
                onClick={() => handleSort("name")}
              >
                Name
                {sortField === "name" && (
                  <ArrowUpDown
                    className={`h-3 w-3 ${
                      sortDirection === "desc" ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            </TableHead>
            <TableHead>
              <button
                className="flex items-center gap-1 hover:text-primary transition-colors"
                onClick={() => handleSort("sku")}
              >
                SKU
                {sortField === "sku" && (
                  <ArrowUpDown
                    className={`h-3 w-3 ${
                      sortDirection === "desc" ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            </TableHead>
            <TableHead>
              <button
                className="flex items-center gap-1 hover:text-primary transition-colors"
                onClick={() => handleSort("price")}
              >
                Price
                {sortField === "price" && (
                  <ArrowUpDown
                    className={`h-3 w-3 ${
                      sortDirection === "desc" ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            </TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="hidden md:table-cell">Brand</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">
              <button
                className="flex items-center gap-1 hover:text-primary transition-colors"
                onClick={() => handleSort("stock")}
              >
                Stock
                {sortField === "stock" && (
                  <ArrowUpDown
                    className={`h-3 w-3 ${
                      sortDirection === "desc" ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            </TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
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
              <TableCell>{formatCurrencyEnglish(product.unitprice)}</TableCell>
              <TableCell className="capitalize">
                {product.unit.replace("_", " ")}
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
                    <DropdownMenuItem onClick={() => handleEdit(product)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
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
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage your product inventory</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.print()}
                    className="hidden md:flex"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Print product list</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hidden md:flex"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export products</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={activeView === "table" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-r-none"
                    onClick={() => setActiveView("table")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Table
                  </Button>
                  <Button
                    variant={activeView === "grid" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-l-none"
                    onClick={() => setActiveView("grid")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                </div>

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
                          onValueChange={setCategoryFilter}
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
                          onValueChange={setBrandFilter}
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
                          onValueChange={setStatusFilter}
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
                          onValueChange={setFeaturedFilter}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="featured">Featured</SelectItem>
                            <SelectItem value="not-featured">
                              Not Featured
                            </SelectItem>
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
                    Loading products...
                  </p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className="mt-6">
                {activeView === "table" ? renderTableView() : renderGridView()}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            {(searchQuery ||
              categoryFilter ||
              brandFilter ||
              statusFilter ||
              featuredFilter) &&
            filteredProducts.length !== products.length ? (
              <>
                Showing <strong>{filteredProducts.length}</strong> of{" "}
                <strong>{products.length}</strong> products
              </>
            ) : (
              <>
                Showing <strong>{filteredProducts.length}</strong>{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product. Fill in all the required information.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSuccess={handleFormSuccess}
            mode="create"
            brands={brands}
            categories={categories}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product information.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm
              onSuccess={handleFormSuccess}
              mode="edit"
              product={selectedProduct}
              brands={brands}
              categories={categories}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
