import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { SparklesCore } from "@/components/ui/sparkles";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6 lg:p-8">
        <Link href="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide">
            <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
              Tapy
            </span>
            <span className="text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]">
              Fi
            </span>
          </h1>
        </Link>
        
        <Link 
          href="/sign-up"
          className="text-sm sm:text-base text-gray-400 hover:text-emerald-400 transition-colors"
        >
          Need an account? <span className="text-emerald-400 font-semibold">Sign up</span>
        </Link>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">
        {/* Left Column - TapyFi Branding with Sparkles */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-6 lg:p-12">
          {/* Sparkles Background */}
          <div className="absolute inset-0">
            <SparklesCore
              id="signin-sparkles"
              background="transparent"
              minSize={0.4}
              maxSize={1.0}
              particleDensity={80}
              className="w-full h-full"
              particleColor="#34d399"
            />
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-wide">
              <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                Tapy
              </span>
              <span className="text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]">
                Fi
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 max-w-md mx-auto">
              Smart NFC Business Cards for the Digital Age
            </p>
            
            <div className="space-y-3 max-w-sm mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                <span className="text-gray-300">Custom PVC & Metal Cards</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,0.5)]"></div>
                <span className="text-gray-300">Link-in-Bio Integration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                <span className="text-gray-300">Google Review QR Stands</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Clerk Auth Card */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400">
                Sign in to your account
              </p>
            </div>
            
            {/* Simple Card Container - No custom styling */}
            <div className="justify-center items-center flex">
              <SignIn redirectUrl="/user/shop" />
            </div>
            
            <div className="text-center mt-6">
              <Link 
                href="/"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
