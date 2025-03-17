"use client";

import type React from "react";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, CheckIcon, XIcon } from "lucide-react";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength requirements
  const passwordRequirements = [
    {
      label: "At least 8 characters",
      test: (pass: string) => pass.length >= 8,
    },
    {
      label: "At least one uppercase letter",
      test: (pass: string) => /[A-Z]/.test(pass),
    },
    {
      label: "At least one lowercase letter",
      test: (pass: string) => /[a-z]/.test(pass),
    },
    {
      label: "At least one number",
      test: (pass: string) => /[0-9]/.test(pass),
    },
    {
      label: "At least one special character",
      test: (pass: string) => /[^A-Za-z0-9]/.test(pass),
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Special handling for phone number to only allow digits
    if (name === "phoneNumber") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: digitsOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address",
      });
      return;
    }

    // Validate Bangladesh mobile number
    if (
      formData.phoneNumber.length !== 10 ||
      !formData.phoneNumber.startsWith("1")
    ) {
      toast.error("Invalid phone number", {
        description:
          "Please enter a valid Bangladesh mobile number starting with 1",
      });
      return;
    }

    // Validate password strength
    const failedRequirements = passwordRequirements.filter(
      (req) => !req.test(formData.password)
    );
    if (failedRequirements.length > 0) {
      toast.error("Weak password", {
        description: `Your password doesn't meet the following requirements: ${failedRequirements
          .map((r) => r.label)
          .join(", ")}`,
      });
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure your passwords match",
      });
      return;
    }

    // Simulate account creation
    toast.success("Account created", {
      description: "Your account has been successfully created",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber"> Mobile Number</Label>
        <div className="flex">
          <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
            +880
          </div>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="1XXXXXXXXX"
            className="rounded-l-none"
            value={formData.phoneNumber}
            onChange={handleChange}
            maxLength={10}
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Enter your 11-digit mobile number without the country code
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeIcon className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>

        {/* Password strength indicators */}
        <div className="space-y-1 mt-2">
          <p className="text-xs font-medium">Password must contain:</p>
          <ul className="space-y-1">
            {passwordRequirements.map((req, index) => (
              <li key={index} className="text-xs flex items-center gap-1.5">
                {req.test(formData.password) ? (
                  <CheckIcon className="h-3 w-3 text-green-500" />
                ) : (
                  <XIcon className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={
                    req.test(formData.password)
                      ? "text-green-500"
                      : "text-muted-foreground"
                  }
                >
                  {req.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeIcon className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showConfirmPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
        {formData.password &&
          formData.confirmPassword &&
          formData.password !== formData.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
          )}
      </div>

      <Button type="submit" className="w-full mt-6">
        Create Account
      </Button>
    </form>
  );
}
