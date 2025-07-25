"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle, Star, Zap, Shield, Users, Smartphone, CreditCard } from "lucide-react";

function Homepage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const features = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Smart NFC Technology",
      description: "Tap to instantly share your contact information, social media, and business details"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Premium Materials",
      description: "Choose from high-quality PVC or luxurious metal cards that make lasting impressions"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Link-in-Bio Integration",
      description: "Create a stunning digital profile that showcases all your important links in one place"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Google Review Stands",
      description: "Boost your business reviews with elegant QR code stands for easy customer feedback"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security ensures your data and customer information stays protected"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Management",
      description: "Manage multiple cards and team members from one centralized dashboard"
    }
  ];

  const stats = [
    { number: "10K+", label: "Cards Created" },
    { number: "500+", label: "Happy Customers" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
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
      <div className="relative z-20 px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto text-center space-y-8 lg:space-y-12">
          {/* Main Heading */}
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
            
            <p className="text-gray-300 text-lg sm:text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
              Transform your networking with custom NFC business cards. Create stunning PVC and metal cards with link-in-bio features, Google review stands, and seamless payment integration.
            </p>
          </div>

          {/* CTA Buttons */}
          {!isSignedIn && (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-4">
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

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-12 lg:pt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm sm:text-base">
                  {stat.label}
                </div>
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
              Everything you need to create professional, memorable business cards that work smarter, not harder.
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
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
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
                  Networking Made <span className="text-violet-400">Simple</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Say goodbye to forgotten business cards and hello to instant connections. Our NFC technology ensures your contact information is always up-to-date and accessible.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Instant contact sharing with a simple tap",
                  "Always up-to-date information",
                  "Eco-friendly digital alternative",
                  "Professional impression guaranteed",
                  "Works with all NFC-enabled devices"
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
                      <div className="text-white font-medium">Contact Shared</div>
                      <div className="text-gray-400 text-sm">Just now</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-400 rounded-full"></div>
                    <div>
                      <div className="text-white font-medium">Profile Viewed</div>
                      <div className="text-gray-400 text-sm">2 minutes ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-400 rounded-full"></div>
                    <div>
                      <div className="text-white font-medium">Connection Made</div>
                      <div className="text-gray-400 text-sm">5 minutes ago</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">47</div>
                    <div className="text-gray-400 text-sm">New connections this month</div>
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
                  Join thousands of professionals who've already upgraded their networking game with TapyFi's smart NFC business cards.
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
            © 2025 TapyFi. All rights reserved. Transforming networking, one tap at a time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
