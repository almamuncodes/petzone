"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  PawPrint,
  Sparkles,
  ShoppingBag,
  Inbox
} from "lucide-react";

// ক্যাটাগরি API load হওয়ার আগ পর্যন্ত সাময়িক placeholder (ডিজাইন ভাঙবে না, ডেটা এখান থেকে আসে না)
const placeholderCategories = ["all"];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Parse state from URL params
  const initialPetType = searchParams.get("petType") || "all";
  const initialCategory = searchParams.get("category") || "all";
  const initialSort = searchParams.get("sort") || "newest";
  const initialSearch = searchParams.get("search") || "";
  const initialPage = parseInt(searchParams.get("page") || "1");

  const [search, setSearch] = useState(initialSearch);
  const [petType, setPetType] = useState(initialPetType);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);

  // Sync state with URL changes (e.g. from Home page click)
  useEffect(() => {
    setPetType(searchParams.get("petType") || "all");
    setCategory(searchParams.get("category") || "all");
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // Update URL function
  const updateURL = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val === undefined || val === null || val === "" || val === "all") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.push(`/products?${params.toString()}`);
  };

  // React Query fetch - products
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", search, petType, category, sort, page],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/api/products`, {
        params: {
          search,
          category,
          petType,
          sort,
          page,
          limit: 9
        }
      });
      return response.data;
    },
    retry: 1
  });

  // ✅ React Query fetch - categories (DB থেকে dynamic ভাবে আসবে)
  const { data: categoriesData, isError: isCategoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/api/categories");
      return response.data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000 // ৫ মিনিট পর্যন্ত ক্যাশে রাখবে
  });

  const categories = !isCategoriesError && categoriesData?.categories
    ? ["all", ...categoriesData.categories]
    : placeholderCategories;

  // শুধু backend থেকে যা আসবে সেটাই দেখাবে - কোনো static fallback data নেই
  const productsList = data?.products || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 9, pages: 0 };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    updateURL({ search, page: 1 });
  };

  const handlePetFilter = (type) => {
    setPetType(type);
    setPage(1);
    updateURL({ petType: type, page: 1 });
  };

  const handleCategoryFilter = (cat) => {
    setCategory(cat);
    setPage(1);
    updateURL({ category: cat, page: 1 });
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    updateURL({ sort: newSort });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    updateURL({ page: newPage });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
      {/* Title Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
            পেট শপ ক্যাটালগ 
          </h1>
          <p className="text-gray-500 text-sm mt-1">আপনার পোষা প্রাণীর জন্য সেরা খাবার, খেলনা এবং প্রয়োজনীয় সব জিনিসপত্র এখানে পাবেন।</p>
        </div>
        
        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="প্রোডাক্ট খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 pr-12 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
          <button type="submit" className="absolute right-4 top-3.5 text-gray-400 hover:text-orange-500">
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pet Type Filters */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <PawPrint className="h-4 w-4 text-orange-500" />
              পোষা প্রাণীর ধরন
            </h3>
            <div className="space-y-2">
              {[
                { name: "সব প্রাণী", value: "all" },
                { name: "কুকুর (Dogs)", value: "dog" },
                { name: "বিড়াল (Cats)", value: "cat" },
                { name: "পাখি (Birds)", value: "bird" },
                { name: "মাছ (Fish)", value: "fish" }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => handlePetFilter(type.value)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    petType === type.value
                      ? "bg-orange-50 text-orange-600 font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filters - এখন DB থেকে dynamic ভাবে আসছে */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4 text-emerald-500" />
              ক্যাটাগরি
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryFilter(cat)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                    category === cat
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {cat === "all" ? "সব ক্যাটাগরি" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Catalog List */}
        <div className="lg:col-span-3 space-y-8">
          {/* Sorting Header */}
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm">
            <span className="text-sm text-gray-500 font-medium">
              মোট পণ্য: <strong className="text-gray-900">{pagination.total}</strong> টি
            </span>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-400" />
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm bg-transparent border-0 font-semibold text-gray-700 focus:ring-0 outline-none cursor-pointer hover:text-orange-500"
              >
                <option value="newest">নতুন আপলোড</option>
                <option value="price_asc">দাম: কম থেকে বেশি</option>
                <option value="price_desc">দাম: বেশি থেকে কম</option>
                <option value="rating_desc">সর্বোচ্চ রেটিং</option>
              </select>
            </div>
          </div>

          {/* Skeleton Loader Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm animate-pulse h-[380px] flex flex-col">
                  <div className="bg-gray-200 w-full h-[200px]" />
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="h-3 w-16 bg-gray-200 rounded-full" />
                      <div className="h-4 w-full bg-gray-200 rounded-full" />
                      <div className="h-4 w-2/3 bg-gray-200 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-6 w-20 bg-gray-200 rounded-full" />
                      <div className="h-8 w-24 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            /* Connection / API Error State */
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <Inbox className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">সার্ভারের সাথে কানেক্ট করা যায়নি!</h3>
              <p className="text-gray-500 text-sm max-w-sm">
                ব্যাকএন্ড API (<code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">${BASE_URL}/api/products</code>) থেকে ডেটা আনতে ব্যর্থ হয়েছে।
                সার্ভার চালু আছে কিনা এবং URL/পোর্ট ঠিক আছে কিনা চেক করুন।
              </p>
            </div>
          ) : productsList.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <Inbox className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">কোনো পণ্য পাওয়া যায়নি!</h3>
              <p className="text-gray-500 text-sm max-w-sm">আপনার সার্চ বা সিলেক্ট করা ফিল্টারের সাথে মিলে এমন কোনো প্রোডাক্ট ক্যাটালগে নেই। অনুগ্রহ করে অন্য কিছু খুঁজুন।</p>
              <button
                onClick={() => {
                  setSearch("");
                  setPetType("all");
                  setCategory("all");
                  setPage(1);
                  router.push("/products");
                }}
                className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-orange-600 transition-colors"
              >
                ফিল্টার রিসেট করুন
              </button>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsList.map((prod) => (
                <div
                  key={prod._id}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full animate-fade-in"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Rating Badge */}
                    <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-orange-600 flex items-center gap-1 shadow-sm">
                      <Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                      {prod.rating || 5.0}
                    </div>
                    {/* Pet Type Tag */}
                    <div className="absolute top-3 right-3 rounded-full bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                      {prod.petType === "dog" ? "কুকুর" : prod.petType === "cat" ? "বিড়াল" : prod.petType === "bird" ? "পাখি" : prod.petType === "fish" ? "মাছ" : "অন্যান্য"}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1.5">{prod.category}</span>
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 line-clamp-2 hover:text-orange-500 transition-colors mb-3">
                      <Link href={`/products/${prod._id}`}>{prod.name}</Link>
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">{prod.description}</p>
                    
                    {/* Pricing and Button */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">মূল্য</span>
                        <span className="text-base font-black text-gray-900">৳ {prod.price}</span>
                      </div>
                      <Link
                        href={`/products/${prod._id}`}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-100 transition-all duration-200"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        বিস্তারিত
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm text-gray-600 hover:text-orange-500 disabled:opacity-50 disabled:hover:text-gray-600 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`h-10 w-10 rounded-xl text-sm font-bold shadow-sm transition-all ${
                    page === i + 1
                      ? "bg-orange-500 text-white"
                      : "bg-white border border-gray-100 text-gray-600 hover:text-orange-500"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.pages}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm text-gray-600 hover:text-orange-500 disabled:opacity-50 disabled:hover:text-gray-600 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full animate-pulse space-y-8">
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
        <div className="h-10 w-full bg-gray-200 rounded-2xl" />
        <div className="h-64 w-full bg-gray-200 rounded-3xl" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}