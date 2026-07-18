"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { 
  ShoppingCart, 
  Trash2, 
  CreditCard, 
  MapPin, 
  CheckCircle, 
  ArrowRight, 
  Loader2, 
  ShoppingBag,
  Plus,
  Minus,
  User,
  Heart,
  Smile
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const { data: sessionData, isPending: authPending } = authClient.useSession();
  const [mockSession, setMockSession] = useState(null);
  const [sessionChecking, setSessionChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mock = localStorage.getItem("petzone_mock_session");
      if (mock) {
        try {
          setMockSession(JSON.parse(mock));
        } catch (e) {
          console.error(e);
        }
      }
      setSessionChecking(false);
      setMounted(true);
    }
  }, []);

  const session = sessionData || mockSession;
  const authChecking = authPending && sessionChecking;

  // Checkout workflow step: 'cart' | 'shipping' | 'payment' | 'success'
  const [step, setStep] = useState("cart");

  // Shipping Form State
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("home"); // home | express

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState("bkash"); // bkash | nagad | card
  const [cardNumber, setCardNumber] = useState("");
  const [paymentNumber, setPaymentNumber] = useState(""); // For bkash/nagad
  const [isPaying, setIsPaying] = useState(false);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!authChecking && !session) {
      router.push(`/login?redirect=/dashboard`);
    }
  }, [session, authChecking, router]);

  // Fetch Cart Items for specific user
  const { data: cartData, isLoading: isCartLoading, refetch: refetchCart } = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      if (!userId) return { cartItems: [] };
      const response = await axios.get(`${BASE_URL}/api/cart`, {
        params: { userId }
      });
      return response.data;
    },
    enabled: !authChecking && !!userId,
  });

  const cartItems = cartData?.cartItems || [];

  // Update Cart Quantity Mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartId, quantity }) => {
      // In the new API, PATCH is still /api/cart/:id
      await axios.patch(`${BASE_URL}/api/cart/${cartId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      refetchCart();
    }
  });

  // Delete Cart Item Mutation
  const deleteCartItemMutation = useMutation({
    mutationFn: async (cartId) => {
      await axios.delete(`${BASE_URL}/api/cart/${cartId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      refetchCart();
    }
  });

  // Calculate pricing
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = deliveryMethod === "express" ? 150 : 80;
  const grandTotal = subtotal > 0 ? subtotal + deliveryCharge : 0;

  // Handle Checkout / Clear Cart locally and backend
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsPaying(true);

    // Simulate network latency for payment processing
    setTimeout(async () => {
      try {
        // Clear all cart items of this user from the database
        for (const item of cartItems) {
          await axios.delete(`${BASE_URL}/api/cart/${item._id}`);
        }
        queryClient.invalidateQueries(["cart"]);
        refetchCart();
        setStep("success");
      } catch (err) {
        console.error("Failed to clear cart after fake payment:", err);
        // Fallback to success even on network issue
        setStep("success");
      } finally {
        setIsPaying(false);
      }
    }, 2000);
  };

  if (!mounted || authChecking || !session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-screen">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 animate-spin border-4 border-orange-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm font-bold text-gray-500">লোডিং ড্যাশবোর্ড...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full space-y-8 animate-fade-in">
      {/* Header Profile Dashboard */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">আমার ড্যাশবোর্ড</h1>
              {/* <p className="text-sm text-orange-50/90 font-medium">স্বাগতম, {user?.data?.user?.name || "ইউজার"}</p> */}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/10 px-4 py-3 rounded-2xl backdrop-blur-md text-center">
            <p className="text-xs text-orange-100 font-bold uppercase tracking-wider">কার্ট প্রোডাক্ট</p>
            <p className="text-xl font-black">{cartItems.length} টি</p>
          </div>
          <div className="bg-white/10 px-4 py-3 rounded-2xl backdrop-blur-md text-center">
            <p className="text-xs text-orange-100 font-bold uppercase tracking-wider">মোট বুকিং মূল্য</p>
            <p className="text-xl font-black">৳ {subtotal}</p>
          </div>
        </div>
      </div>

      {/* Progress Steps for Checkout */}
      {step !== "success" && (
        <div className="flex items-center justify-center gap-2 max-w-xl mx-auto py-2">
          <span className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${step === "cart" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>
            ১. কার্ট রিভিউ
          </span>
          <ArrowRight className="h-4 w-4 text-gray-300" />
          <span className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${step === "shipping" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>
            ২. শিপিং তথ্য
          </span>
          <ArrowRight className="h-4 w-4 text-gray-300" />
          <span className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${step === "payment" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>
            ৩. পেমেন্ট করুন
          </span>
        </div>
      )}

      {/* Step Components */}
      {step === "cart" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Products List */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-50">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <ShoppingCart className="h-5.5 w-5.5 text-orange-500" />
                আপনার কার্ট আইটেমসমূহ
              </h2>
              <span className="text-xs font-bold text-gray-400">({cartItems.length} টি প্রোডাক্ট)</span>
            </div>

            {isCartLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <p className="text-sm text-gray-400 font-bold">কার্ট লোড হচ্ছে...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-6">
                <div className="h-16 w-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-gray-700">আপনার কার্ট বর্তমানে খালি আছে!</p>
                  <p className="text-xs text-gray-400">নতুন পেট কেয়ার প্রোডাক্ট যোগ করতে প্রোডাক্ট পেজে যান।</p>
                </div>
                <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-orange-500 px-6 py-3 text-xs font-bold text-white transition-colors">
                  প্রোডাক্ট ব্রাউজ করুন
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item._id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300"}
                        alt={item.productName || item.name}
                        className="h-16 w-16 rounded-2xl object-cover bg-gray-50 border border-gray-100"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 hover:text-orange-500">
                          <Link href={`/products/${item.productId}`}>{item.productName || item.name}</Link>
                        </h3>
                        <p className="text-xs text-gray-400">প্রতিটির মূল্য: ৳ {item.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1">
                        <button
                          onClick={() => item.quantity > 1 && updateQuantityMutation.mutate({ cartId: item._id, quantity: item.quantity - 1 })}
                          disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                          className="text-gray-500 hover:text-orange-500 disabled:opacity-30"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-black text-gray-800 px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantityMutation.mutate({ cartId: item._id, quantity: item.quantity + 1 })}
                          disabled={updateQuantityMutation.isPending}
                          className="text-gray-500 hover:text-orange-500"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Total and Trash */}
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-black text-gray-900">৳ {item.price * item.quantity}</p>
                        <button
                          onClick={() => deleteCartItemMutation.mutate(item._id)}
                          disabled={deleteCartItemMutation.isPending}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Summary Side Card */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-gray-900 border-b border-gray-50 pb-3">বিলিং সামারি</h2>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>সাবটোটাল</span>
                  <span className="font-bold text-gray-800">৳ {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="font-bold text-gray-800">৳ {deliveryCharge}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-black text-gray-900">
                  <span>সর্বমোট মূল্য</span>
                  <span>৳ {grandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => setStep("shipping")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 transition-all hover:scale-[1.02] active:scale-95"
              >
                শিপিং তথ্যে যান <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Shipping Form */}
      {step === "shipping" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-50">
              <MapPin className="h-5.5 w-5.5 text-orange-500" />
              শিপিং ও ডেলিভারি তথ্য
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">পূর্ণ ঠিকানা</label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="যেমন: হাউজ নং ১২, রোড নং ৫, ধানমণ্ডি, ঢাকা"
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">মোবাইল নম্বর</label>
                <input
                  required
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">ডেলিভারি অপশন</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("home")}
                    className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${deliveryMethod === "home" ? "border-orange-500 bg-orange-50/45 text-orange-900" : "border-gray-200 text-gray-700"}`}
                  >
                    <span className="text-sm font-bold">হোম ডেলিভারি (৳৮০)</span>
                    <span className="text-xs text-gray-400">২-৩ কার্যদিবসের মধ্যে ডেলিভারি</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("express")}
                    className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${deliveryMethod === "express" ? "border-orange-500 bg-orange-50/45 text-orange-900" : "border-gray-200 text-gray-700"}`}
                  >
                    <span className="text-sm font-bold">এক্সপ্রেস ডেলিভারি (৳১৫০)</span>
                    <span className="text-xs text-gray-400">২৪ ঘণ্টার মধ্যে ডেলিভারি</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep("cart")}
                className="rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                পিছনে যান
              </button>
              <button
                type="button"
                disabled={!address || !phone}
                onClick={() => setStep("payment")}
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
              >
                পেমেন্টে যান <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Pricing Side Card */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-gray-900 border-b border-gray-50 pb-3">বিলিং সামারি</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>সাবটোটাল</span>
                <span className="font-bold text-gray-800">৳ {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-bold text-gray-800">৳ {deliveryCharge}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-black text-gray-900">
                <span>সর্বমোট মূল্য</span>
                <span>৳ {grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Fake Payment Screen */}
      {step === "payment" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 pb-4 border-b border-gray-50">
              <CreditCard className="h-5.5 w-5.5 text-orange-500" />
              নিরাপদ পেমেন্ট গেটওয়ে (সিমুলেশন)
            </h2>

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* Payment Type Selection */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bkash")}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${paymentMethod === "bkash" ? "border-pink-500 bg-pink-50/50 text-pink-700" : "border-gray-200"}`}
                >
                  <div className="h-8 w-12 bg-pink-100 rounded-lg flex items-center justify-center font-black text-xs text-pink-600">bKash</div>
                  <span className="text-xs font-bold">বিকাশ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("nagad")}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${paymentMethod === "nagad" ? "border-orange-500 bg-orange-50/50 text-orange-700" : "border-gray-200"}`}
                >
                  <div className="h-8 w-12 bg-orange-100 rounded-lg flex items-center justify-center font-black text-xs text-orange-600">Nagad</div>
                  <span className="text-xs font-bold">নগদ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${paymentMethod === "card" ? "border-slate-800 bg-slate-50 text-slate-900" : "border-gray-200"}`}
                >
                  <div className="h-8 w-12 bg-slate-200 rounded-lg flex items-center justify-center font-black text-xs text-slate-700">Card</div>
                  <span className="text-xs font-bold">কার্ড</span>
                </button>
              </div>

              {/* Form Input fields depending on selection */}
              {paymentMethod === "card" ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">কার্ড নাম্বার</label>
                    <input
                      required
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="XXXX - XXXX - XXXX - XXXX"
                      className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">মেয়াদ শেষ (Expiry)</label>
                      <input
                        required
                        type="text"
                        placeholder="MM/YY"
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-orange-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">সিভিভি (CVV)</label>
                      <input
                        required
                        type="password"
                        placeholder="***"
                        maxLength={3}
                        className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">বিকাশ/নগদ পার্সোনাল একাউন্ট নাম্বার</label>
                    <input
                      required
                      type="text"
                      value={paymentNumber}
                      onChange={(e) => setPaymentNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-100 text-blue-800 rounded-2xl text-xs leading-relaxed">
                    💡 এটি একটি নিরাপদ মক পেমেন্ট সিস্টেম। আপনার আসল বিকাশ/নগদ একাউন্ট থেকে কোনো টাকা কাটা হবে না। এটি অর্ডার প্রসেসিং চেক করার জন্য মক পেমেন্ট।
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep("shipping")}
                  className="rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  শিপিং এ যান
                </button>
                <button
                  type="submit"
                  disabled={isPaying}
                  className="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-8 py-2.5 text-xs sm:text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {isPaying ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> পেমেন্ট হচ্ছে...</>
                  ) : (
                    <>৳ {grandTotal} পেমেন্ট সম্পন্ন করুন</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Billing Side Card */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-gray-900 border-b border-gray-50 pb-3">বিলিং সামারি</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>সাবটোটাল</span>
                <span className="font-bold text-gray-800">৳ {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-bold text-gray-800">৳ {deliveryCharge}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-black text-gray-900">
                <span>সর্বমোট মূল্য</span>
                <span>৳ {grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Success / Thank you note */}
      {step === "success" && (
        <div className="max-w-xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-xl text-center space-y-6 animate-scale-up">
          <div className="h-20 w-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
            <CheckCircle className="h-10 w-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!</h2>
            <p className="text-sm text-gray-500">পেট জোন (PetZone) থেকে কেনাকাটা করার জন্য আপনাকে আন্তরিক ধন্যবাদ। ❤️</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">অর্ডার আইডি:</span>
              <span className="font-black text-slate-800">#PZ-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">শিপিং ঠিকানা:</span>
              <span className="font-bold text-slate-800 truncate max-w-[200px]">{address || "ডিফল্ট ঠিকানা"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">পেমেন্ট মাধ্যম:</span>
              <span className="font-bold text-slate-800 uppercase">{paymentMethod}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/80 pt-2 text-sm font-black text-gray-900">
              <span>পরিশোধিত মূল্য:</span>
              <span>৳ {grandTotal}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setStep("cart");
                // Reset inputs
                setAddress("");
                setPhone("");
                setCardNumber("");
                setPaymentNumber("");
              }}
              className="rounded-full bg-slate-900 hover:bg-orange-500 px-6 py-3 text-xs sm:text-sm font-bold text-white transition-colors"
            >
              আবার কেনাকাটা করুন
            </button>
            <Link
              href="/products"
              className="rounded-full border border-slate-200 hover:bg-slate-50 px-6 py-3 text-xs sm:text-sm font-bold text-slate-700 transition-all"
            >
              নতুন প্রোডাক্ট ব্রাউজ করুন
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
