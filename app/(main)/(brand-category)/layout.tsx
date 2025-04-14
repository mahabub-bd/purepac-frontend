import type React from "react";

export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto">
      <div className="transition-all duration-300 ease-in-out pt-1 md:pt-0 md:pl-[250px] lg:pl-[250px]">
        {children}
      </div>
    </div>
  );
}
