"use client";

import { useState } from "react";
import Link from "next/link";
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
  Plus,
  AlertCircle,
  Inbox,
  MessageSquare,
  Loader2
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [commentText, setCommentText] = useState("");
  const [userName, setUserName] = useState("");
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  // ✅ Product details fetch
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      return response.data?.data || response.data;
    },
    retry: 1,
    enabled: !!id
  });

  // ✅ Comments fetch - আলাদা endpoint থেকে
  const { 
    data: commentsData, 
    isLoading: isCommentsLoading,
    refetch: refetchComments
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/api/products/${id}/comments`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 30 * 1000 // ৩০ সেকেন্ড cache
  });

  const comments = commentsData?.comments || [];

  // ✅ Related products fetch (same petType)
  const { data: relatedData } = useQuery({
    queryKey: ["related-products", product?.petType],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/api/products`, {
        params: { petType: product?.petType, limit: 4 }
      });
      return response.data;
    },
    enabled: !!product?.petType,
    staleTime: 2 * 60 * 1000
  });

  const relatedProducts = (relatedData?.products || [])
    .filter(p => p._id !== id)
    .slice(0, 3);

  // ✅ AI Recommendations
  const { data: aiRecs, isLoading: isAiLoading, refetch: refetchAi } = useQuery({
    queryKey: ["ai-recommend", id],
    queryFn: async () => {
      const response = await axios.post('/api/ai/recommend', { productId: id });
      return response.data;
    },
    enabled: false
  });

  // ✅ Comment Submit - backend এর field name অনুযায়ী: userName, rating, commentText
  const commentMutation = useMutation({
    mutationFn: async (newComment) => {
      const response = await axios.post(
        `${BASE_URL}/api/products/${id}/comments`, 
        newComment
      );
      return response.data;
    },
    onSuccess: () => {
      // Comment list রিফ্রেশ করো
      refetchComments();
      queryClient.invalidateQueries(["comments", id]);
      setCommentText("");
      setUserName("");
      setRating(5);
      setShowReviewSuccess(true);
      setTimeout(() => setShowReviewSuccess(false), 4000);
    }
  });

  const handleOpenAIRecommendation = () => {
    setIsRecommendOpen(true);
    refetchAi();
  };
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !userName.trim()) return;
    commentMutation.mutate({ userName, rating, commentText });
  };

  // ─── Loading ────────────────────────────────────────────────
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

  // ─── Error ───────────────────────────────────────────────────
  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> ফিরে যান
        </button>
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Inbox className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">পণ্যটি পাওয়া যায়নি!</h2>
          <p className="text-gray-500 text-sm max-w-sm">
            সার্ভার ({BASE_URL}) থেকে পণ্যটির তথ্য আনতে সমস্যা হয়েছে।
          </p>
          <button onClick={() => router.push("/products")} className="mt-2 rounded-full bg-orange-500 hover:bg-orange-600 px-6 py-2.5 text-sm font-bold text-white transition-colors">
            সব পণ্য দেখুন
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Render ──────────────────────────────────────────────
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

      {/* ── Product Details Block ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">

        {/* Left – Image */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        
        </div>

        {/* Right – Info */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {product.category}
              </span>
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {product.petType === "dog" ? "কুকুর" : product.petType === "cat" ? "বিড়াল" : product.petType === "bird" ? "পাখি" : product.petType === "fish" ? "মাছ" : "অন্যান্য"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>

            {/* Brand & Stock */}
            <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
              {product.brand && <p>ব্র্যান্ড: <strong className="text-gray-900">{product.brand}</strong></p>}
              <p>স্টক:
                <span className={`ml-1 font-bold ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {product.stock > 0 ? `${product.stock} টি উপলব্ধ` : "আউট অফ স্টক"}
                </span>
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-orange-500 text-orange-500" : "text-gray-200"}`} />
              ))}
              <span className="text-xs font-bold text-gray-600 ml-1.5">({product.rating} রেটিং)</span>
            </div>

            {/* Price */}
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">সর্বমোট মূল্য</p>
                <p className="text-3xl font-black text-gray-900">৳ {product.price}</p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 transition-all hover:scale-[1.02] active:scale-95">
                <ShoppingBag className="h-4 w-4" />
                কার্টে যোগ করুন
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-gray-900">পণ্যের বিবরণ:</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* AI Button */}
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

      {/* ── Comments Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">

        {/* Left: Comments List */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-orange-500" />
            গ্রাহক মতামত ও রিভিউস
            <span className="ml-1 text-base font-normal text-gray-400">
              ({commentsData?.totalComments ?? 0})
            </span>
          </h2>

          {isCommentsLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map(i => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 space-y-3">
                  <div className="flex gap-3 items-center">
                    <div className="h-7 w-7 rounded-full bg-gray-200" />
                    <div className="h-3 w-28 bg-gray-200 rounded-full" />
                  </div>
                  <div className="h-3 w-24 bg-gray-200 rounded-full" />
                  <div className="h-10 w-full bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-gray-100 text-gray-400 text-sm">
              এই প্রোডাক্টে এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনি দিন!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((rev) => (
                <div key={rev.commentId} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-gray-800">{rev.userName}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("bn-BD") : ""}
                    </span>
                  </div>
                  {rev.rating > 0 && (
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-orange-500 text-orange-500" : "text-gray-200"}`} />
                      ))}
                      <span className="text-[10px] text-gray-400 ml-1">{rev.rating}/5</span>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{rev.commentText}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Add Comment Form */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 sticky top-6">
            <h3 className="text-base font-bold text-gray-900">একটি রিভিউ যোগ করুন</h3>

            {showReviewSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-100">
                <Check className="h-4 w-4 shrink-0" />
                আপনার রিভিউটি সফলভাবে সাবমিট হয়েছে!
              </div>
            )}

            {commentMutation.isError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 text-xs font-semibold rounded-xl border border-red-100">
                <AlertCircle className="h-4 w-4 shrink-0" />
                রিভিউ সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।
              </div>
            )}

            <form onSubmit={handleCommentSubmit} className="space-y-4">
              {/* User Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  আপনার নাম <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="আপনার নাম লিখুন..."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>

              {/* Star Rating */}
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
                      <Star className={`h-7 w-7 ${star <= rating ? "fill-orange-500 text-orange-500" : "text-gray-200"}`} />
                    </button>
                  ))}
                  <span className="text-xs text-gray-500 ml-1 font-semibold">{rating}/5</span>
                </div>
              </div>

              {/* Comment Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  আপনার মন্তব্য <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="এই পণ্যটি সম্পর্কে আপনার মতামত এখানে লিখুন..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 p-4 text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={commentMutation.isPending || !commentText.trim() || !userName.trim()}
                className="w-full rounded-full bg-slate-900 hover:bg-orange-500 disabled:bg-gray-100 disabled:text-gray-300 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition-all flex items-center justify-center gap-2"
              >
                {commentMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    সাবমিট হচ্ছে...
                  </>
                ) : "রিভিউ জমা দিন"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">সংশ্লিষ্ট অন্যান্য পণ্যসমূহ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((prod) => (
              <div key={prod._id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                    <Link href={`/products/${prod._id}`} className="text-xs font-bold text-orange-500 hover:text-orange-600">
                      বিস্তারিত →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AI Sidebar ── */}
      {isRecommendOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div onClick={() => setIsRecommendOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg h-full bg-white shadow-2xl border-l border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <h2 className="text-base font-bold">✨ Recommend with Gemini AI</h2>
              </div>
              <button onClick={() => setIsRecommendOpen(false)} className="rounded-lg p-1 text-white hover:bg-white/10 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isAiLoading ? (
                <div className="animate-pulse space-y-6">
                  <div className="h-20 w-full bg-gray-100 rounded-2xl" />
                  <div className="space-y-3">
                    <div className="h-4 w-32 bg-gray-100 rounded-full" />
                    <div className="h-24 w-full bg-gray-100 rounded-2xl" />
                    <div className="h-24 w-full bg-gray-100 rounded-2xl" />
                  </div>
                </div>
              ) : aiRecs ? (
                <>
                  <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4 space-y-2">
                    <h3 className="text-xs font-bold text-orange-800 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-orange-600" />
                      এআই বিশ্লেষণ ও ব্যাখ্যা
                    </h3>
                    <p className="text-xs sm:text-sm text-orange-900 leading-relaxed font-medium">{aiRecs.explanation}</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="h-4 w-4 text-emerald-500" />
                      পরিপূরক এক্সেসরিজ
                    </h3>
                    <div className="space-y-3">
                      {aiRecs.accessories?.map((acc, index) => (
                        <div key={index} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
                          <div className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">{index + 1}</div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-800">{acc.name}</h4>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{acc.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                      পোষা প্রাণীর যত্নে টিপস
                    </h3>
                    <div className="space-y-2.5">
                      {aiRecs.tips?.map((tip, index) => (
                        <div key={index} className="flex gap-2.5 text-xs sm:text-sm text-gray-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-orange-500 font-bold shrink-0">✔</span>
                          <p>{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">
                  রিকমেন্ডেশন লোড হয়নি। সার্ভার কানেকশন চেক করুন।
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-[10px] text-gray-400">Gemini-2.5-Flash দ্বারা পরিচালিত</p>
              <button onClick={() => setIsRecommendOpen(false)} className="rounded-full bg-gray-900 hover:bg-orange-500 px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors">
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
