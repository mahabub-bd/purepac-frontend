"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

export function SecuritySettings() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsChangingPassword(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTwoFactorToggle = (checked: boolean) => {
    setTwoFactorEnabled(checked);
    toast.success(
      `Two-factor authentication ${checked ? "enabled" : "disabled"}`
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="password-form"
            onSubmit={handlePasswordChange}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" required />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            form="password-form"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? "Updating..." : "Update Password"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor">Two-factor authentication</Label>
              <p className="text-sm text-muted-foreground">
                Receive a verification code via SMS when signing in
              </p>
            </div>
            <Switch
              id="two-factor"
              checked={twoFactorEnabled}
              onCheckedChange={handleTwoFactorToggle}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your active sessions across devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{session.device}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.location} • Last active {session.lastActive}
                  </p>
                </div>
                {session.current ? (
                  <Button variant="outline" size="sm" disabled>
                    Current
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            Sign Out All Devices
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

const activeSessions = [
  {
    id: "1",
    device: "Chrome on Windows",
    location: "New York, USA",
    lastActive: "Just now",
    current: true,
  },
  {
    id: "2",
    device: "Safari on iPhone",
    location: "Los Angeles, USA",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    id: "3",
    device: "Firefox on Mac",
    location: "London, UK",
    lastActive: "3 days ago",
    current: false,
  },
];
