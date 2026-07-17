"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  PawPrint, 
  Mail, 
  Lock, 
  User, 
  Globe, 
  ArrowRight,
  AlertCircle,
  Sparkles
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড দুটি মেলেনি। দয়া করে আবার টাইপ করুন।");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (authError) {
        setError(authError.message || "রেজিস্ট্রেশন সম্পন্ন করা যায়নি।");
      } else {
        router.push("/dashboard");
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (err) {
      console.error("Registration error:", err);
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
      setError("গুগল লগইন সম্পন্ন করা যায়নি।");
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
          <h2 className="text-2xl font-black text-gray-900 tracking-tight pt-2">নতুন অ্যাকাউন্ট তৈরি করুন</h2>
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
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">আপনার নাম</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="নাম লিখুন"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 p-3.5 pl-10 text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              <User className="absolute left-3.5 top-4 h-4 w-4 text-gray-400" />
            </div>
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">পাসওয়ার্ড নিশ্চিত করুন</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 p-3.5 pl-10 text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                <Lock className="absolute left-3.5 top-4 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-300 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-100 transition-all"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "রেজিস্টার"}
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">অথবা</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        {/* Google register */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-gray-200 hover:bg-gray-50 py-3 text-xs font-semibold text-gray-700 transition-all focus:outline-none"
        >
          <Globe className="h-4 w-4 text-blue-500" />
          গুগল দিয়ে রেজিস্টার করুন
        </button>

        {/* Redirect options */}
        <div className="text-center space-y-1 pt-2">
          <p className="text-xs text-gray-500">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="font-bold text-orange-500 hover:text-orange-600 inline-flex items-center gap-0.5">
              লগইন করুন
              <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            টেস্ট করার জন্য সরাসরি <Link href="/login" className="underline font-bold text-emerald-700 hover:text-orange-500">লগইন পেজে</Link> গিয়ে ডেমো লগইন করুন।
          </p>
        </div>

      </div>
    </div>
  );
}
