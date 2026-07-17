"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Sparkles,
  ShoppingBag,
  PawPrint
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { data: sessionData, isPending } = authClient.useSession();
  const [mockSession, setMockSession] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mock = localStorage.getItem("petzone_mock_session");
      if (mock) {
        setMockSession(JSON.parse(mock));
      }
    }
  }, []);

  const session = sessionData || mockSession;

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("petzone_mock_session");
    }
    try {
      await authClient.signOut();
    } catch (err) {
      console.log("Offline mode - logged out locally");
    }
    setShowDropdown(false);
    window.location.reload();
  };


  const navLinks = [
    { name: "হোম", href: "/" },
    { name: "পণ্যসমূহ", href: "/products" },
    { name: "আমাদের সম্পর্কে", href: "/about" },
    { name: "যোগাযোগ", href: "/contact" }
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-200 transition-transform duration-300 group-hover:scale-105">
                <PawPrint className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                PetZone<span className="bg-gradient-to-r from-amber-500 to-emerald-500 bg-clip-text text-transparent">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-orange-500 ${
                  isActive(link.href) 
                    ? "text-orange-500 border-b-2 border-orange-500 pb-1" 
                    : "text-gray-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions & Profile Dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {isPending ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 pr-3 hover:bg-gray-100 transition-all duration-200 focus:outline-none"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                  <span className="text-xs font-semibold text-gray-700 max-w-[100px] truncate">
                    {session.user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5 focus:outline-none transition-all duration-200 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      ড্যাশবোর্ড
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      লগ আউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-orange-500 px-3 py-2 transition-colors"
                >
                  লগইন
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:from-amber-600 hover:to-orange-600 transition-all duration-200 hover:shadow-lg"
                >
                  <Sparkles className="h-4 w-4" />
                  রেজিস্টার
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-gray-600 hover:bg-gray-50 hover:text-orange-500 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block rounded-xl px-4 py-2.5 text-base font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-orange-50"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-4 pb-2">
            {isPending ? (
              <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200"></div>
            ) : session ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{session.user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  ড্যাশবোর্ড
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 rounded-xl px-4 py-2.5 text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  লগ আউট
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  লগইন
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-100"
                >
                  রেজিস্টার
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
