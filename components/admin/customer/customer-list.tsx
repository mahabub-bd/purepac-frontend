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

import { CustomerForm } from "./customer-form";

import { formatDateTime } from "@/lib/utils";
import { fetchData } from "@/utils/api-utils";

import { User } from "@/utils/types";
import {
  Loader2,
  MoreHorizontal,
  Pencil,
  Search,
  UserCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function CustomerList() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetchData<User[]>("users?roleType=customer");

      if (Array.isArray(response)) {
        setCustomers(response);
        filterCustomers(response);
      } else {
        setCustomers([]);
        setFilteredCustomers([]);
        toast.error("Received invalid data format for customers");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers. Please try again.");
      setCustomers([]);
      setFilteredCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCustomers = (customerList = customers) => {
    let filtered = [...customerList];

    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(lowerCaseQuery) ||
          customer.email.toLowerCase().includes(lowerCaseQuery) ||
          customer.mobileNumber.includes(lowerCaseQuery)
      );
    }

    setFilteredCustomers(filtered);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchQuery, customers]);

  const handleEdit = (customer: User) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setIsEditDialogOpen(false);
    fetchCustomers();
  };

  const clearFilters = () => {
    setSearchQuery("");
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center mb-4">
        <UserCircle className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No customers found</h3>
      <p className="text-sm text-muted-foreground mt-2">
        {searchQuery
          ? "No customers match your search criteria. Try a different search term."
          : "There are currently no customers in the system."}
      </p>
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
        <CardHeader>
          <div>
            <CardTitle>Customers</CardTitle>
            <CardDescription>Manage your customer accounts</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search customers..."
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
                    Loading customers...
                  </p>
                </div>
              </div>
            ) : filteredCustomers.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Mobile
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Status
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Last Login
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          {customer.name}
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {customer.mobileNumber || "N/A"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant={
                              customer.isVerified ? "default" : "secondary"
                            }
                          >
                            {customer.isVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {customer?.lastLoginAt
                            ? formatDateTime(customer.lastLoginAt)
                            : "Never logged in"}
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
                                onClick={() => handleEdit(customer)}
                              >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
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
            {searchQuery && filteredCustomers.length !== customers.length ? (
              <>
                Showing <strong>{filteredCustomers.length}</strong> of{" "}
                <strong>{customers.length}</strong> customers
              </>
            ) : (
              <>
                Showing <strong>{filteredCustomers.length}</strong>{" "}
                {filteredCustomers.length === 1 ? "customer" : "customers"}
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

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update the customer information.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <CustomerForm
              onSuccess={handleFormSuccess}
              customer={selectedCustomer}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
