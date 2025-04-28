"use client";

import { mobileLogin, verifyOtp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MobileLoginFormWithServerActions() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes
  const [isLoading, setIsLoading] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState("");
  const router = useRouter();

  useEffect(() => {
    let countdown: string | number | NodeJS.Timeout | undefined;
    if (showOtpForm && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpExpired(true);
    }
    return () => clearInterval(countdown);
  }, [showOtpForm, timer]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneNumber.length !== 10 || !phoneNumber.startsWith("1")) {
      toast.error("Invalid phone number", {
        description:
          "Please enter a valid Bangladesh mobile number starting with 1",
      });
      return;
    }

    try {
      setIsLoading(true);

      const formattedNumber = `+880${phoneNumber}`;

      const response = await mobileLogin(formattedNumber);

      if ("otpExpiresAt" in response && response.otpExpiresAt) {
        setOtpExpiresAt(response.otpExpiresAt);
      }

      toast.info("OTP Sent", {
        description: `OTP Send to ${formattedNumber}`,
      });

      setShowOtpForm(true);
      setOtpExpired(false);
      setTimer(180); // Reset timer
    } catch (error) {
      toast.error("Failed to send OTP", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Invalid OTP", {
        description: "Please enter the complete 6-digit verification code",
      });
      return;
    }

    try {
      setIsLoading(true);
      const formattedNumber = `+880${phoneNumber}`;

      const result = await verifyOtp({
        mobileNumber: formattedNumber,
        otp: otpCode,
        otpExpiresAt: otpExpiresAt,
      });

      if (result?.success) {
        toast.success("Success", {
          description: "You have successfully signed in",
        });

        setTimeout(() => {
          router.push(result.redirect || "/user");
        }, 100);
      } else {
        toast.error(result?.message || "Verification failed");
      }
    } catch (error) {
      toast.error("Verification failed", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!showOtpForm ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile Number</Label>
            <div className="flex">
              <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                +880
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="1XXXXXXXXX"
                className="rounded-l-none"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                maxLength={10}
                required
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your 10-digit mobile number without the country code
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp-0">Enter Verification Code</Label>
            <p className="text-sm text-muted-foreground mb-2">
              We&apos;ve sent a 6-digit code to +880 {phoneNumber}
            </p>
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
                  className="w-12 h-12 text-center text-lg"
                  required
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto"
              onClick={() => setShowOtpForm(false)}
              disabled={isLoading}
            >
              Change Number
            </Button>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto"
              onClick={handleSendOtp}
              disabled={!otpExpired || isLoading}
            >
              {otpExpired ? "Resend OTP" : `Resend in ${timer}s`}
            </Button>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Sign In"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
