"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  PawPrint, 
  Mail, 
  Lock, 
  Sparkles, 
  Globe, 
  ArrowRight,
  AlertCircle
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।");
      } else {
        router.push("/dashboard");
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("অথেনটিকেশন সার্ভারের সাথে সংযোগ করা যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard"
      });
    } catch (err) {
      setError("গুগল লগইন সম্পন্ন করা যায়নি। অনুগ্রহ করে ডেমো লগইন ট্রাই করুন।");
    }
  };

  // Demo Login fallback for easy testing out-of-the-box
  const handleDemoLogin = () => {
    setLoading(true);
    setError("");
    
    // Store mock session in localStorage for offline fallback
    const mockSession = {
      user: {
        id: "mock-admin-id-12345",
        name: "ডেমো এডমিন",
        email: "admin@petzone.com",
        image: null,
        role: "admin"
      },
      session: {
        token: "mock-token-abcde",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    };
    
    try {
      localStorage.setItem("petzone_mock_session", JSON.stringify(mockSession));
      
      // Attempt login via better-auth database if connected
      authClient.signIn.email({
        email: "admin@petzone.com",
        password: "adminpassword"
      }).catch(() => {
        // Silently swallow better-auth failure in offline mode
        console.log("Using local mock session fallback.");
      });

      setTimeout(() => {
        router.push("/dashboard");
        setTimeout(() => window.location.reload(), 500);
      }, 800);
    } catch (err) {
      setError("ডেমো লগইন ব্যর্থ হয়েছে।");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-500/5 to-transparent">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md">
              <PawPrint className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              PetZone<span className="text-orange-500">AI</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight pt-2">অ্যাকাউন্টে লগইন করুন</h2>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">পোষা প্রাণীদের স্মার্ট সেবা প্ল্যাটফর্ম</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 text-xs font-semibold rounded-xl border border-red-100 animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">ইমেইল এড্রেস</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 p-3.5 pl-10 text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              <Mail className="absolute left-3.5 top-4 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">পাসওয়ার্ড</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 p-3.5 pl-10 text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              <Lock className="absolute left-3.5 top-4 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-300 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-100 transition-all"
          >
            {loading ? "লগইন হচ্ছে..." : "লগইন"}
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">অথবা</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        {/* External login options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 hover:bg-gray-50 py-3 text-xs font-semibold text-gray-700 transition-all focus:outline-none"
          >
            <Globe className="h-4 w-4 text-blue-500" />
            গুগল সাইন-ইন
          </button>
          
          <button
            onClick={handleDemoLogin}
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 py-3 text-xs font-bold text-emerald-800 transition-all focus:outline-none"
          >
            <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
            ডেমো লগইন (Admin)
          </button>
        </div>

        {/* Redirect options */}
        <p className="text-center text-xs text-gray-500">
          নতুন গ্রাহক?{" "}
          <Link href="/register" className="font-bold text-orange-500 hover:text-orange-600 inline-flex items-center gap-0.5">
            রেজিস্টার করুন
            <ArrowRight className="h-3 w-3" />
          </Link>
        </p>

      </div>
    </div>
  );
}
