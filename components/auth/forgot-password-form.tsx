"use client";

import type React from "react";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon, CheckCircleIcon } from "lucide-react";

export default function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email) {
      toast.error("Email required", {
        description: "Please enter your email address",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to send password reset email
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would typically call your auth provider's password reset API
      // const { data, error } = await supabase.auth.resetPasswordForEmail(email)

      setIsSubmitted(true);
      toast.success("Reset link sent", {
        description:
          "If your email exists in our system, you'll receive a password reset link",
      });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error("Something went wrong", {
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Check your email</h3>
          <p className="text-muted-foreground">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsSubmitted(false)}
          >
            Try again
          </Button>
        </div>
        <Button variant="link" className="w-full" onClick={onBack}>
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mr-2"
            onClick={onBack}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h3 className="text-lg font-semibold">Reset your password</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </div>
  );
}
