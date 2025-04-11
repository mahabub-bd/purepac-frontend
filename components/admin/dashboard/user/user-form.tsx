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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { patchData, postData } from "@/utils/api-utils";
import { Role, User } from "@/utils/types";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .optional()
    .or(z.literal("")),
  mobileNumber: z
    .string()
    .min(10, { message: "Please enter a valid mobile number" })
    .startsWith("+880", { message: "Mobile number must start with +880" }),
  roles: z
    .array(z.nativeEnum(Role))
    .min(1, { message: "Please select at least one role" }),
  isVerified: z.boolean().default(false),
});

interface UserFormProps {
  user?: User;
  mode: "create" | "edit";
  onSuccess: () => void;
}

export function UserForm({ user, mode, onSuccess }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      mobileNumber: user?.mobileNumber || "+880",
      roles: (user?.roles as Role[]) || [],
      isVerified: user?.isVerified || false,
    },
  });

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await postData("users", values);
        toast.success("User created successfully");
      } else if (mode === "edit" && user) {
        const payload = { ...values };
        if (!payload.password) {
          delete payload.password;
        }

        await patchData(`users/${user.id}`, payload);
        toast.success("User updated successfully");
      }
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        mode === "create"
          ? "Failed to create user. Please try again."
          : "Failed to update user. Please try again."
      );
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
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>
                  {mode === "create"
                    ? "Password"
                    : "New Password (leave blank to keep current)"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
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
            name="roles"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Role</FormLabel>
                <Select
                  value={field.value[0]}
                  onValueChange={(value) => field.onChange([value as Role])}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            {mode === "create" ? "Create User" : "Update User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
