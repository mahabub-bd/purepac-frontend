"use client";

import type React from "react";

import Link from "next/link";

interface NavLinksProps {
  isMobile?: boolean;
  onClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ isMobile = false, onClick }) => {
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/product", label: "Product" },
    { href: "/brand", label: "Brand" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`${
            isMobile
              ? "block text-base font-medium "
              : "text-md font-medium"
          } transition-colors hover:text-primary`}
          onClick={onClick}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
