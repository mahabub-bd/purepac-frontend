"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SignUpForm from "@/components/auth/sign-up-form";
import Link from "next/link";

export default function RegisterForm() {
  return (
    <Card className="w-sm md:w-md lg:w-lg mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome to Purepac
        </CardTitle>
        <CardDescription className="text-center">
          Fill in your details to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <SignUpForm />
      </CardContent>
      <p className="text-sm text-muted-foreground text-center">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="ml-1">
          <Button variant="link" className="p-0 h-auto font-medium">
            Sign in
          </Button>
        </Link>
      </p>
    </Card>
  );
}
