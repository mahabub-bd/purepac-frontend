"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";

import {
  AlertTriangle,
  Check,
  LogIn,
  Package,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react";

export function ActivityLog() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="h-4 w-4" />;
      case "product":
        return <Package className="h-4 w-4" />;
      case "order":
        return <ShoppingCart className="h-4 w-4" />;
      case "settings":
        return <Settings className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      case "security":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Check className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "login":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "product":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "order":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "settings":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "user":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
      case "security":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Recent activity on your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {activityLog.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div
                className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(
                  activity.type
                )}`}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.description}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{formatDateTime(activity.timestamp)}</span>
                  <span className="mx-2">•</span>
                  <span>{activity.ipAddress}</span>
                  {activity.location && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{activity.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full">
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
}

const activityLog = [
  {
    id: "1",
    type: "login",
    description: "Logged in from a new device",
    timestamp: "2023-04-04T07:38:00Z",
    ipAddress: "192.168.1.1",
    location: "New York, USA",
  },
  {
    id: "2",
    type: "product",
    description: "Added 5 new products to inventory",
    timestamp: "2023-04-03T15:22:00Z",
    ipAddress: "192.168.1.1",
    location: "New York, USA",
  },
  {
    id: "3",
    type: "order",
    description: "Processed order #1234",
    timestamp: "2023-04-03T12:45:00Z",
    ipAddress: "192.168.1.1",
    location: "New York, USA",
  },
  {
    id: "4",
    type: "settings",
    description: "Updated store settings",
    timestamp: "2023-04-02T09:15:00Z",
    ipAddress: "192.168.1.1",
    location: "New York, USA",
  },
  {
    id: "5",
    type: "security",
    description: "Changed account password",
    timestamp: "2023-04-01T18:30:00Z",
    ipAddress: "192.168.1.1",
    location: "New York, USA",
  },
  {
    id: "6",
    type: "user",
    description: "Updated profile information",
    timestamp: "2023-03-31T14:20:00Z",
    ipAddress: "192.168.1.1",
    location: "New York, USA",
  },
];
