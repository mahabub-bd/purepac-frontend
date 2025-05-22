"use client";

import type React from "react";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postData } from "@/utils/api-utils";

export function Subscription() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();

    // Reset error state
    setError(null);

    // Validate email
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await postData("subscribers", { email });
      if (result.statusCode === 409) {
        toast.error("Subscription failed", {
          description: "This email is already subscribed.",
        });
        setError("This email is already subscribed.");
        return;
      }
      toast.success("Subscription successful!", {
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast.error("Subscription failed", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubscribe}
      className="flex w-full  items-center space-x-2"
    >
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={error ? "border-red-500" : ""}
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Subscribe"
        )}
      </Button>
      {error && (
        <div className="absolute mt-16 text-sm text-red-500">{error}</div>
      )}
    </form>
  );
}
