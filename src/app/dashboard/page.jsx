"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import { 
  Package, 
  Layers, 
  MessageSquare, 
  Star, 
  Plus, 
  Trash2, 
  Eye, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Image as ImageIcon
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

// Local fallback products database
const initialFallbackProducts = [
  { _id: "prod-1", name: "প্রিমিয়াম ডগ ফুড - চিকেন ও রাইস ഫ্লেভার", category: "খাবার", petType: "dog", price: 1250, stock: 35, brand: "Pedigree", image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300", description: "চিকেন ফ্লেভার ডগ ফুড", rating: 4.8 },
  { _id: "prod-2", name: "ডগ চিউ বোন ডেন্টাল টয়", category: "খেলনা", petType: "dog", price: 350, stock: 60, brand: "Kong", image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300", description: "রাবার চিউ বোন", rating: 4.5 },
  { _id: "prod-3", name: "প্রিমিয়াম রিফ্লেক্টিভ ডগ হারনেস", category: "এক্সেসরিজ", petType: "dog", price: 950, stock: 15, brand: "Ruffwear", image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300", description: "ডগ হারনেস", rating: 4.7 },
  { _id: "prod-4", name: "অর্গানিক টুনা ও সালমন ক্যাট ক্যান", category: "খাবার", petType: "cat", price: 220, stock: 100, brand: "Whiskas", image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=300", description: "সালমন ক্যান", rating: 4.9 },
  { _id: "prod-5", name: "ক্যাট স্ক্র্যাচিং পোস্ট ও ক্যাসেল", category: "খেলনা", petType: "cat", price: 2450, stock: 8, brand: "Frisco", image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=300", description: "স্ক্র্যাচিং পোস্ট", rating: 4.8 }
];

const COLORS = ["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"];

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Form states for Add Product
  const [name, setName] = useState("");
  const [category, setCategory] = useState("খাবার");
  const [petType, setPetType] = useState("dog");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [features, setFeatures] = useState("");

  const [aiGenerating, setAiGenerating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  // Check login session (including localStorage mock fallback)
  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      const { data: realSession } = await authClient.useSession();
      if (realSession) {
        setSession(realSession);
      } else {
        const mock = localStorage.getItem("petzone_mock_session");
        if (mock) {
          setSession(JSON.parse(mock));
        } else {
          router.push("/login");
        }
      }
      setAuthChecking(false);
    };
    checkAuth();
  }, []);

  // Fetch products for listing
  const { data: productsData, refetch: refetchProducts } = useQuery({
    queryKey: ["dashboard-products"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/products", { params: { limit: 50 } });
      return res.data.products;
    },
    retry: 1,
    enabled: !authChecking
  });

  // Fetch Dashboard Stats
  const { data: statsData, isError: isStatsError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/dashboard/stats");
      return res.data;
    },
    retry: 1,
    enabled: !authChecking
  });

  // Local fallback calculations for charts (when backend is offline)
  const [localProducts, setLocalProducts] = useState(initialFallbackProducts);

  const calculateLocalStats = () => {
    const totalProducts = localProducts.length;
    const totalStock = localProducts.reduce((acc, p) => acc + Number(p.stock), 0);
    const totalReviews = localProducts.reduce((acc, p) => acc + (p.reviews?.length || 2), 0);
    
    // Category distribution
    const catMap = {};
    localProducts.forEach(p => {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    });
    const categoryStats = Object.entries(catMap).map(([name, value]) => ({ name, value }));

    // Pet type stats
    const petMap = { dog: 0, cat: 0, bird: 0, fish: 0, other: 0 };
    localProducts.forEach(p => {
      petMap[p.petType] = (petMap[p.petType] || 0) + 1;
    });
    const petTypeStats = [
      { name: "কুকুর", count: petMap.dog },
      { name: "বিড়াল", count: petMap.cat },
      { name: "পাখি", count: petMap.bird },
      { name: "মাছ", count: petMap.fish }
    ];

    return {
      metrics: { totalProducts, totalStock, totalReviews, avgRating: 4.7 },
      categoryStats,
      petTypeStats,
      recentProducts: localProducts.slice(0, 5)
    };
  };

  const dashboardStats = !isStatsError && statsData ? statsData : calculateLocalStats();
  const productsList = productsData || localProducts;

  // AI Description Generator Mutation
  const handleGenerateDescription = async () => {
    if (!name || !category || !petType) {
      setActionError("ডেসক্রিপশন জেনারেট করতে প্রথমে নাম, ক্যাটাগরি এবং প্রাণীর ধরন পূরণ করুন।");
      setTimeout(() => setActionError(""), 4000);
      return;
    }

    setAiGenerating(true);
    setActionError("");

    try {
      const response = await axios.post("http://localhost:5000/api/ai/generate-description", {
        name, category, petType, features
      });
      setDescription(response.data.description);
      setActionSuccess("এআই বিবরণটি সফলভাবে জেনারেট করেছে!");
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (error) {
      console.error("AI Description Error:", error);
      // Local Mock fallback description
      const mockText = `আমাদের প্রিমিয়াম মানের "${name}" পোষা প্রাণীদের (${petType === "dog" ? "কুকুর" : "বিড়াল"}) জন্য অত্যন্ত প্রয়োজনীয় একটি পণ্য। এটি আপনার পোষা প্রাণীর দৈনিক চাহিদা মেটাতে সহায়ক ভূমিকা পালন করবে। কোনো কৃত্রিম প্রিজারভেটিভ ছাড়া এটি সম্পূর্ণ নিরাপদভাবে প্রস্তুতকৃত।`;
      setDescription(mockText);
      setActionSuccess("এআই বিবরণটি জেনারেট করেছে (অফলাইন মোড)!");
      setTimeout(() => setActionSuccess(""), 4000);
    } finally {
      setAiGenerating(false);
    }
  };

  // Add Product Submit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setActionError("");
    setActionSuccess("");

    if (!name || !price || !brand || !description || !image) {
      setActionError("সবগুলো ফিল্ড পূরণ করা আবশ্যক।");
      return;
    }

    const payload = {
      name,
      category,
      petType,
      price: Number(price),
      stock: Number(stock) || 0,
      brand,
      description,
      image
    };

    try {
      await axios.post("http://localhost:5000/api/products", payload, {
        headers: { Authorization: `Bearer mock-token-abcde` }, // dummy auth
        withCredentials: true
      });

      // Refetch
      refetchProducts();
      setActionSuccess("প্রোডাক্টটি সফলভাবে ডাটাবেসে যোগ হয়েছে!");
      
      // Clear form
      setName("");
      setPrice("");
      setStock("");
      setBrand("");
      setDescription("");
      setImage("");
      setFeatures("");
    } catch (error) {
      console.warn("Express backend offline or error, adding locally instead.");
      
      // Save locally in mock memory list
      const newLocalProduct = {
        _id: `prod-${Date.now()}`,
        ...payload,
        rating: 5.0,
        reviews: []
      };
      const updatedLocalList = [newLocalProduct, ...localProducts];
      setLocalProducts(updatedLocalList);
      
      setActionSuccess("প্রোডাক্টটি ড্যাশবোর্ডে যোগ করা হয়েছে (লোকাল মক মোড)!");
      
      // Clear form
      setName("");
      setPrice("");
      setStock("");
      setBrand("");
      setDescription("");
      setImage("");
      setFeatures("");
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই প্রোডাক্টটি ডিলিট করতে চান?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        withCredentials: true
      });
      refetchProducts();
      setActionSuccess("প্রোডাক্টটি সফলভাবে ডিলিট করা হয়েছে।");
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (error) {
      console.warn("Backend offline, deleting locally.");
      const updatedList = localProducts.filter(p => p._id !== id);
      setLocalProducts(updatedList);
      setActionSuccess("প্রোডাক্টটি রিমুভ করা হয়েছে (লোকাল মক মোড)।");
      setTimeout(() => setActionSuccess(""), 4000);
    }
  };

  if (!mounted || authChecking) {
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
      {/* Header Admin Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
            অ্যাডমিন ড্যাশবোর্ড প্যানেল 
            {isStatsError && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                মক ডেটাবেস সচল
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500">স্বাগতম, <strong className="text-gray-900">{session?.user?.name}</strong>। পণ্য তালিকা, স্টক ট্র্যাকিং এবং এআই ডেসক্রিপশন জেনারেশন এখান থেকে ম্যানেজ করুন।</p>
        </div>
      </div>

      {/* Action Success / Error Notifications */}
      {actionSuccess && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-800 text-sm font-semibold rounded-2xl border border-emerald-100 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {actionSuccess}
        </div>
      )}
      {actionError && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-800 text-sm font-semibold rounded-2xl border border-red-100 animate-fade-in">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {actionError}
        </div>
      )}

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">মোট প্রোডাক্ট</p>
            <p className="text-2xl font-black text-gray-900">{dashboardStats.metrics.totalProducts}</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ইনভেন্টরি স্টক</p>
            <p className="text-2xl font-black text-gray-900">{dashboardStats.metrics.totalStock} টি</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">মোট রিভিউস</p>
            <p className="text-2xl font-black text-gray-900">{dashboardStats.metrics.totalReviews}</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-500">
            <Star className="h-6 w-6 fill-current" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">গড় রেটিং</p>
            <p className="text-2xl font-black text-gray-900">{dashboardStats.metrics.avgRating} / ৫</p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Pie Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-orange-500" />
            ক্যাটাগরি ভিত্তিক পণ্য অনুপাত
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardStats.categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dashboardStats.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pet Type Bar Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-4.5 w-4.5 text-emerald-500" />
            প্রাণীর ধরন অনুযায়ী প্রোডাক্ট ভলিউম
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardStats.petTypeStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Bottom Section: Add Product Form & Manage Products List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form: Add Product */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
            <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Plus className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">নতুন প্রোডাক্ট যুক্ত করুন</h2>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-4 text-xs sm:text-sm">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">প্রোডাক্টের নাম</label>
              <input
                type="text"
                required
                placeholder="Pedigree Kibbles 3kg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-orange-500"
              />
            </div>

            {/* Grid options */}
            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">ক্যাটাগরি</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-3 bg-white outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="খাবার">খাবার</option>
                  <option value="খেলনা">খেলনা</option>
                  <option value="এক্সেসরিজ">এক্সেসরিজ</option>
                  <option value="গ্রুমিং">গ্রুমিং</option>
                </select>
              </div>

              {/* Pet Type */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">পোষা প্রাণীর ধরন</label>
                <select
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-3 bg-white outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="dog">কুকুর (Dog)</option>
                  <option value="cat">বিড়াল (Cat)</option>
                  <option value="bird">পাখি (Bird)</option>
                  <option value="fish">মাছ (Fish)</option>
                  <option value="other">অন্যান্য</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">মূল্য (৳)</label>
                <input
                  type="number"
                  required
                  placeholder="1200"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-orange-500"
                />
              </div>

              {/* Stock */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">স্টক সংখ্যা</label>
                <input
                  type="number"
                  required
                  placeholder="30"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Brand & Image URL */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">ব্র্যান্ড</label>
                <input
                  type="text"
                  required
                  placeholder="Pedigree"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">ইমেজ ইউআরএল (URL)</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="https://example.com/image.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 pl-9 outline-none focus:border-orange-500"
                  />
                  <ImageIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* AI Generator Helper Input */}
            <div className="p-3 bg-orange-50 border border-orange-100 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  এআই বিবরণী অ্যাসিস্ট্যান্ট
                </span>
              </div>
              <input
                type="text"
                placeholder="অতিরিক্ত বৈশিষ্ট্য (যেমন: ওমেগা-৩ যুক্ত, অর্গানিক)"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full rounded-xl border border-gray-200/60 bg-white p-2.5 text-[11px] outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={aiGenerating || !name}
                className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 p-2 text-[11px] font-bold text-white shadow-sm flex items-center justify-center gap-1"
              >
                {aiGenerating ? "এআই লিখছে..." : "✨ Generate Description"}
              </button>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">প্রোডাক্টের বিবরণ</label>
              <textarea
                rows={3}
                required
                placeholder="প্রোডাক্টের বিস্তারিত বিবরণ এখানে লিখুন..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-orange-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-slate-900 hover:bg-orange-500 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition-colors"
            >
              যোগ করুন
            </button>
          </form>
        </div>

        {/* Table List: Manage Products */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">পণ্য তালিকা ও ব্যবস্থাপনা ({productsList.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-xs sm:text-sm">
              <thead>
                <tr className="text-left text-gray-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="pb-3">প্রোডাক্ট</th>
                  <th className="pb-3">ক্যাটাগরি</th>
                  <th className="pb-3">মূল্য</th>
                  <th className="pb-3 text-center">স্টক</th>
                  <th className="pb-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                {productsList.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 flex items-center gap-2 max-w-[180px]">
                      <img
                        src={prod.image}
                        alt=""
                        className="h-8 w-8 rounded-lg object-cover bg-gray-100 shrink-0"
                      />
                      <span className="truncate hover:text-orange-500 font-bold">
                        <Link href={`/products/${prod._id}`}>{prod.name}</Link>
                      </span>
                    </td>
                    <td className="py-3 capitalize text-gray-500">{prod.category}</td>
                    <td className="py-3 font-bold text-gray-900">৳ {prod.price}</td>
                    <td className="py-3 text-center font-bold text-gray-900">{prod.stock}</td>
                    <td className="py-3 text-right space-x-2 shrink-0">
                      <Link
                        href={`/products/${prod._id}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
