"use client";
import { useState } from "react";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NavLinks from "./nav-links";
import CategoryLinks from "./category-links";
import { PurePacLogo } from "@/public/images";

type TabType = "main" | "categories";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>("main");

  const handleClose = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full p-0"
        >
          <Menu className="size-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <div className="flex flex-col h-full">
          {/* Header with Logo and Close Button */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center" onClick={handleClose}>
              <Image
                src={PurePacLogo || "/placeholder.svg"}
                alt="PurePac Logo"
                width={100}
                height={60}
                className="h-auto w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg?height=60&width=100";
                }}
              />
            </Link>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              className={cn(
                "flex-1 py-3 text-center font-medium transition-colors",
                activeTab === "main"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("main")}
              aria-selected={activeTab === "main"}
              role="tab"
            >
              Main Menu
            </button>
            <button
              className={cn(
                "flex-1 py-3 text-center font-medium transition-colors",
                activeTab === "categories"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("categories")}
              aria-selected={activeTab === "categories"}
              role="tab"
            >
              Categories
            </button>
          </div>

          {/* Menu Content */}
          <div
            className="flex-1 overflow-auto p-6"
            role="tabpanel"
            aria-label={activeTab === "main" ? "Main Menu" : "Categories Menu"}
          >
            <div className="space-y-6">
              {activeTab === "main" ? (
                <NavLinks isMobile onClick={handleClose} />
              ) : (
                <CategoryLinks onClick={handleClose} />
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
