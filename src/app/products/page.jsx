"use client";

import { useState, useEffect } from "react";
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

// Backup fallback local products list in case API fails
const fallbackProducts = [
  {
    _id: "prod-1",
    name: "প্রিমিয়াম ডগ ফুড - চিকেন ও রাইস ফ্লেভার",
    category: "খাবার",
    petType: "dog",
    price: 1250,
    rating: 4.8,
    brand: "Pedigree",
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500",
    description: "কুকুরছানাদের রোগ প্রতিরোধ ক্ষমতা ও হাড়ের বৃদ্ধির জন্য ওমেগা-৬ এবং দস্তা সমৃদ্ধ প্রিমিয়াম চিকেন ও রাইস ফ্লেভারের ড্রাই ডগ ফুড।"
  },
  {
    _id: "prod-2",
    name: "ডগ চিউ বোন ডেন্টাল টয়",
    category: "খেলনা",
    petType: "dog",
    price: 350,
    rating: 4.5,
    brand: "Kong",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500",
    description: "কুকুরের দাঁত পরিষ্কার রাখার ও কামড়ানোর অভ্যাস ঠিক রাখার জন্য মজবুত ডেন্টাল চিউ বোন রাবার টয়।"
  },
  {
    _id: "prod-3",
    name: "প্রিমিয়াম রিফ্লেক্টিভ ডগ হারনেস ও লিশ",
    category: "এক্সেসরিজ",
    petType: "dog",
    price: 950,
    rating: 4.7,
    brand: "Ruffwear",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
    description: "রাতে হাঁটার জন্য লাইট-রিফ্লেক্টিভ স্ট্র্যাপ যুক্ত প্রিমিয়াম ডগ হারনেস ও লিশ সেট।"
  },
  {
    _id: "prod-4",
    name: "অর্গানিক টুনা ও সালমন ডিশ ক্যাট ক্যান",
    category: "খাবার",
    petType: "cat",
    price: 220,
    rating: 4.9,
    brand: "Whiskas",
    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500",
    description: "সালমন ও টুনা মাছের গ্রেভি সমৃদ্ধ অত্যন্ত সুস্বাদু ভেজা ক্যাট ফুড ক্যান।"
  },
  {
    _id: "prod-5",
    name: "ক্যাট স্ক্র্যাচিং পোস্ট ও ক্যাসেল টয়",
    category: "খেলনা",
    petType: "cat",
    price: 2450,
    rating: 4.8,
    brand: "Frisco",
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500",
    description: "বিড়ালের নখ ধারালো করার স্ক্র্যাচিং পোস্ট ও ঘুমানোর আরামদায়ক কুশন ক্যাসেল ডাবল লেভেল ট্রি।"
  },
  {
    _id: "prod-6",
    name: "আর্গোনমিক ক্যাট ওয়াটার বোল",
    category: "এক্সেসরিজ",
    petType: "cat",
    price: 420,
    rating: 4.4,
    brand: "Catit",
    image: "https://images.unsplash.com/photo-1615087240969-eeff2fa558f2?w=500",
    description: "বিড়ালের ঘাড়ে ব্যথা না হওয়ার জন্য ১৫ ডিগ্রি বাঁকানো এবং নন-স্লিপ সিরামিক ক্যাট ফিডিং ডিশ বোল।"
  },
  {
    _id: "prod-7",
    name: "মিক্সড সিডস অ্যান্ড ফ্রুটস বার্ড ফিড",
    category: "খাবার",
    petType: "bird",
    price: 350,
    rating: 4.7,
    brand: "ZuPreem",
    image: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=500",
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
    image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=500",
    description: "অ্যাকোয়ারিয়ামের সোনালী গোল্ডফিশ ও রঙিন ট্রপিকাল মাছের উজ্জ্বল রঙের জন্য বিশেষ পুষ্টিকর ড্রাই ফ্লেক ফুড।"
  }
];

const categories = ["all", "খাবার", "খেলনা", "এক্সেসরিজ", "গ্রুমিং"];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  // React Query fetch
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", search, petType, category, sort, page],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/api/products", {
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

  // Client-side filtering logic for fallback (if Express is offline)
  const getFilteredFallback = () => {
    let filtered = [...fallbackProducts];

    if (search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    }
    if (petType !== "all") {
      filtered = filtered.filter(p => p.petType === petType);
    }
    if (category !== "all") {
      filtered = filtered.filter(p => p.category === category);
    }

    if (sort === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "rating_desc") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    // Paginate fallback (9 items per page)
    const limit = 9;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      products: paginated,
      pagination: {
        total: filtered.length,
        page: page,
        limit: limit,
        pages: Math.ceil(filtered.length / limit)
      }
    };
  };

  // Decide if we use API data or fallback
  const productsList = !isLoading && !isError && data?.products ? data.products : getFilteredFallback().products;
  const pagination = !isLoading && !isError && data?.pagination ? data.pagination : getFilteredFallback().pagination;
  const isUsingFallback = isError;

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
            {isUsingFallback && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                অফলাইন মোড
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-1">আপনার পোষা প্রাণীর জন্য সেরা খাবার, খেলনা এবং প্রয়োজনীয় সব জিনিসপত্র এখানে পাবেন।</p>
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
                { name: "বিড়াল (Cats)", value: "cat" },
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

          {/* Category Filters */}
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
          ) : productsList.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <Inbox className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">কোনো পণ্য পাওয়া যায়নি!</h3>
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
                      {prod.petType === "dog" ? "কুকুর" : prod.petType === "cat" ? "বিড়াল" : prod.petType === "bird" ? "পাখি" : prod.petType === "fish" ? "মাছ" : "অন্যান্য"}
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
