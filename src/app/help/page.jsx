"use client";

import { HelpCircle, FileText, ShoppingCart, ShieldAlert } from "lucide-react";

export default function HelpPage() {
  const guides = [
    {
      title: "অর্ডার ট্র্যাকিং ও পেমেন্ট",
      icon: <ShoppingCart className="h-6 w-6 text-orange-500" />,
      desc: "অর্ডার করার পর আপনার ঠিকানায় ক্যাশ অন ডেলিভারি অথবা বিকাশ/রকেটের মাধ্যমে কীভাবে পেমেন্ট করবেন এবং অর্ডার ট্র্যাক করবেন।"
    },
    {
      title: "এআই রিকমেন্ডেশনের সঠিক ব্যবহার",
      icon: <HelpCircle className="h-6 w-6 text-emerald-500" />,
      desc: "প্রোডাক্ট ডিটেইলস পেজের এআই বাটনে ক্লিক করে সঠিক এক্সেসরিজ সাজেশন এবং পোষা প্রাণীর যত্ন নেওয়ার নির্দেশিকা পাওয়ার গাইড।"
    },
    {
      title: "রিটার্ন এবং রিফান্ড পলিসি",
      icon: <ShieldAlert className="h-6 w-6 text-blue-500" />,
      desc: "যেকোনো ভুল বা ক্ষতিগ্রস্ত প্রোডাক্ট ডেলিভারি পেলে ২৪ ঘণ্টার মধ্যে ফ্রিতে বদল করা বা মানি ব্যাক রিফান্ড পলিসি নিশ্চিত করা।"
    }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 w-full space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
          <HelpCircle className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">হেল্প সেন্টার (Help Center)</h1>
        <p className="text-gray-500 text-sm">আপনাকে যেকোনো সহায়তায় সাহায্য করতে আমরা সর্বদা প্রস্তুত।</p>
      </div>

      {/* Grid: Help cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guides.map((guide, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
              {guide.icon}
            </div>
            <h3 className="text-base font-bold text-gray-900">{guide.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{guide.desc}</p>
          </div>
        ))}
      </div>

      {/* Support Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-8 rounded-3xl text-center space-y-4">
        <h3 className="text-lg font-bold text-gray-900">আপনার সমস্যার সমাধান মেলেনি?</h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto">আমাদের কাস্টমার কেয়ার টিম ও পশু চিকিৎসকরা সরাসরি কথা বলতে রেডি আছেন। দয়া করে কন্ট্যাক্ট পেজের ফর্মে মেসেজ পাঠান অথবা ফোন করুন।</p>
        <div className="flex justify-center gap-4 text-xs font-bold pt-2">
          <a href="/contact" className="rounded-full bg-slate-900 hover:bg-orange-500 text-white px-5 py-2.5 shadow-sm transition-colors">যোগাযোগ পেজ</a>
          <a href="tel:+8801799999999" className="rounded-full bg-white border border-gray-200 text-gray-700 px-5 py-2.5 shadow-sm hover:bg-gray-50 transition-colors">কল করুন</a>
        </div>
      </div>
    </div>
  );
}
