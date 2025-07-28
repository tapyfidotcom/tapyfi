"use client";

import { usePathname } from "next/navigation";
import React from "react";
import PrivateLayout from "./private-layout";
import PublicLayout from "./public-layout";

function CustomLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isPrivate =
    pathname.startsWith("/user") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/seller");

  const isAuthPage = 
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  const isHomePage = pathname === "/";

  // For dynamic username pages (like /scientificsamie), let them render normally
  const isDynamicUsernamePage = 
    pathname !== "/" && 
    !isPrivate && 
    !isAuthPage && 
    !pathname.startsWith("/api");

  // For home page, return children without any layout wrapper
  if (isHomePage) {
    return <>{children}</>;
  }

  // For auth pages, use minimal layout
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }

  // For dynamic username pages, return children directly
  if (isDynamicUsernamePage) {
    return <>{children}</>;
  }

  if (isPrivate) {
    return <PrivateLayout>{children}</PrivateLayout>;
  }

  return <PublicLayout>{children}</PublicLayout>;
}

export default CustomLayout;
