"use client";

import EmailLoginForm from "@/components/auth/email-login-form";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import MobileLoginForm from "@/components/auth/mobile-login-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MailIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SignInForm() {
  const [activeTab, setActiveTab] = useState("mobile");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleForgotPassword = () => setShowForgotPassword(true);
  const handleBackFromForgotPassword = () => setShowForgotPassword(false);

  return (
    <div className="w-sm md:w-md lg:w-lg mx-auto md:p-8 p-4 shadow-2xl rounded-lg">
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-bold text-center">
          {showForgotPassword ? "Forgot Password" : "Sign In"}
        </h1>
        {!showForgotPassword && (
          <p className="text-sm text-muted-foreground text-center">
            Choose your preferred sign-in method
          </p>
        )}
      </div>

      {showForgotPassword ? (
        <ForgotPasswordForm onBack={handleBackFromForgotPassword} />
      ) : (
        <>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6 w-full">
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                <span>Mobile</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <MailIcon className="h-4 w-4" />
                <span>Email</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="mobile">
              <MobileLoginForm />
            </TabsContent>
            <TabsContent value="email">
              <EmailLoginForm onForgotPassword={handleForgotPassword} />
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-muted-foreground text-sm">
                OR
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2 mb-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>
        </>
      )}

      <p className="text-sm text-muted-foreground text-center mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/auth/sign-up" className="ml-1">
          <Button variant="link" className="p-0 h-auto font-medium">
            Sign up
          </Button>
        </Link>
      </p>
    </div>
  );
}
