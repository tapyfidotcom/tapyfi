"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Homepage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Sparkles Background */}
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#34d399"
        />
      </div>

      {/* Header */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-20 py-4 sm:py-5">
        <div className="flex justify-between items-center">
          {/* TapyFi Logo */}
          <Link href="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold tracking-wide">
              <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                Tapy
              </span>
              <span className="text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]">
                Fi
              </span>
            </h1>
          </Link>

          {/* Navigation Buttons */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 items-center">
            {isSignedIn ? (
              <>
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-xs sm:text-sm text-gray-300">
                    Welcome, {user?.firstName}!
                  </span>
                </div>
                <Button
                  onClick={() => router.push("/user/profile")}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-emerald-400 transition-all hover:shadow-[0_0_10px_rgba(52,211,153,0.3)] text-xs sm:text-sm px-3 sm:px-4 py-2 text-white"
                >
                  Profile
                </Button> 
                <Button
                  onClick={() => router.push("/user/shop")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_10px_rgba(52,211,153,0.3)] hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] transition-all text-xs sm:text-sm px-3 sm:px-4 py-2 border-0"
                >
                  Go to Shop
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => router.push("/sign-in")}
                  className="bg-transparent border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all hover:shadow-[0_0_10px_rgba(52,211,153,0.3)] text-xs sm:text-sm px-3 sm:px-4 py-2"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push("/sign-up")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_10px_rgba(52,211,153,0.3)] hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] transition-all text-xs sm:text-sm px-3 sm:px-4 py-2 border-0"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-20 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-160px)] items-center">
          <div className="col-span-1 space-y-4 sm:space-y-6 order-2 lg:order-1">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                  Smart
                </span>{" "}
                <span className="text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]">
                  NFC
                </span>{" "}
                <br />
                <span className="text-white">Business Cards</span>
              </h1>
              
              <p className="text-gray-300 text-sm sm:text-base md:text-lg font-medium max-w-lg leading-relaxed">
                Transform your networking with custom NFC business cards. 
                Create stunning PVC and metal cards with link-in-bio features, 
                Google review stands, and seamless payment integration.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              {!isSignedIn && (
                <>
                  <Button
                    onClick={() => router.push("/sign-up")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] transition-all text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-0 min-h-[48px] sm:min-h-[56px]"
                  >
                    Start Creating
                  </Button>
                  <Button
                    onClick={() => router.push("/sign-in")}
                    className="bg-transparent border-2 border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-black transition-all text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover:shadow-[0_0_20px_rgba(167,139,250,0.3)] min-h-[48px] sm:min-h-[56px]"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>

            {/* Features List */}
            <div className="pt-4 sm:pt-6 lg:pt-8 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                <span className="text-gray-300 text-sm sm:text-base">Custom PVC & Metal Cards</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,0.5)]"></div>
                <span className="text-gray-300 text-sm sm:text-base">Link-in-Bio Integration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                <span className="text-gray-300 text-sm sm:text-base">Google Review QR Stands</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,0.5)]"></div>
                <span className="text-gray-300 text-sm sm:text-base">Seamless Payment Processing</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Visual - Fixed NFC Card */}
          <div className="col-span-1 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-violet-400 rounded-2xl blur-xl opacity-30"></div>
              <div className="relative bg-gray-900 rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-700 shadow-2xl">
                <div className="space-y-3 sm:space-y-4">
                  <div className="w-full aspect-[3/2] bg-gradient-to-br from-emerald-500 to-violet-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold">NFC Card</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-bold text-sm sm:text-base md:text-lg">Your Digital Identity</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Tap to connect instantly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;




