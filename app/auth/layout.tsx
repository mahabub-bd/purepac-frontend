import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex  flex-col items-center justify-center md:py-10 py-5">{children}</div>
  );
}
