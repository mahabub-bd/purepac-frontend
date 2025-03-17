"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PhoneIcon, MailIcon } from "lucide-react";
import MobileLoginForm from "./mobile-login-form";
import EmailLoginForm from "./email-login-form";
import SignUpForm from "./sign-up-form";
import ForgotPasswordForm from "./forgot-password-form";

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState("mobile");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackFromForgotPassword = () => {
    setShowForgotPassword(false);
    setActiveTab("email");
  };

  // Reset forgot password state when switching to sign up
  const handleToggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setShowForgotPassword(false);
  };

  return (
    <Card className="w-md ">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {showForgotPassword
            ? "Forgot Password"
            : isSignUp
            ? "Create Account"
            : "Sign In"}
        </CardTitle>
        {!showForgotPassword && (
          <CardDescription className="text-center">
            {isSignUp
              ? "Fill in your details to create a new account"
              : "Choose your preferred sign in method"}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {showForgotPassword ? (
          <ForgotPasswordForm onBack={handleBackFromForgotPassword} />
        ) : isSignUp ? (
          <SignUpForm />
        ) : (
          <>
            <Tabs
              defaultValue="mobile"
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
      </CardContent>
      <CardFooter className="flex justify-center">
        {!showForgotPassword && (
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-medium"
              onClick={handleToggleSignUp}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </Button>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
