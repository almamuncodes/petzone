"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Brain, 
  MessageSquare, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  PawPrint,
  CheckCircle2,
  Users
} from "lucide-react";

export default function Home() {
  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const categories = [
    { name: "কুকুর (Dogs)", count: "১২০+ পণ্য", icon: "🐕", color: "from-orange-400 to-amber-500", query: "dog" },
    { name: "বিড়াল (Cats)", count: "৯৫+ পণ্য", icon: "🐈", color: "from-emerald-400 to-teal-500", query: "cat" },
    { name: "পাখি (Birds)", count: "৪০+ পণ্য", icon: "🦜", color: "from-blue-400 to-indigo-500", query: "bird" },
    { name: "মাছ (Fish)", count: "৫০+ পণ্য", icon: "🐠", color: "from-cyan-400 to-blue-500", query: "fish" }
  ];

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/api/products`, {
        params: {
          sort: "rating_desc",
          limit: 3
        }
      });
      return response.data;
    },
    retry: 1
  });

  const featuredProducts = productsData?.products && productsData.products.length > 0
    ? productsData.products.map(p => ({
        id: p._id || p.id,
        name: p.name,
        category: p.category,
        petType: p.petType,
        price: p.price,
        rating: p.rating,
        image: p.image
      }))
    : [
        {
          id: "prod-1",
          name: "প্রিমিয়াম ডগ ফুড - চিকেন ও রাইস ফ্লেভার",
          category: "খাবার",
          petType: "dog",
          price: 1250,
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=60"
        },
        {
          id: "prod-2",
          name: "ইন্টারঅ্যাক্টিভ বিড়ালের খেলার বল (টয়)",
          category: "খেলনা",
          petType: "cat",
          price: 450,
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500&auto=format&fit=crop&q=60"
        },
        {
          id: "prod-3",
          name: "পাখির খাঁচার প্রিমিয়াম কাঠের দোলনা",
          category: "এক্সেসরিজ",
          petType: "bird",
          price: 320,
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60"
        }
      ];


  const faqItems = [
    {
      q: "PetZone AI-এর এআই অ্যাসিস্ট্যান্ট কীভাবে কাজ করে?",
      a: "আমাদের প্ল্যাটফর্মে একটি ২৪/৭ এআই চ্যাট অ্যাসিস্ট্যান্ট রয়েছে (নিচে ডানদিকের ফ্লোটিং উইজেট)। এটি পোষা প্রাণীর খাবার সাজেস্ট করা, স্বাস্থ্য সংক্রান্ত সাধারণ পরামর্শ দেওয়া এবং সঠিক প্রোডাক্ট খুঁজে পেতে আপনাকে ইনস্ট্যান্ট সাহায্য করবে।"
    },
    {
      q: "এখানে অর্ডার ডেলিভারি করতে কত সময় লাগে?",
      a: "ঢাকা সিটির মধ্যে আমরা ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি নিশ্চিত করি। ঢাকা সিটির বাইরে ৩ থেকে ৫ কার্যদিবস সময় লাগতে পারে।"
    },
    {
      q: "প্রোডাক্ট ডিটেইলস পেজের '✨ Recommend with AI' কি?",
      a: "এটি একটি চমৎকার ফিচার। আপনি যখন কোনো প্রোডাক্ট দেখছেন, এই বাটনে ক্লিক করলে আমাদের এআই বর্তমান প্রোডাক্টটি নিয়ে গবেষণা করবে এবং এর সাথে আর কোন কোন এক্সেসরিজ বা পরিপূরক খাবার লাগবে তার একটি চমৎকার এনালাইসিস আপনাকে ব্যাখ্যাসহ সাজেস্ট করবে।"
    },
    {
      q: "আমি কি প্রোডাক্ট ফেরত দিতে পারব (Return Policy)?",
      a: "হ্যাঁ, প্রোডাক্ট রিসিভ করার পর কোনো সমস্যা থাকলে ২৪ ঘণ্টার মধ্যে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করে সহজেই এক্সচেঞ্জ বা রিটার্ন করতে পারবেন।"
    }
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. Hero Banner */}
      <section className="relative bg-gradient-to-b from-amber-500/5 via-orange-500/5 to-transparent pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/80 px-4 py-1.5 text-xs font-semibold text-orange-600 border border-orange-200">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                ১২৫+ এআই জেনারেটেড পেট কেয়ার টিপস
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                আপনার পোষা প্রাণীর যত্ন ও কেনাকাটা হোক <br />
                <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 bg-clip-text text-transparent">
                  স্মার্ট ও এআই চালিত
                </span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
                PetZone AI-তে স্বাগতম! এখানে আপনি আপনার পোষা কুকুরের খাবার থেকে শুরু করে বিড়ালের খেলনা পর্যন্ত সব প্রিমিয়াম প্রোডাক্ট পাবেন। সাথে থাকছে আমাদের এআই চ্যাট অ্যাসিস্ট্যান্টের সার্বক্ষণিক ফ্রি পরামর্শ।
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-orange-200 hover:from-amber-600 hover:to-orange-600 transition-all duration-200 hover:scale-[1.02]"
                >
                  ক্যাটালগ দেখুন
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => {
                    const widget = document.getElementById("ai-chat-button");
                    if (widget) widget.click();
                  }}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-4 text-base font-bold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  <MessageSquare className="h-5 w-5 text-emerald-500" />
                  এআই চ্যাটবট
                </button>
              </div>
            </div>

            {/* Right Graphics Image Overlay */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-emerald-400 rounded-full blur-3xl opacity-20 -z-10"></div>
              <div className="relative w-full max-w-[450px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80"
                  alt="Happy Golden Retriever puppy representing PetZone AI"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between shadow-lg">
                  <div>
                    <p className="text-xs text-gray-400">আজকের টিপস</p>
                    <p className="text-sm font-bold text-gray-800">কুকুরছানাকে ওমেগা-৩ যুক্ত খাবার দিন 🐕</p>
                  </div>
                  <div className="rounded-full bg-orange-100 p-2 text-orange-600">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Grid */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">ক্যাটাগরি অনুযায়ী ব্রাউজ করুন</h2>
            <p className="text-gray-500 text-sm md:text-base">আপনার আদরের পোষা প্রাণীর ধরন অনুযায়ী সেরা পণ্যসমূহ সহজেই খুঁজে নিন।</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <Link 
                key={i} 
                href={`/products?petType=${cat.query}`}
                className="group relative rounded-2xl overflow-hidden p-6 text-center bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{cat.name}</h3>
                <span className="text-xs text-gray-400 font-semibold">{cat.count}</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products Slider */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">সেরা বিক্রি হওয়া পণ্যসমূহ</h2>
              <p className="text-gray-500 text-sm">গ্রাহকদের সবচেয়ে পছন্দের এবং সর্বোচ্চ রেটিং প্রাপ্ত প্রোডাক্টস</p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors mt-4 md:mt-0"
            >
              সব পণ্য দেখুন
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isProductsLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm animate-pulse h-[380px] flex flex-col">
                  <div className="bg-gray-200 w-full h-[200px]" />
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="h-3 w-16 bg-gray-200 rounded-full" />
                      <div className="h-4 w-full bg-gray-200 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-6 w-20 bg-gray-200 rounded-full" />
                      <div className="h-8 w-24 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              featuredProducts.map((prod) => (
                <div 
                  key={prod.id} 
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-orange-600 flex items-center gap-1 shadow-sm">
                      <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
                      {prod.rating}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-2">{prod.category}</span>
                    <h3 className="text-base font-bold text-gray-800 mb-3 line-clamp-2 hover:text-orange-500 transition-colors">
                      <Link href={`/products/${prod.id}`}>{prod.name}</Link>
                    </h3>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <span className="text-lg font-black text-gray-900">৳ {prod.price}</span>
                      <Link
                        href={`/products/${prod.id}`}
                        className="rounded-full bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500 transition-colors"
                      >
                        বিস্তারিত দেখুন
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">কেন আমাদের বেছে নেবেন?</h2>
            <p className="text-gray-500 text-sm">আমরা শুধু পণ্য বিক্রি করি না, আপনার আদরের প্রাণীর স্বাস্থ্য রক্ষায় সাহায্য করি।</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">১০০% অথেনটিক পণ্য</h3>
              <p className="text-sm text-gray-500 leading-relaxed">আমাদের সব খাবার ও সাপ্লিমেন্ট সরাসরি বিশ্বখ্যাত ব্রান্ড থেকে আমদানিকৃত এবং চিকিৎসকদের দ্বারা পরীক্ষিত।</p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Brain className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">স্মার্ট এআই গাইডেন্স</h3>
              <p className="text-sm text-gray-500 leading-relaxed">আমাদের ইন্টেলিজেন্ট এআই দিয়ে সঠিক খাবার নির্বাচন, পেট প্রডাক্ট রিকমেন্ডেশন ও তাৎক্ষণিক স্বাস্থ্য পরামর্শ পান।</p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Truck className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">দ্রুত ও নিরাপদ ডেলিভারি</h3>
              <p className="text-sm text-gray-500 leading-relaxed">আপনার অর্ডারকৃত পণ্য আমরা অত্যন্ত যত্নসহকারে ঢাকার ভেতরে ২৪ ঘণ্টায় এবং ঢাকার বাইরে ৩ দিনে পৌঁছে দিই।</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AI Features Spotlight */}
      <section className="py-20 bg-gray-950 text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-2">এআই পাওয়ারড সার্ভিস</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">আমাদের কৃত্রিম বুদ্ধিমত্তা যেভাবে আপনার সাহায্য করবে</h2>
            <p className="text-gray-400 text-sm">পেট শপিং এবং পেট কেয়ারিংকে এক অনন্য উচ্চতায় নিয়ে যেতে আমরা যুক্ত করেছি জেমিনি এআই।</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col sm:flex-row gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/40 hover:bg-white/10 transition-all duration-300">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  গ্লোবাল এআই অ্যাসিস্ট্যান্ট
                  <span className="rounded-full bg-orange-500/20 text-orange-400 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">২৪/৭ একটিভ</span>
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  ওয়েবসাইটের প্রতিটি পেজের নিচে ডান পাশে থাকা বাটনটি ক্লিক করে আমাদের চ্যাটবটের সাথে সরাসরি কথা বলুন। আপনার পোষা প্রাণীর ডায়েট, রোগবালাই এবং শপিং গাইড দিতে এটি সম্পূর্ণ পারদর্শী।
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col sm:flex-row gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-white/10 transition-all duration-300">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  স্মার্ট এআই প্রোডাক্ট রিকমেন্ডেশন
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">ইনস্ট্যান্ট</span>
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  প্রোডাক্ট ডিটেইলস পেজে থাকা '✨ Recommend with AI' বাটনে ক্লিক করলে এআই আপনাকে ঐ পণ্যের পরিপূরক জিনিসপত্র (যেমন: বাটি, ভিটামিন ইত্যাদি) এবং পোষা প্রাণীর যত্ন নেওয়ার জরুরি পরামর্শ বিশ্লেষণ আকারে দেখাবে।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">আমাদের হ্যাপি কাস্টমারস</h2>
            <p className="text-gray-500 text-sm">হাজারো পেট লাভারদের বিশ্বাস ও প্রশংসার কিছু নমুনা</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 space-y-4">
              <div className="flex items-center gap-1 text-orange-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm text-gray-600 italic">"আমার বিড়ালের খাবারের ব্যাপারে আমি চিন্তিত ছিলাম। এদের এআই চ্যাটবটের পরামর্শ অনুযায়ী বিড়ালের খাবার বদলানোর পর এখন ও অনেক হেলদি। ডেলিভারিও খুব ফাস্ট ছিল!"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  এস
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">সাদিয়া রহমান</h4>
                  <p className="text-xs text-gray-400">বিড়াল মালিক, ঢাকা</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 space-y-4">
              <div className="flex items-center gap-1 text-orange-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm text-gray-600 italic">"প্রোডাক্ট পেজের এআই রিকমেন্ডেশন সিস্টেমটা দারুণ! আমি যখন বেল্ট কিনছিলাম, এআই আমাকে সাথে একটি প্রিমিয়াম ডগ কলার সাজেস্ট করেছিল, যেটা সত্যিই দারুণ কোয়ালিটির।"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                  এ
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">আসিফ ইকবাল</h4>
                  <p className="text-xs text-gray-400">গোল্ডেন রিট্রিভার মালিক, চট্টগ্রাম</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 space-y-4">
              <div className="flex items-center gap-1 text-orange-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm text-gray-600 italic">"আমার অ্যাকোয়ারিয়ামের মাছের যত্ন নেওয়ার টিপস খুঁজতে গিয়ে গুগলে হয়রান হয়েছিলাম। কিন্তু এখানকার এআই চ্যাটবট মাত্র ৫ সেকেন্ডে সব চমৎকার খাবার ও পানির টেম্পারেচার টিপস দিল!"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  এম
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">মাহমুদ হাসান</h4>
                  <p className="text-xs text-gray-400">অ্যাকোয়ারিয়াম ও ফিশ এক্সপার্ট</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Accordion */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">সাধারণ জিজ্ঞাসিত প্রশ্নাবলী (FAQ)</h2>
            <p className="text-gray-500 text-sm">আপনার মনে কোনো প্রশ্ন থাকলে নিচের উত্তরগুলো দেখতে পারেন।</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between px-6 py-5 font-bold text-gray-800 text-left hover:text-orange-500 transition-colors focus:outline-none"
                >
                  <span className="text-sm sm:text-base pr-4">{item.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="h-5 w-5 text-orange-500 shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-gray-500 border-t border-gray-50 pt-3 leading-relaxed animate-fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
