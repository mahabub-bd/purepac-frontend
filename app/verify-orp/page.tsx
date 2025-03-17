"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

const otpSchema = z.object({
  otp: z.string().min(6, { message: "OTP must be 6 digits" }).max(6),
})

export default function VerifyOTP() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [phone, setPhone] = useState<string>("")
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  useEffect(() => {
    const phoneParam = searchParams.get("phone")
    if (phoneParam) {
      setPhone(phoneParam)
    } else {
      // If no phone number is provided, redirect back to sign in
      router.push("/")
    }
  }, [searchParams, router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  function onSubmit(data: z.infer<typeof otpSchema>) {
    console.log("Verifying OTP:", data.otp, "for phone:", phone)
    // In a real app, you would verify the OTP here
    // If successful, redirect to the dashboard or home page
    router.push("/")
  }

  function handleResendOTP() {
    if (canResend) {
      console.log("Resending OTP to:", phone)
      // In a real app, you would resend the OTP here
      setCountdown(30)
      setCanResend(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
          <CardDescription>We&apos;ve sent a 6-digit code to {phone}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Enter 6-digit verification code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>Please enter the verification code sent to {phone}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Verify
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">Didn&apos;t receive the code?</p>
          <Button variant="link" onClick={handleResendOTP} disabled={!canResend} className="h-auto p-0">
            {canResend ? "Resend OTP" : `Resend OTP in ${countdown}s`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

