"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Users,
  Smartphone,
  CreditCard,
  Gift,
  DollarSign,
} from "lucide-react";
import { CometCard } from "@/components/ui/comet-card";

function Homepage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const features = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Smart NFC Technology",
      description:
        "Tap to instantly share your contact information, social media, and business details",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Premium Materials",
      description:
        "Choose from high-quality PVC or luxurious metal cards that make lasting impressions",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Link-in-Bio Integration",
      description:
        "Create a stunning digital profile that showcases all your important links in one place",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Google Review Stands",
      description:
        "Boost your business reviews with elegant QR code stands for easy customer feedback",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security ensures your data and customer information stays protected",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Management",
      description:
        "Manage multiple cards and team members from one centralized dashboard",
    },
  ];

  const stats = [
    { number: "10K+", label: "Cards Created" },
    { number: "500+", label: "Happy Customers" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ];

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
          <Link
            href="/"
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          >
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

      {/* Hero Section with Comet Card - Side by Side on Desktop */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Hero Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-300">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>The Future of Networking is Here</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
                  <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                    Smart
                  </span>{" "}
                  <span className="text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]">
                    NFC
                  </span>{" "}
                  <br />
                  <span className="text-white">Business Cards</span>
                </h1>

                <p className="text-gray-300 text-lg sm:text-xl font-medium max-w-xl leading-relaxed">
                  Transform your networking with custom NFC business cards.
                  Create stunning PVC and metal cards with link-in-bio features,
                  Google review stands, and seamless payment integration.
                </p>
              </div>

              {/* CTA Buttons */}
              {!isSignedIn && (
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4">
                  <Button
                    onClick={() => router.push("/sign-up")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] transition-all text-lg px-8 py-6 border-0 min-h-[56px] group"
                  >
                    Start Creating Today
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    onClick={() => router.push("/sign-in")}
                    className="bg-transparent border-2 border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-black transition-all text-lg px-8 py-6 hover:shadow-[0_0_20px_rgba(167,139,250,0.3)] min-h-[56px]"
                  >
                    Sign In
                  </Button>
                </div>
              )}

              {/* Stats Section - Mobile/Tablet Only */}
              <div className="grid grid-cols-2 gap-6 pt-8 lg:hidden">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center space-y-2">
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-sm sm:text-base">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Comet Card - Special Offer */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow Effect Behind Card */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl -z-10"></div>

                <a
                  href="https://pplx.ai/scientific_samie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <CometCard>
                    <button
                      type="button"
                      className="flex w-72 sm:w-80 md:w-96 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-3 sm:p-4 saturate-100 hover:saturate-110 transition-all"
                      aria-label="View Perplexity Comet Invitation"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: "none",
                        opacity: 1,
                      }}
                    >
                      {/* Header - Improved Version */}
                      <div className="p-3 sm:p-4 mb-2 sm:mb-3 flex shrink-0 items-center justify-between">
                        {/* Left side - Pro badge with avatar */}
                        <div className="flex items-center gap-2.5">
                          {/* Avatar with Pro badge */}
                          <div className="relative">
                            <div className="relative flex aspect-square shrink-0 items-center justify-center bg-transparent rounded-full size-7 sm:size-8 ring-[2px] ring-[#20808d] border-white border-2 shadow-lg">
                              <img
                                alt="Perplexity Comet Pro"
                                className="size-full object-cover rounded-full"
                                src="/image.png"
                              />
                              {/* Pro badge underneath */}
                              <div className="absolute top-full mt-[-7px] left-0 right-0 flex justify-center">
                                <div className="bg-[#20808d] rounded-r-full rounded-l-full px-2 py-[2px] shadow-md">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 1102.02 529.46"
                                    className="h-2.5 w-auto"
                                  >
                                    <path
                                      className="fill-white"
                                      d="M1068.23,126.49c-23.5-41.68-58.35-75.11-100.77-96.67C928.5,10.04,884.37,0,836.29,0H66.16C29.56,0-.08,29.71,0,66.3l1,463.16h109.72V107.9h78.16v24.37c0,2.66,3.19,3.99,5.1,2.13,20.89-20.25,50.62-30.5,88.64-30.5,26.8,0,51.2,6.11,72.52,18.17,21.44,12.13,38.59,30.51,50.96,54.66h0c12.27,23.95,18.49,53.6,18.49,88.14s-6.22,63.91-18.49,87.85c-12.37,24.14-29.52,42.53-50.96,54.66-21.33,12.06-45.73,18.17-72.52,18.17-16.55,0-55.7-2.68-87.27-25.54-1.98-1.43-4.75-.01-4.75,2.43v127.02h645.68c48.09,0,92.22-10.03,131.18-29.83,42.41-21.55,77.26-54.98,100.78-96.69,22.41-39.76,33.78-86.22,33.78-138.07s-11.37-98.6-33.79-138.39ZM650.3,177.46h-33.53c-23.25,0-40.37,6.1-50.86,18.14-10.7,12.27-16.12,32.09-16.12,58.91v164.71h-79.89V107.9h77.01v20.91c0,2.68,3.28,4.04,5.13,2.11,4.56-4.76,9.87-8.79,15.89-12.06,11.94-6.49,28.27-9.77,48.55-9.77h33.81v68.37ZM967.21,352.21c-13.66,24.23-33.03,42.83-57.56,55.29-24.32,12.36-52.71,18.62-84.38,18.62s-60.35-6.27-84.67-18.62c-24.54-12.46-43.9-31.07-57.56-55.29-13.58-24.09-20.47-53.47-20.47-87.34s6.89-63.54,20.47-87.63c13.65-24.22,33.02-42.82,57.56-55.29,24.33-12.36,52.81-18.62,84.67-18.62s60.06,6.27,84.38,18.62c24.53,12.47,43.9,31.07,57.56,55.29,13.58,24.1,20.47,53.58,20.47,87.63s-6.89,63.25-20.47,87.34Z"
                                    />
                                    <path
                                      className="fill-white"
                                      d="M868.46,179.51c-12.16-7.28-26.7-10.97-43.2-10.97s-31.32,3.69-43.48,10.97c-12.07,7.23-21.57,18.05-28.23,32.16-6.79,14.4-10.23,32.3-10.23,53.2s3.45,38.57,10.24,53.07c6.66,14.2,16.19,25.06,28.35,32.28,12.26,7.29,26.85,10.98,43.36,10.98s31.04-3.69,43.2-10.97c12.07-7.23,21.56-18.09,28.22-32.29,6.79-14.5,10.24-32.35,10.24-53.07s-3.45-38.57-10.24-53.07c-6.66-14.2-16.15-25.07-28.22-32.29Z"
                                    />
                                    <path
                                      className="fill-white"
                                      d="M221.1,351.54c12.26,7.29,26.85,10.98,43.36,10.98s31.04-3.69,43.2-10.97c12.07-7.23,21.56-18.09,28.22-32.29,6.79-14.5,10.24-32.35,10.24-53.07s-3.45-38.57-10.24-53.07c-6.66-14.2-16.15-25.06-28.22-32.29-12.16-7.28-26.7-10.97-43.19-10.97s-31.32,3.69-43.48,10.97c-12.07,7.23-21.57,18.05-28.23,32.16-6.79,14.4-10.23,32.3-10.23,53.2s3.45,38.57,10.24,53.07c6.66,14.2,16.19,25.06,28.35,32.28Z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Text label */}
                          <div className="flex flex-col">
                            <span className="text-white font-semibold text-sm sm:text-base leading-tight">
                              Perplexity
                            </span>
                            <span className="text-[#20808d] font-medium text-[10px] sm:text-xs leading-tight">
                              Comet Pro
                            </span>
                          </div>
                        </div>

                        {/* Right side - Comet icon */}
                        <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#20808d]/10 hover:bg-[#20808d]/20 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            className="text-[#20808d]"
                            fill="currentColor"
                            fillRule="evenodd"
                          >
                            <path d="M5.00226 5.710185C0.612577 10.215135 0.782 17.46045 5.22972 21.90795L6.481905 23.16015C6.601665 23.28 6.795615 23.28 6.915375 23.16015L8.793945 21.28155C8.913705 21.16185 8.913705 20.96775 8.793945 20.8482L7.42119 19.4751C3.690195 15.74415 3.65811 9.727305 7.34925 6.035955C10.71483 2.670375 16.0131 2.40102 19.75005 5.20743C19.89945 5.31963 19.91085 5.540355 19.7787 5.67258C19.66995 5.781315 19.4985 5.79357 19.37445 5.702625C16.29255 3.44289 12.064695 3.59229 9.424635 6.23256C6.491505 9.16569 6.629655 14.05935 9.73344 17.16285L11.106195 18.53595C11.225955 18.65565 11.420115 18.65565 11.539875 18.53595L13.418445 16.65735C13.538205 16.5375 13.538205 16.3434 13.418445 16.2237L12.04548 14.85087C9.96519 12.77058 10.04184 9.321015 12.21675 7.14609C14.02257 5.34027 16.70655 4.98201 18.7566 6.10278C18.9477 6.20742 18.98265 6.4686 18.8286 6.622695C18.73215 6.71916 18.585 6.74778 18.4611 6.68994C17.1153 6.05925 15.46275 6.29919 14.352825 7.413405C12.929595 8.84217 12.99969 11.18058 14.42559 12.606465L15.73065 13.911585C15.8502 14.031135 16.04445 14.031135 16.16415 13.911585L18.04275 12.032805C18.16245 11.913045 18.16245 11.719095 18.04275 11.599335L16.7097 10.266015C16.0938 9.65025 16.0209 8.64801 16.5954 7.99383C17.22525 7.27668 18.3183 7.250325 18.9822 7.91433L19.3761 8.30814C19.99185 8.92392 20.994 8.99688 21.64845 8.422185C22.36545 7.792515 22.3917 6.69954 21.72795 6.035535L21.2943 5.60208C16.7892 1.096925 9.46224 1.132893 5.00226 5.710185Z" />
                          </svg>
                        </div>
                      </div>

                      {/* Image */}
                      <div className="mx-2 sm:mx-3 flex-1">
                        <div
                          className="relative w-full"
                          style={{ aspectRatio: "3 / 4" }}
                        >
                          <img
                            loading="lazy"
                            className="absolute inset-0 size-full rounded-[16px] bg-[#000000] object-cover"
                            alt="Comet Invitation - $2 for you, Pro for your friend"
                            src="https://pplx-res.cloudinary.com/image/upload/comet_invites/RWEk3GxOWfPdL4ppUZPVX_d43e8406e6a645c083bee905012ccb49_xhhiae.png"
                            style={{
                              boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                            }}
                          />
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="p-2 sm:p-3 mt-2 sm:mt-3 flex shrink-0 items-center justify-between font-mono text-white">
                        <div className="text-xs sm:text-sm">
                          Comet Invitation
                        </div>
                        <div className="text-xs uppercase opacity-50">
                          #AMIE
                        </div>
                      </div>
                    </button>
                  </CometCard>
                </a>

                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 animate-pulse">
                  <Gift className="w-4 h-4" />
                  <span>Free Pro!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section - Desktop Only */}
          <div className="hidden lg:grid grid-cols-4 gap-8 pt-16 lg:pt-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-3xl lg:text-4xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-20 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Why Choose <span className="text-emerald-400">TapyFi</span>?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to create professional, memorable business
              cards that work smarter, not harder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-emerald-400/50 transition-all hover:shadow-[0_0_20px_rgba(52,211,153,0.1)] group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-emerald-600/20 rounded-xl text-emerald-400 group-hover:bg-emerald-600/30 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-20 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  Networking Made{" "}
                  <span className="text-violet-400">Simple</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Say goodbye to forgotten business cards and hello to instant
                  connections. Our NFC technology ensures your contact
                  information is always up-to-date and accessible.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Instant contact sharing with a simple tap",
                  "Always up-to-date information",
                  "Eco-friendly digital alternative",
                  "Professional impression guaranteed",
                  "Works with all NFC-enabled devices",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              {!isSignedIn && (
                <Button
                  onClick={() => router.push("/sign-up")}
                  className="bg-violet-600 hover:bg-violet-700 text-white shadow-[0_0_20px_rgba(167,139,250,0.3)] hover:shadow-[0_0_30px_rgba(167,139,250,0.5)] transition-all text-lg px-8 py-6 border-0"
                >
                  Get Started Now
                </Button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-violet-400/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Professional Network</span>
                  <div className="w-12 h-8 bg-emerald-400 rounded-full flex items-center justify-end pr-1">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-400 rounded-full"></div>
                    <div>
                      <div className="text-white font-medium">
                        Contact Shared
                      </div>
                      <div className="text-gray-400 text-sm">Just now</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-400 rounded-full"></div>
                    <div>
                      <div className="text-white font-medium">
                        Profile Viewed
                      </div>
                      <div className="text-gray-400 text-sm">2 minutes ago</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-400 rounded-full"></div>
                    <div>
                      <div className="text-white font-medium">
                        Connection Made
                      </div>
                      <div className="text-gray-400 text-sm">5 minutes ago</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                      47
                    </div>
                    <div className="text-gray-400 text-sm">
                      New connections this month
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isSignedIn && (
        <div className="relative z-20 px-4 sm:px-6 lg:px-20 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-emerald-600/20 to-violet-600/20 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 lg:p-12 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  Ready to Transform Your Networking?
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  Join thousands of professionals who've already upgraded their
                  networking game with TapyFi's smart NFC business cards.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push("/sign-up")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] transition-all text-lg px-8 py-6 border-0 group"
                >
                  Create Your Card Today
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => router.push("/contact")}
                  className="bg-transparent border-2 border-gray-600 text-gray-300 hover:border-violet-400 hover:text-violet-400 transition-all text-lg px-8 py-6"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-20 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 TapyFi. All rights reserved. Transforming networking, one tap
            at a time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
