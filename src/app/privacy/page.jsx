"use client";

import { Shield, Lock, Eye, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 w-full space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
          <Shield className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">প্রাইভেসি পলিসি (Privacy Policy)</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">PetZone AI গ্রাহক সুরক্ষা নির্দেশিকা</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-sm text-gray-600 leading-relaxed">
        <p>
          PetZone AI-তে আমরা আপনার এবং আপনার পোষা প্রাণীর তথ্যের গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ। আমাদের প্ল্যাটফর্ম ব্যবহার করার সময় আমরা কীভাবে আপনার ব্যক্তিগত ডেটা সংগ্রহ ও ব্যবহার করি, তা এই প্রাইভেসি পলিসিতে ব্যাখ্যা করা হলো।
        </p>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Lock className="h-4.5 w-4.5 text-orange-500" />
            ১. কি কি তথ্য আমরা সংগ্রহ করি?
          </h3>
          <p>
            আমরা যখন আপনি অ্যাকাউন্টে রেজিস্ট্রেশন করেন, তখন আপনার নাম, ইমেইল এড্রেস এবং যোগাযোগের নম্বর সংগ্রহ করি। এছাড়া এআই চ্যাট অ্যাসিস্ট্যান্ট ব্যবহারের সময় পেট কেয়ার সংক্রান্ত প্রশ্নাবলী ও প্রডাক্ট রিকমেন্ডেশনের রেকর্ড সিস্টেমে সেভ রাখা হয় যেন পরবর্তীতে উন্নত সেবা নিশ্চিত করা যায়।
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Eye className="h-4.5 w-4.5 text-emerald-500" />
            ২. আপনার ডেটা কীভাবে সুরক্ষিত থাকে?
          </h3>
          <p>
            আপনার সব তথ্য নিরাপদ ডেটাবেস সার্ভারে এনক্রিপ্ট করে সংরক্ষণ করা হয়। কোনো প্রকার থার্ড-পার্টি বা মার্কেটিং এজেন্সির কাছে আপনার ব্যক্তিগত তথ্য বিক্রি বা শেয়ার করা হয় না। এআই মডেল প্রক্রিয়াকরণের জন্য গুগলের নিরাপদ এপিআই স্ট্রাকচার ব্যবহার করা হয়।
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-blue-500" />
            ৩. আপনার অধিকারসমূহ
          </h3>
          <p>
            আপনি চাইলে যেকোনো সময় আপনার ড্যাশবোর্ড প্রোফাইল এডিট করতে পারবেন অথবা আমাদের সাপোর্ট ইমেইলে যোগাযোগ করে আপনার চ্যাট হিস্ট্রি ও অ্যাকাউন্ট চিরতরে ডিলিট করার অনুরোধ জানাতে পারবেন।
          </p>
        </div>

        <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <p>সর্বশেষ আপডেট: ১৭ জুলাই, ২০২৬</p>
          <p>PetZone AI লিগ্যাল টিম</p>
        </div>
      </div>
    </div>
  );
}
