"use client";

import type React from "react";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onSuccess: (userId: string) => void;
}

export function OtpVerificationModal({
  isOpen,
  onClose,
  phoneNumber,
  onSuccess,
}: OtpVerificationModalProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(180); // 3 minutes
  const [otpExpired, setOtpExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let countdown: NodeJS.Timeout | undefined;
    if (isOpen && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpExpired(true);
    }
    return () => clearInterval(countdown);
  }, [isOpen, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    value = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      // Simulate OTP resend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("OTP sent", {
        description: `A new verification code has been sent to ${phoneNumber}`,
      });

      setOtpExpired(false);
      setTimer(180); // Reset timer
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      toast.error("Failed to send OTP", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Invalid OTP", {
        description: "Please enter the complete 6-digit verification code",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, we'll consider "123456" as a valid OTP
      if (otpCode === "123456") {
        toast.success("Verification successful", {
          description: "Your phone number has been verified",
        });
        onSuccess("user-123"); // Pass a mock user ID
        onClose();
      } else {
        toast.error("Invalid verification code", {
          description: "The code you entered is incorrect. Please try again.",
        });
      }
    } catch (error) {
      toast.error("Verification failed", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Phone Number</DialogTitle>
          <DialogDescription>
            Enter the 6-digit code sent to {phoneNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="otp-0">Verification Code</Label>
            <div className="flex gap-2 justify-between">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-12 text-center text-lg"
                  required
                  disabled={isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {otpExpired
                ? "Code expired"
                : `Code expires in ${formatTime(timer)}`}
            </span>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto"
              onClick={handleResendOtp}
              disabled={!otpExpired || isLoading}
            >
              {otpExpired ? "Resend code" : "Resend code"}
            </Button>
          </div>

          <Button
            onClick={handleVerifyOtp}
            className="w-full"
            disabled={isLoading || otp.some((digit) => !digit)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            By verifying your phone number, you agree to create an account and
            accept our{" "}
            <a href="/terms" className="underline underline-offset-2">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-2">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
