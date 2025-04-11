"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { patchData } from "@/utils/api-utils";
import { User } from "@/utils/types";


import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const customerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  mobileNumber: z
    .string()
    .min(10, { message: "Please enter a valid mobile number" })
    .startsWith("+880", { message: "Mobile number must start with +880" }),
  isVerified: z.boolean().default(false),
});

interface CustomerFormProps {
  customer: User;
  onSuccess: () => void;
}

export function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email,
      mobileNumber: customer.mobileNumber || "+880",
      isVerified: customer.isVerified || false,
    },
  });

  const onSubmit = async (values: z.infer<typeof customerSchema>) => {
    setIsSubmitting(true);
    try {
      await patchData(`users/${customer.id}`, values);
      toast.success("Customer updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update customer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter name"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+880"
                    {...field}
                    className="w-full"
                    onChange={(e) => {
                      // Ensure the input starts with +880
                      if (!e.target.value.startsWith("+880")) {
                        if (e.target.value === "") {
                          field.onChange("+880");
                        } else if (!e.target.value.startsWith("+")) {
                          field.onChange(`+880${e.target.value}`);
                        } else {
                          field.onChange("+880");
                        }
                      } else {
                        field.onChange(e.target.value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isVerified"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0">
                <div className="space-y-0.5">
                  <FormLabel>Verified Status</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={isSubmitting}
            className="w-24"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-32">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Customer
          </Button>
        </div>
      </form>
    </Form>
  );
}
