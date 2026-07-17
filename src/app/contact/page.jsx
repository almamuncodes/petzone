"use client";

import { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Navigation 
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full space-y-12">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block">যোগাযোগ করুন</span>
        <h1 className="text-4xl font-black text-gray-900 leading-tight">
          যেকোনো প্রয়োজনে আমরা আছি আপনার পাশে
        </h1>
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
          আপনার পোষা প্রাণীর যত্ন সংক্রান্ত প্রশ্ন বা ক্যাটালগের কোনো পণ্য অর্ডার করতে কোনো সমস্যা হচ্ছে? সরাসরি আমাদের মেসেজ পাঠান অথবা ফোন করুন।
        </p>
      </section>

      {/* Grid: Form and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
            <h2 className="text-lg font-bold text-gray-900">যোগাযোগের তথ্য</h2>

            <div className="space-y-6">
              {/* Item 1 */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">অফিসের ঠিকানা</h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                    হাউজ নং ৪৫, রোড নং ১২, বনানী মডেল টাউন,<br />
                    ঢাকা ১২১৩, বাংলাদেশ।
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">হেল্পলাইন নম্বর</h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                    +৮৮০ ১৭৯৯ ৯৯৯ ৯৯৯<br />
                    +৮৮০ ১৮১২ ৩৪৫ ৬৭৮
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">ইমেইল এড্রেস</h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                    support@petzoneai.com<br />
                    info@petzoneai.com
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">অফিস সময়সূচী</h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                    শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - রাত ৮:০০<br />
                    শুক্রবার: বন্ধ (অনলাইন ডেলিভারি সচল)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900">মেসেজ পাঠান</h2>
            
            {isSuccess && (
              <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-800 text-sm font-semibold rounded-2xl border border-emerald-100 animate-fade-in">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                আপনার মেসেজটি সফলভাবে পাঠানো হয়েছে! আমাদের কাস্টমার রিলেশনস টিম খুব শীঘ্রই যোগাযোগ করবে।
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">আপনার নাম</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="নাম লিখুন"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 p-3.5 text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">আপনার ইমেইল</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="ইমেইল লিখুন"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 p-3.5 text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">বিষয়</label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="মেসেজের মূল বিষয়"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 p-3.5 text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">মেসেজের বিবরণ</label>
                <textarea
                  rows={4}
                  required
                  name="message"
                  placeholder="আপনার মেসেজটি এখানে বিস্তারিত লিখুন..."
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 p-4 text-xs sm:text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-100 hover:shadow-lg transition-all"
              >
                {isSubmitting ? "পাঠানো হচ্ছে..." : (
                  <>
                    পাঠিয়ে দিন
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mock Google Map Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Navigation className="h-5 w-5 text-orange-500" />
            গুগল ম্যাপে আমাদের অবস্থান
          </h2>
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">বনানী জোন, ঢাকা</span>
        </div>

        {/* CSS Mock Map Panel */}
        <div className="relative w-full h-[350px] rounded-3xl bg-sky-100/50 border border-sky-100 overflow-hidden shadow-sm flex items-center justify-center">
          {/* Map Grid Roads representation */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:24px_24px]"></div>
          
          {/* Mock Roads */}
          <div className="absolute inset-x-0 h-10 bg-white/60 top-1/4 transform rotate-1 border-y border-gray-200"></div>
          <div className="absolute inset-x-0 h-14 bg-white/60 bottom-1/3 transform -rotate-2 border-y border-gray-200"></div>
          <div className="absolute inset-y-0 w-12 bg-white/60 left-1/3 transform rotate-6 border-x border-gray-200"></div>
          <div className="absolute inset-y-0 w-16 bg-white/60 right-1/4 transform -rotate-12 border-x border-gray-200"></div>

          {/* Map Parks */}
          <div className="absolute top-10 left-10 w-36 h-24 bg-emerald-100/80 rounded-2xl border border-emerald-200 flex items-center justify-center text-[10px] text-emerald-800 font-bold uppercase tracking-wider">বনানী লেক পার্ক</div>
          <div className="absolute bottom-6 right-12 w-48 h-20 bg-emerald-100/80 rounded-2xl border border-emerald-200 flex items-center justify-center text-[10px] text-emerald-800 font-bold uppercase tracking-wider">বনানী খেলার মাঠ</div>

          {/* Location Pin */}
          <div className="relative z-10 flex flex-col items-center animate-bounce duration-1000">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg border-4 border-white">
              <MapPin className="h-6 w-6" />
            </div>
            <div className="mt-2 bg-slate-900/90 text-white backdrop-blur-xs px-3.5 py-1.5 rounded-xl shadow-md border border-slate-700 text-center">
              <p className="text-xs font-bold">PetZone AI Headquarters</p>
              <p className="text-[9px] text-gray-400 mt-0.5">বনানী রোড নং ১২, ঢাকা</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
