"use client";

import type React from "react";

import Link from "next/link";

interface CategoryLinksProps {
  onClick?: () => void;
}

const CategoryLinks: React.FC<CategoryLinksProps> = ({ onClick }) => {
  const categories = [
    { href: "/category/packaging", label: "Packaging Solutions" },
    { href: "/category/sustainable", label: "Sustainable Options" },
    { href: "/category/custom", label: "Custom Packaging" },
    { href: "/category/food", label: "Food Packaging" },
    { href: "/category/retail", label: "Retail Packaging" },
    { href: "/category/industrial", label: "Industrial Packaging" },
    { href: "/category/medical", label: "Medical Packaging" },
  ];

  return (
    <>
      {categories.map((category) => (
        <Link
          key={category.href}
          href={category.href}
          className="block text-base font-medium  transition-colors hover:text-primary"
          onClick={onClick}
        >
          {category.label}
        </Link>
      ))}
    </>
  );
};

export default CategoryLinks;
