"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { 
  Star, 
  Sparkles, 
  ShoppingBag, 
  User, 
  ArrowLeft, 
  X, 
  Check, 
  Heart,
  Plus,
  AlertCircle
} from "lucide-react";

// Backup fallback local products list
const fallbackProducts = [
  {
    _id: "prod-1",
    name: "প্রিমিয়াম ডগ ফুড - চিকেন ও রাইস ফ্লেভার",
    category: "খাবার",
    petType: "dog",
    price: 1250,
    rating: 4.8,
    brand: "Pedigree",
    stock: 25,
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600",
    description: "কুকুরছানাদের রোগ প্রতিরোধ ক্ষমতা ও হাড়ের বৃদ্ধির জন্য ওমেগা-৬ এবং দস্তা সমৃদ্ধ প্রিমিয়াম চিকেন ও রাইস ফ্লেভারের ড্রাই ডগ ফুড। এতে প্রোটিন ও ফাইবার রয়েছে যা হজমে দারুণ সাহায্য করে।",
    reviews: [
      { username: "আরিফ চৌধুরী", rating: 5, comment: "আমার ল্যাব্রাডরের এই খাবারটা খুব পছন্দ। ওর হজমের সমস্যা দূর হয়েছে।" },
      { username: "তাসনিম জাহান", rating: 4, comment: "খুবই ভালো কোয়ালিটি, লোম পড়া অনেকটাই কমেছে।" }
    ]
  },
  {
    _id: "prod-2",
    name: "ডগ চিউ বোন ডেন্টাল টয়",
    category: "খেলনা",
    petType: "dog",
    price: 350,
    rating: 4.5,
    brand: "Kong",
    stock: 50,
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600",
    description: "কুকুরের দাঁত পরিষ্কার রাখার ও কামড়ানোর অভ্যাস ঠিক রাখার জন্য মজবুত ডেন্টাল চিউ বোন রাবার টয়। এটি খেলতে খেলতে দাঁতের ক্যালসিয়াম প্লেট পরিষ্কার করে ও মাড়ি সুস্থ রাখে।",
    reviews: [
      { username: "নাবিলা রহমান", rating: 4, comment: "অনেক টেকসই খেলনা, সহজে কামড়ে ছিঁড়তে পারে না।" }
    ]
  },
  {
    _id: "prod-3",
    name: "প্রিমিয়াম রিফ্লেক্টিভ ডগ হারনেস ও লিশ",
    category: "এক্সেসরিজ",
    petType: "dog",
    price: 950,
    rating: 4.7,
    brand: "Ruffwear",
    stock: 15,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600",
    description: "রাতে হাঁটার জন্য লাইট-রিফ্লেক্টিভ স্ট্র্যাপ যুক্ত প্রিমিয়াম ডগ হারনেস ও লিশ সেট। এটি কুকুরের ঘাড়ে চাপ না ফেলে বডি কন্ট্রোল নিশ্চিত করে এবং সহজে পরানো যায়।",
    reviews: [
      { username: "ফয়সাল আহমেদ", rating: 5, comment: "অসাধারণ ডিজাইন। রাতের বেলা রিফ্লেক্টর থাকার কারণে কুকুরকে দূর থেকে দেখা যায়।" }
    ]
  },
  {
    _id: "prod-4",
    name: "অর্গানিক টুনা ও সালমন ডিশ ক্যাট ক্যান",
    category: "খাবার",
    petType: "cat",
    price: 220,
    rating: 4.9,
    brand: "Whiskas",
    stock: 100,
    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600",
    description: "সালমন ও টুনা মাছের গ্রেভি সমৃদ্ধ অত্যন্ত সুস্বাদু ভেজা ক্যাট ফুড ক্যান। এটি বিড়ালের শরীরে পানির ভারসাম্য রক্ষা করে ও প্রোটিনের ঘাটতি পূরণ করে।",
    reviews: [
      { username: "রিয়া সুলতানা", rating: 5, comment: "আমার পারসিয়ান বিড়াল সালমন ক্যান ছাড়া অন্য কিছুই খেতে চায় না!" }
    ]
  },
  {
    _id: "prod-5",
    name: "ক্যাট স্ক্র্যাচিং পোস্ট ও ক্যাসেল টয়",
    category: "খেলনা",
    petType: "cat",
    price: 2450,
    rating: 4.8,
    brand: "Frisco",
    stock: 8,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600",
    description: "বিড়ালের নখ ধারালো করার স্ক্র্যাচিং পোস্ট ও ঘুমানোর আরামদায়ক কুশন ক্যাসেল ডাবল লেভেল ট্রি। এটি আপনার সোফা বা দেয়াল নখের স্ক্র্যাচ থেকে মুক্ত রাখবে।",
    reviews: [
      { username: "সানজিদা আক্তার", rating: 5, comment: "অনেক বড় আর সুন্দর। আমার দুটি বিড়াল সারাদিন এটার ভেতরেই খেলে।" }
    ]
  },
  {
    _id: "prod-6",
    name: "আর্গোনমিক ক্যাট ওয়াটার বোল",
    category: "এক্সেসরিজ",
    petType: "cat",
    price: 420,
    rating: 4.4,
    brand: "Catit",
    stock: 45,
    image: "https://images.unsplash.com/photo-1615087240969-eeff2fa558f2?w=600",
    description: "বিড়ালের ঘাড়ে ব্যথা না হওয়ার জন্য ১৫ ডিগ্রি বাঁকানো এবং নন-স্লিপ সিরামিক ক্যাট ফিডিং ডিশ বোল। এটি বিড়ালের হুইস্কারের ঘষা এড়াতে চওড়া করে তৈরি।"
  },
  {
    _id: "prod-7",
    name: "মিক্সড সিডস অ্যান্ড ফ্রুটস বার্ড ফিড",
    category: "খাবার",
    petType: "bird",
    price: 350,
    rating: 4.7,
    brand: "ZuPreem",
    stock: 50,
    image: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=600",
    description: "বাজরিগার, লাভবার্ড এবং কোকাটেল পাখির জন্য সূর্যমুখী বীজ, চিনা, কাউন এবং শুকনো ফলের টুকরোর পুষ্টিকর মিক্সড বার্ড ফিড।"
  },
  {
    _id: "prod-8",
    name: "গোল্ডফিশ অ্যান্ড ট্রপিকাল ফ্লেক ফুড",
    category: "খাবার",
    petType: "fish",
    price: 190,
    rating: 4.8,
    brand: "Tetra",
    stock: 90,
    image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600",
    description: "অ্যাকোয়ারিয়ামের সোনালী গোল্ডফিশ ও রঙিন ট্রপিকাল মাছের উজ্জ্বল রঙের জন্য বিশেষ পুষ্টিকর ড্রাই ফ্লেক ফুড।"
  }
];

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  // Fetch product data
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      return response.data;
    },
    retry: 1
  });

  // Fetch AI Recommendations
  const { data: aiRecs, isLoading: isAiLoading, refetch: refetchAi } = useQuery({
    queryKey: ["ai-recommend", id],
    queryFn: async () => {
      const response = await axios.post("http://localhost:5000/api/ai/recommend", {
        productId: id
      });
      return response.data;
    },
    enabled: false // only fetch when side panel is opened
  });

  // Review Submission mutation
  const reviewMutation = useMutation({
    mutationFn: async (newReview) => {
      const response = await axios.post(`http://localhost:5000/api/products/${id}/reviews`, newReview);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["product", id], data.product);
      setComment("");
      setRating(5);
      setShowReviewSuccess(true);
      setTimeout(() => setShowReviewSuccess(false), 4000);
    },
    onError: () => {
      // Local fallback for offline review submit
      const updatedProduct = { ...activeProduct };
      updatedProduct.reviews = [
        ...(updatedProduct.reviews || []),
        { username: "বেনামী গ্রাহক", rating, comment, createdAt: new Date() }
      ];
      // Recalculate average rating
      const totalRating = updatedProduct.reviews.reduce((acc, item) => item.rating + acc, 0);
      updatedProduct.rating = Number((totalRating / updatedProduct.reviews.length).toFixed(1));
      
      // Update local state by overriding queryClient cache
      queryClient.setQueryData(["product", id], updatedProduct);
      setComment("");
      setRating(5);
      setShowReviewSuccess(true);
      setTimeout(() => setShowReviewSuccess(false), 4000);
    }
  });

  const handleOpenAIRecommendation = () => {
    setIsRecommendOpen(true);
    refetchAi();
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    reviewMutation.mutate({ rating, comment });
  };

  // Find fallback product if API is offline
  const fallbackProduct = fallbackProducts.find(p => p._id === id) || fallbackProducts[0];
  const activeProduct = !isLoading && !isError && product ? product : fallbackProduct;

  // Find related products
  const relatedProducts = fallbackProducts
    .filter(p => p.petType === activeProduct.petType && p._id !== activeProduct._id)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full animate-pulse space-y-8">
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-200 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-4 w-24 bg-gray-200 rounded-full" />
            <div className="h-8 w-3/4 bg-gray-200 rounded-full" />
            <div className="h-6 w-32 bg-gray-200 rounded-full" />
            <div className="h-20 w-full bg-gray-200 rounded-2xl" />
            <div className="h-12 w-48 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full relative">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        ফিরে যান
      </button>

      {/* Main product block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
        {/* Left Column - Large Image */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
            <img
              src={activeProduct.image}
              alt={activeProduct.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Mock image gallery */}
          <div className="grid grid-cols-4 gap-3">
            <div className="aspect-square rounded-xl overflow-hidden border-2 border-orange-500 cursor-pointer">
              <img src={activeProduct.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <img src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=150" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <img src="https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=150" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <img src="https://images.unsplash.com/photo-1615087240969-eeff2fa558f2?w=150" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Right Column - Product details */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {activeProduct.category}
              </span>
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {activeProduct.petType === "dog" ? "কুকুর" : activeProduct.petType === "cat" ? "বিড়াল" : activeProduct.petType === "bird" ? "পাখি" : activeProduct.petType === "fish" ? "মাছ" : "অন্যান্য"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {activeProduct.name}
            </h1>

            {/* Brand & Stock */}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <p>ব্র্যান্ড: <strong className="text-gray-900">{activeProduct.brand}</strong></p>
              <p>স্টক: 
                <span className={`ml-1 font-bold ${activeProduct.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {activeProduct.stock > 0 ? `${activeProduct.stock} টি উপলব্ধ` : "আউট অফ স্টক"}
                </span>
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4.5 w-4.5 ${
                    i < Math.round(activeProduct.rating) 
                      ? "fill-orange-500 text-orange-500" 
                      : "text-gray-200"
                  }`} 
                />
              ))}
              <span className="text-xs font-bold text-gray-600 ml-1.5">({activeProduct.rating} রেটিং)</span>
            </div>

            {/* Price */}
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">সর্বমোট মূল্য</p>
                <p className="text-3xl font-black text-gray-900">৳ {activeProduct.price}</p>
              </div>
              <button 
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 transition-all hover:scale-[1.02] active:scale-95"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                কার্টে যোগ করুন
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-gray-900">পণ্যের বিবরণ:</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{activeProduct.description}</p>
            </div>
          </div>

          {/* ✨ Recommend with AI Button */}
          <div className="pt-6 border-t border-gray-100">
            <button
              onClick={handleOpenAIRecommendation}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 p-4 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-95"
            >
              <Sparkles className="h-5 w-5 animate-pulse" />
              ✨ Recommend with AI
            </button>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
        {/* Left: Review List */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            গ্রাহক মতামত ও রিভিউস ({activeProduct.reviews?.length || 0})
          </h2>

          {activeProduct.reviews?.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 text-gray-400 text-sm">
              এই প্রোডাক্টে এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনি দিন!
            </div>
          ) : (
            <div className="space-y-4">
              {activeProduct.reviews.map((rev, idx) => (
                <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-gray-800">{rev.username}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString("bn-BD")}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3.5 w-3.5 ${
                          i < rev.rating 
                            ? "fill-orange-500 text-orange-500" 
                            : "text-gray-100"
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Add a Review Form */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900">একটি রিভিউ যোগ করুন</h3>
            
            {showReviewSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-100 animate-fade-in">
                <Check className="h-4 w-4 shrink-0" />
                আপনার রিভিউটি সফলভাবে সাবমিট হয়েছে!
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">রেটিং সিলেক্ট করুন</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star 
                        className={`h-7 w-7 ${
                          star <= rating 
                            ? "fill-orange-500 text-orange-500" 
                            : "text-gray-200"
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">আপনার মন্তব্য</label>
                <textarea
                  rows={3}
                  required
                  placeholder="এই পণ্যটি সম্পর্কে আপনার মতামত এখানে লিখুন..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 p-4 text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={reviewMutation.isPending || !comment.trim()}
                className="w-full rounded-full bg-slate-900 hover:bg-orange-500 disabled:bg-gray-100 disabled:text-gray-300 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition-all"
              >
                {reviewMutation.isPending ? "সাবমিট হচ্ছে..." : "রিভিউ জমা দিন"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-xl font-bold text-gray-900 mb-6">সংশ্লিষ্ট অন্যান্য পণ্যসমূহ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedProducts.map((prod) => (
            <div 
              key={prod._id}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
            >
              <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-bold text-orange-600 flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
                  {prod.rating}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-orange-500 transition-colors mb-2">
                  <Link href={`/products/${prod._id}`}>{prod.name}</Link>
                </h3>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <span className="text-sm font-black text-gray-900">৳ {prod.price}</span>
                  <Link 
                    href={`/products/${prod._id}`}
                    className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-0.5"
                  >
                    বিস্তারিত
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendation Sidebar Overlay */}
      {isRecommendOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setIsRecommendOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          {/* Sidebar Drawer */}
          <div className="relative w-full max-w-lg h-full bg-white shadow-2xl border-l border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <h2 className="text-base font-bold">✨ Recommend with Gemini AI</h2>
              </div>
              <button 
                onClick={() => setIsRecommendOpen(false)}
                className="rounded-lg p-1 text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body Scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isAiLoading ? (
                /* Loading State Skeletons */
                <div className="animate-pulse space-y-6">
                  <div className="h-20 w-full bg-gray-100 rounded-2xl" />
                  <div className="space-y-3">
                    <div className="h-4 w-32 bg-gray-100 rounded-full" />
                    <div className="h-24 w-full bg-gray-100 rounded-2xl" />
                    <div className="h-24 w-full bg-gray-100 rounded-2xl" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-32 bg-gray-100 rounded-full" />
                    <div className="h-16 w-full bg-gray-100 rounded-2xl" />
                  </div>
                </div>
              ) : aiRecs ? (
                /* Render AI Recommendations */
                <>
                  {/* Analysis Box */}
                  <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4 space-y-2">
                    <h3 className="text-xs font-bold text-orange-800 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-orange-600" />
                      এআই বিশ্লেষণ ও ব্যাখ্যা
                    </h3>
                    <p className="text-xs sm:text-sm text-orange-900 leading-relaxed font-medium">
                      {aiRecs.explanation}
                    </p>
                  </div>

                  {/* Complementary Accessories */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="h-4.5 w-4.5 text-emerald-500" />
                      পরিপূরক প্রয়োজনীয় এক্সেসরিজ
                    </h3>
                    <div className="space-y-3">
                      {aiRecs.accessories?.map((acc, index) => (
                        <div key={index} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
                          <div className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-800">{acc.name}</h4>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{acc.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pet Care Tips */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="h-4.5 w-4.5 text-blue-500" />
                      পোষা প্রাণীর যত্নে জরুরি টিপস
                    </h3>
                    <div className="space-y-2.5">
                      {aiRecs.tips?.map((tip, index) => (
                        <div key={index} className="flex gap-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-orange-500 font-bold">✔</span>
                          <p>{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">
                  রিকমেন্ডেশন ডাটা লোড করা যায়নি। অনুগ্রহ করে সার্ভার কানেকশন চেক করুন।
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-[10px] text-gray-400">Gemini-2.5-Flash এআই দ্বারা পরিচালিত পরামর্শ</p>
              <button 
                onClick={() => setIsRecommendOpen(false)}
                className="rounded-full bg-gray-900 hover:bg-orange-500 px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
