"use client";
import React, { useState } from "react";
import NavLinks from "./nav-links";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { PurePacLogo } from "@/public/images";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="size-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-4">
        <nav className="flex flex-col space-y-6 pt-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={handleClose}
          >
            <Image
              src={PurePacLogo}
              alt="PurePac Logo"
              width={100}
              height={80}
            />
          </Link>

          {/* Mobile Navigation Links */}
          <div className="space-y-4">
            <NavLinks isMobile onClick={handleClose} />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
