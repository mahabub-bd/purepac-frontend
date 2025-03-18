"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function MobileLoginForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes
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

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneNumber.length !== 10 || !phoneNumber.startsWith("1")) {
      toast.error("Invalid phone number", {
        description:
          "Please enter a valid Bangladesh mobile number starting with 1",
      });
      return;
    }

    toast.success("OTP Sent", {
      description: "A verification code has been sent to your mobile number",
    });

    setShowOtpForm(true);
    setOtpExpired(false);
    setTimer(180); // Reset timer
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

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join("").length !== 6) {
      toast.error("Invalid OTP", {
        description: "Please enter the complete 6-digit verification code",
      });
      return;
    }
    router.push("/dashboard");
    toast.success("Success", {
      description: "You have successfully signed in",
    });
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
                maxLength={11}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your 11-digit mobile number without the country code
            </p>
          </div>
          <Button type="submit" className="w-full">
            Send OTP
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
            >
              Change Number
            </Button>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto"
              onClick={handleSendOtp}
              disabled={!otpExpired}
            >
              {otpExpired ? "Resend OTP" : `Resend in ${timer}s`}
            </Button>
          </div>
          <Button type="submit" className="w-full ">
            Verify & Sign In
          </Button>
        </form>
      )}
    </div>
  );
}
