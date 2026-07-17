"use client";

import { Heart, Users, Target, Award, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "ডা. হাসান চৌধুরী",
      role: "প্রধান পশু চিকিৎসক ও পরামর্শক",
      bio: "পোষা প্রাণীর স্বাস্থ্য ও পুষ্টি নিয়ে ১৫ বছরের অভিজ্ঞতা সম্পন্ন বিশেষজ্ঞ চিকিৎসক।",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150"
    },
    {
      name: "রাফিদ আহমেদ",
      role: "প্রতিষ্ঠাতা ও এআই প্রোডাক্ট লিড",
      bio: "পেট লাভার এবং এআই টেকনোলজি ডেভেলপমেন্টে ৬ বছরের অভিজ্ঞ প্রযুক্তিবিদ।",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    {
      name: "আনিকা কবির",
      role: "গ্রাহক সেবা ও অপারেশনস প্রধান",
      bio: "পোষা প্রাণীদের সঠিক খাদ্য এবং আনুষঙ্গিক এক্সেসরিজ সাপ্লাই চেইনের দায়িত্বপ্রাপ্ত কর্মকর্তা।",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full space-y-16">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block">আমাদের গল্প</span>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
          পোষা প্রাণীর যত্নে প্রযুক্তি ও ভালোবাসার মেলবন্ধন
        </h1>
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
          PetZone AI প্রথম আত্মপ্রকাশ করে এমন একটি লক্ষ্য নিয়ে, যেখানে প্রতিটি পেট ওনার যেন সহজে ও ঘরে বসেই এআই প্রযুক্তির সাহায্যে পোষা প্রাণীর নিখুঁত ও সেরা যত্ন নিশ্চিত করতে পারেন।
        </p>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
        <div className="space-y-1">
          <p className="text-3xl sm:text-4xl font-black text-orange-500">১০,০০০+</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">সন্তুষ্ট পেট ওনার্স</p>
        </div>
        <div className="space-y-1 border-l border-gray-100">
          <p className="text-3xl sm:text-4xl font-black text-emerald-500">৫০,০০০+</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">জেনারেটেড এআই সাজেশন্স</p>
        </div>
        <div className="space-y-1 border-l border-gray-100">
          <p className="text-3xl sm:text-4xl font-black text-orange-500">১২০+</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">প্রিমিয়াম পেট প্রোডাক্টস</p>
        </div>
        <div className="space-y-1 border-l border-gray-100">
          <p className="text-3xl sm:text-4xl font-black text-emerald-500">২৪/৭</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">এআই হেল্পলাইন সার্ভিস</p>
        </div>
      </section>

      {/* Story & Vision Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
          <img
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600"
            alt="Pets playing together representing love and care"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="h-6 w-6 text-orange-500" />
              আমাদের পথচলা
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              ২০২৪ সালে আমরা যাত্রা শুরু করি যখন বুঝতে পারি আমাদের দেশে পোষা প্রাণীদের জন্য মানসম্পন্ন পণ্য এবং নির্ভরযোগ্য চিকিৎসার পরামর্শ পাওয়ার সুযোগ অনেক সীমিত। আমরা সিদ্ধান্ত নিই এমন একটি ওয়ান-স্টপ সল্যুশন তৈরি করার, যেখানে শপিং ক্যাটালগের পাশাপাশি একটি বিশেষজ্ঞ এআই ২৪ ঘণ্টা পরামর্শ দিতে রেডি থাকবে।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-500" />
                আমাদের মিশন
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                প্রতিটি ঘরে পোষা প্রাণীদের জন্য ১০০% অরজিনাল খাবার ও সামগ্রী সাশ্রয়ী মূল্যে পৌঁছে দেওয়া এবং এআই প্রযুক্তির সাহায্যে সাধারণ রোগের ঘরোয়া পরামর্শ সবার জন্য উন্মুক্ত করা।
              </p>
            </div>
            <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Heart className="h-5 w-5 text-orange-500" />
                আমাদের ভিশন
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                বাংলাদেশ তথা দক্ষিণ এশিয়ার সবচেয়ে বিশ্বস্ত ও বড় স্মার্ট ই-কমার্স পেট কেয়ার নেটওয়ার্ক গড়ে তোলা, যেখানে প্রতিটি পোষা প্রাণী সেরা যত্ন পাবে।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900">আমাদের মূল নীতিসমূহ</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">এই ৪টি আদর্শের ওপর ভিত্তি করেই আমাদের পুরো টিম কাজ পরিচালনা করে থাকে।</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "১০০% বিশ্বস্ততা", desc: "আমরা শুধু অরিজিনাল ও চিকিৎসকদের ভেরিফাইড প্রোডাক্ট আমদানী ও ক্যাটালগে তালিকাভুক্ত করি।" },
            { title: "গ্রাহক সন্তুষ্টি", desc: "আমাদের কাছে কাস্টমার এবং তাদের পোষা প্রাণীদের খুশি রাখাই দিনের প্রথম ও প্রধান কাজ।" },
            { title: "ইনোভেশন ও টেক", desc: "জেমিনি এআই ব্যবহারের মাধ্যমে পেট কেয়ার টিপস ও নেভিগেশন আরও ইন্টারঅ্যাক্টিভ করা।" },
            { title: "সমাজ সেবা", desc: "আমরা লভ্যাংশের একটি অংশ বেওয়ারিশ ও সুবিধাবঞ্চিত প্রাণীদের পুনর্বাসনের কাজে ব্যয় করি।" }
          ].map((val, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900">{val.title}</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Members */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Users className="h-6 w-6 text-orange-500" />
            আমাদের টিম মেম্বারস
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">আপনার আদরের প্রাণীর সেবা নিশ্চিত করতে নিরলসভাবে কাজ করে যাচ্ছে আমাদের টিম।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center space-y-4 hover:shadow-lg transition-all duration-300">
              <img
                src={member.image}
                alt={member.name}
                className="h-24 w-24 rounded-full mx-auto object-cover border-4 border-orange-50 shadow-md"
              />
              <div>
                <h3 className="text-base font-bold text-gray-900">{member.name}</h3>
                <p className="text-xs text-emerald-600 font-bold mt-0.5">{member.role}</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
