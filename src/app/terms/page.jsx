"use client";

import { FileText, Award, Scale, HelpCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 w-full space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
          <FileText className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">টার্মস অ্যান্ড কন্ডিশনস (Terms of Service)</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">PetZone AI ব্যবহারবিধি ও নিয়মাবলী</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-sm text-gray-600 leading-relaxed">
        <p>
          PetZone AI প্ল্যাটফর্মটি ব্যবহার করার জন্য আপনাকে স্বাগতম। এই সাইটটি ভিজিট বা এখান থেকে পেট প্রোডাক্ট অর্ডার করার আগে অনুগ্রহ করে ব্যবহারের শর্তাবলী ও নিয়মসমূহ মনোযোগ দিয়ে পড়ে নিন।
        </p>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Scale className="h-4.5 w-4.5 text-orange-500" />
            ১. ওয়েবসাইট ব্যবহার ও অ্যাকাউন্ট নিবন্ধন
          </h3>
          <p>
            আমাদের সাইটে কেনাকাটা বা ড্যাশবোর্ড সুবিধা ভোগ করতে আপনার সঠিক ইমেইল আইডি দিয়ে রেজিস্ট্রেশন করা উচিত। অবৈধ বা ফেক মেইল দিয়ে আইডি খোলে প্ল্যাটফর্ম অপব্যবহার করার চেষ্টা করলে আইনি ব্যবস্থা নেওয়ার অধিকার আমাদের রয়েছে।
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Award className="h-4.5 w-4.5 text-emerald-500" />
            ২. এআই চ্যাটবটের পরামর্শ ডিসক্লেমার
          </h3>
          <p>
            আমাদের ফ্লোটিং চ্যাট অ্যাসিস্ট্যান্ট শুধুমাত্র সাধারণ পেট কেয়ার ও খাবার সাজেশনের জন্য তৈরি। এটি কোনোভাবেই একজন রেজিস্টার্ড লাইসেন্সধারী ডক্টরের প্রেসক্রিপশনের বিকল্প নয়। আপনার পোষা প্রাণী গুরুতর অসুস্থ হলে তাৎক্ষণিক ডাক্তারের কাছে নিয়ে যান।
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="h-4.5 w-4.5 text-blue-500" />
            ৩. ডেলিভারি ও পেমেন্ট পলিসি
          </h3>
          <p>
            অর্ডার করার পর আমাদের কুরিয়ার টিম আপনার ঠিকানায় পণ্য পৌঁছে দেবে। কোনো ড্যামেজ বা ইনকারেক্ট প্রোডাক্ট ডেলিভারি পেলে ২৪ ঘণ্টার মধ্যে রিফান্ড বা রিপ্লেসমেন্ট ক্লেম করতে হবে।
          </p>
        </div>

        <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <p>সর্বশেষ আপডেট: ১৭ জুলাই, ২০২৬</p>
          <p>PetZone AI অপারেশনস টিম</p>
        </div>
      </div>
    </div>
  );
}
