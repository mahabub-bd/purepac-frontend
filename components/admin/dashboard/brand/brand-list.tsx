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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import { BrandForm } from "./brand-form";

import { deleteData, fetchData } from "@/utils/api-utils";
import { serverRevalidate } from "@/utils/revalidatePath";
import type { Brand } from "@/utils/types";
import {
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function BrandList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const response = await fetchData<Brand[]>("brands");

      if (Array.isArray(response)) {
        setBrands(response);
        filterBrands(response);
      } else {
        setBrands([]);
        setFilteredBrands([]);
        toast.error("Received invalid data format for brands");
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to load brands. Please try again.");
      setBrands([]);
      setFilteredBrands([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBrands = (brandList = brands) => {
    let filtered = [...brandList];

    // Apply search query
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (brand) =>
          brand.name.toLowerCase().includes(lowerCaseQuery) ||
          brand.description.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredBrands(filtered);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    filterBrands();
  }, [searchQuery, brands]);

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedBrand) return;

    try {
      await deleteData("brands", selectedBrand.id);
      fetchBrands();
      serverRevalidate("admin/brand");
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("Failed to delete brand. Please try again.");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleFormSuccess = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    fetchBrands();
  };

  const clearFilters = () => {
    setSearchQuery("");
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-muted-foreground"
        >
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H6a2 2 0 0 0 0-4H4a1 1 0 0 1-1-1V2" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold">No brands found</h3>
      <p className="text-sm text-muted-foreground mt-2">
        {searchQuery
          ? "No brands match your search criteria. Try a different search term."
          : "Get started by adding your first brand."}
      </p>
      {!searchQuery && (
        <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Brand
        </Button>
      )}
      {searchQuery && (
        <Button variant="outline" className="mt-4" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Brands</CardTitle>
            <CardDescription>Manage your product brands</CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Brand
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search brands..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFilters}
                  className="h-10 w-10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M3 6h18" />
                    <path d="M7 12h10" />
                    <path d="M10 18h4" />
                  </svg>
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Loading brands...
                  </p>
                </div>
              </div>
            ) : filteredBrands.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Logo</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Description
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Status
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Products
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBrands.map((brand) => (
                      <TableRow key={brand.id}>
                        <TableCell>
                          <div className="size-16 rounded-md overflow-hidden">
                            <Image
                              src={brand.attachment?.url || "/placeholder.svg"}
                              alt={brand.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {brand.name}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {brand.description}
                          </p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant={brand.isActive ? "default" : "secondary"}
                          >
                            {brand.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {brand.products?.length || 0}
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
                              <DropdownMenuItem
                                onClick={() => handleEdit(brand)}
                              >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteClick(brand)}
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
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            {searchQuery && filteredBrands.length !== brands.length ? (
              <>
                Showing <strong>{filteredBrands.length}</strong> of{" "}
                <strong>{brands.length}</strong> brands
              </>
            ) : (
              <>
                Showing <strong>{filteredBrands.length}</strong>{" "}
                {filteredBrands.length === 1 ? "brand" : "brands"}
              </>
            )}
          </div>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs"
            >
              Clear filters
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Add Brand Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
            <DialogDescription>
              Create a new brand. Fill in all the required information.
            </DialogDescription>
          </DialogHeader>
          <BrandForm onSuccess={handleFormSuccess} mode="create" />
        </DialogContent>
      </Dialog>

      {/* Edit Brand Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>Update the brand information.</DialogDescription>
          </DialogHeader>
          {selectedBrand && (
            <BrandForm
              onSuccess={handleFormSuccess}
              mode="edit"
              brand={selectedBrand}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        defaultToast={true}
        toastMessage="Brand deleted successfully"
      />
    </>
  );
}
