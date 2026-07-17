"use client";

import { useState } from "react";
import Link from "next/link";
import { PawPrint, Mail, Heart, Send } from "lucide-react";

// Custom SVG social icons (lucide-react-এ নেই)
const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const TwitterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4l16 16M4 20 20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M2 4h6l4 5.5L18 4h4L14 12l8 8h-6l-4-5.5L6 20H2l8-8z" />
  </svg>
);
const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);
const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7C6.73 19.91 6.14 18 6.14 18c-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 7.43c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="w-full bg-gray-900 text-gray-300 mt-auto border-t border-gray-800">
      {/* Newsletter Section */}
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">আমাদের নিউজলেটারে যোগ দিন</h3>
            <p className="text-sm text-gray-400">নতুন পণ্য, বিশেষ ছাড় এবং মূল্যবান পেট কেয়ার টিপস সরাসরি আপনার ইনবক্সে পেতে সাবস্ক্রাইব করুন।</p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full md:w-auto min-w-[300px] sm:min-w-[400px]">
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="আপনার ইমেইল এড্রেস"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border-0 bg-gray-800/80 px-5 py-3.5 pr-28 text-sm text-white placeholder-gray-500 ring-1 ring-gray-700 focus:ring-2 focus:ring-orange-500 outline-none transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center gap-1.5"
              >
                {subscribed ? "ধন্যবাদ!" : (
                  <>
                    সাবস্ক্রাইব
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-gray-800">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white shadow-md">
                <PawPrint className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                PetZone<span className="text-orange-500">AI</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              আপনার পোষা প্রাণীর যত্ন ও কেনাকাটাকে সহজ করতে PetZone AI যুক্ত করেছে সর্বাধুনিক কৃত্রিম বুদ্ধিমত্তা। আমরা পোষা প্রাণীদের সর্বোত্তম সেবা প্রদানে প্রতিশ্রুতিবদ্ধ।
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Facebook" className="h-9 w-9 rounded-full bg-gray-800 hover:bg-orange-500 hover:text-white transition-colors duration-200 flex items-center justify-center">
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter / X" className="h-9 w-9 rounded-full bg-gray-800 hover:bg-orange-500 hover:text-white transition-colors duration-200 flex items-center justify-center">
                <TwitterIcon className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="h-9 w-9 rounded-full bg-gray-800 hover:bg-orange-500 hover:text-white transition-colors duration-200 flex items-center justify-center">
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a href="#" aria-label="GitHub" className="h-9 w-9 rounded-full bg-gray-800 hover:bg-orange-500 hover:text-white transition-colors duration-200 flex items-center justify-center">
                <GithubIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">গুরুত্বপূর্ণ লিংক</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">হোম</Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">প্রোডাক্টস ক্যাটালগ</Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">আমাদের সম্পর্কে</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">যোগাযোগ করুন</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">সহায়তা ও নীতি</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/help" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">হেল্প সেন্টার</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">প্রাইভেসি পলিসি</Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">টার্মস অ্যান্ড কন্ডিশনস</Link>
              </li>
              <li>
                <a href="mailto:support@petzoneai.com" className="text-sm text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  support@petzoneai.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: AI Highlights */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">আমাদের এআই ফিচার</h4>
            <div className="space-y-3">
              <div className="rounded-xl bg-gray-800/50 p-3 border border-gray-800">
                <span className="text-xs font-semibold text-orange-400 uppercase tracking-widest block mb-1">এআই অ্যাসিস্ট্যান্ট</span>
                <p className="text-xs text-gray-400">পোষা প্রাণীর স্বাস্থ্য ও যত্ন সংক্রান্ত যেকোনো প্রশ্ন সরাসরি আমাদের বটের কাছে জিজ্ঞাসা করুন।</p>
              </div>
              <div className="rounded-xl bg-gray-800/50 p-3 border border-gray-800">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block mb-1">স্মার্ট প্রোডাক্ট রিকমেন্ডেশন</span>
                <p className="text-xs text-gray-400">প্রতিটি পণ্যের পেজে এআই দিয়ে সাজেস্টেড ও পরিপূরক প্রোডাক্টসমূহ খুঁজে নিন।</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} PetZone AI. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" /> for our furry friends.
          </p>
        </div>
      </div>
    </footer>
  );
}
