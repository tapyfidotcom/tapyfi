"use client";

import React from "react";
import { useRouter } from "next/navigation";

function PublicLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Public Header */}
      <div className="bg-card border-b border-border p-4 sm:p-5 flex justify-between items-center sticky top-0 z-40">
        {/* Brand Logo */}
        <div
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push("/")}
        >
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide">
            <span className="text-primary drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
              Tapy
            </span>
            <span className="text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]">
              Fi
            </span>
          </h1>
        </div>

        {/* Public Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/sign-in")}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/sign-up")}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}

export default PublicLayout;
