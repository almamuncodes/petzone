import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import Category from "./models/Category.js";

dotenv.config({ path: "../.env" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/petzone";

const categories = [
  { name: "খাবার", slug: "food", image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300" },
  { name: "খেলনা", slug: "toys", image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=300" },
  { name: "এক্সেসরিজ", slug: "accessories", image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300" },
  { name: "গ্রুমিং", slug: "grooming", image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300" }
];

const products = [
  // DOGS
  {
    name: "প্রিমিয়াম ডগ ফুড - চিকেন ও রাইস ফ্লেভার",
    category: "খাবার",
    petType: "dog",
    price: 1250,
    stock: 35,
    brand: "Pedigree",
    description: "কুকুরছানাদের রোগ প্রতিরোধ ক্ষমতা ও হাড়ের বৃদ্ধির জন্য ওমেগা-৬ এবং দস্তা সমৃদ্ধ প্রিমিয়াম চিকেন ও রাইস ফ্লেভারের ড্রাই ডগ ফুড। এতে প্রোটিন ও ফাইবার রয়েছে যা হজমে দারুণ সাহায্য করে।",
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews: [
      { username: "আরিফ চৌধুরী", rating: 5, comment: "আমার ল্যাব্রাডরের এই খাবারটা খুব পছন্দ। ওর হজমের সমস্যা দূর হয়েছে।" },
      { username: "তাসনিম জাহান", rating: 4, comment: "খুবই ভালো কোয়ালিটি, লোম পড়া অনেকটাই কমেছে।" }
    ]
  },
  {
    name: "ডগ চিউ বোন ডেন্টাল টয়",
    category: "খেলনা",
    petType: "dog",
    price: 350,
    stock: 60,
    brand: "Kong",
    description: "কুকুরের দাঁত পরিষ্কার রাখার ও কামড়ানোর অভ্যাস ঠিক রাখার জন্য মজবুত ডেন্টাল চিউ বোন রাবার টয়। এটি খেলতে খেলতে দাঁতের ক্যালসিয়াম প্লেট পরিষ্কার করে ও মাড়ি সুস্থ রাখে।",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&auto=format&fit=crop&q=80",
    rating: 4.5,
    reviews: [
      { username: "নাবিলা রহমান", rating: 4, comment: "অনেক টেকসই খেলনা, সহজে কামড়ে ছিঁড়তে পারে না।" }
    ]
  },
  {
    name: "প্রিমিয়াম রিফ্লেক্টিভ ডগ হারনেস ও লিশ",
    category: "এক্সেসরিজ",
    petType: "dog",
    price: 950,
    stock: 15,
    brand: "Ruffwear",
    description: "রাতে হাঁটার জন্য লাইট-রিফ্লেক্টিভ স্ট্র্যাপ যুক্ত প্রিমিয়াম ডগ হারনেস ও লিশ সেট। এটি কুকুরের ঘাড়ে চাপ না ফেলে বডি কন্ট্রোল নিশ্চিত করে এবং সহজে পরানো যায়।",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviews: [
      { username: "ফয়সাল আহমেদ", rating: 5, comment: "অসাধারণ ডিজাইন। রাতের বেলা রিফ্লেক্টর থাকার কারণে কুকুরকে দূর থেকে দেখা যায়।" }
    ]
  },
  {
    name: "অর্গানিক অ্যালোভেরা ডগ শ্যাম্পু",
    category: "গ্রুমিং",
    petType: "dog",
    price: 680,
    stock: 22,
    brand: "Wahl",
    description: "প্যারাবেন ও অ্যালকোহল মুক্ত অ্যালোভেরা যুক্ত প্রাকৃতিক কন্ডিশনার ডগ শ্যাম্পু। এটি সংবেদনশীল ত্বকের চুলকানি দূর করে এবং লোম কোমল ও উজ্জ্বল রাখে।",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviews: [
      { username: "জেরিন ফাতেমা", rating: 4, comment: "শ্যাম্পুটার সুবাস খুব সুন্দর আর দীর্ঘস্থায়ী।" }
    ]
  },

  // CATS
  {
    name: "অর্গানিক টুনা ও সালমন ডিশ ক্যাট ক্যান",
    category: "খাবার",
    petType: "cat",
    price: 220,
    stock: 100,
    brand: "Whiskas",
    description: "সালমন ও টুনা মাছের গ্রেভি সমৃদ্ধ অত্যন্ত সুস্বাদু ভেজা ক্যাট ফুড ক্যান। এটি বিড়ালের শরীরে পানির ভারসাম্য রক্ষা করে ও প্রোটিনের ঘাটতি পূরণ করে।",
    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: [
      { username: "রিয়া সুলতানা", rating: 5, comment: "আমার পারসিয়ান বিড়াল সালমন ক্যান ছাড়া অন্য কিছুই খেতে চায় না!" },
      { username: "জুয়েল মাহমুদ", rating: 5, comment: "সেরা মূল্যে চমৎকার ভেজা খাবার।" }
    ]
  },
  {
    name: "ক্যাট স্ক্র্যাচিং পোস্ট ও ক্যাসেল টয়",
    category: "খেলনা",
    petType: "cat",
    price: 2450,
    stock: 8,
    brand: "Frisco",
    description: "বিড়ালের নখ ধারালো করার স্ক্র্যাচিং পোস্ট ও ঘুমানোর আরামদায়ক কুশন ক্যাসেল ডাবল লেভেল ট্রি। এটি আপনার সোফা বা দেয়াল নখের স্ক্র্যাচ থেকে মুক্ত রাখবে।",
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews: [
      { username: "সানজিদা আক্তার", rating: 5, comment: "অনেক বড় আর সুন্দর। আমার দুটি বিড়াল সারাদিন এটার ভেতরেই খেলে।" }
    ]
  },
  {
    name: "আর্গোনমিক ক্যাট ওয়াটার বোল",
    category: "এক্সেসরিজ",
    petType: "cat",
    price: 420,
    stock: 45,
    brand: "Catit",
    description: "বিড়ালের ঘাড়ে ব্যথা না হওয়ার জন্য ১৫ ডিগ্রি বাঁকানো এবং নন-স্লিপ সিরামিক ক্যাট ফিডিং ডিশ বোল। এটি বিড়ালের হুইস্কারের ঘষা এড়াতে চওড়া করে তৈরি।",
    image: "https://images.unsplash.com/photo-1615087240969-eeff2fa558f2?w=600&auto=format&fit=crop&q=80",
    rating: 4.4,
    reviews: [
      { username: "রাকিব হাসান", rating: 4, comment: "বোলটা বেশ ভারী, বিড়াল সহজে ওল্টাতে পারে না।" }
    ]
  },
  {
    name: "অ্যান্টি-ট্যাঙ্গেল ক্যাট হেয়ার ব্রুমিং কম্ব",
    category: "গ্রুমিং",
    petType: "cat",
    price: 280,
    stock: 50,
    brand: "Furminator",
    description: "বিড়ালের গায়ের আলগা লোম পরিষ্কারের জন্য ও জটিলতা কাটানোর স্টেইনলেস স্টিল সূক্ষ্ম দাঁতের হেয়ার গ্রুমিং চিরুনি। এটি নিয়মিত আঁচড়ালে ঘরে লোম ওড়া কমে যায়।",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviews: [
      { username: "নাবিলা হাসান", rating: 5, comment: "লোম আঁচড়ানোর জন্য খুব ভালো। বিড়ালও আরাম পায়।" }
    ]
  },

  // BIRDS
  {
    name: "মিক্সড সিডস অ্যান্ড ফ্রুটস বার্ড ফিড",
    category: "খাবার",
    petType: "bird",
    price: 350,
    stock: 50,
    brand: "ZuPreem",
    description: "বাজরিগার, লাভবার্ড এবং কোকাটেল পাখির জন্য সূর্যমুখী বীজ, চিনা, কাউন এবং শুকনো ফলের টুকরোর পুষ্টিকর মিক্সড বার্ড ফিড। এটি পাখির পালক উজ্জ্বল ও ডিমের খোসা মজবুত করতে সাহায্য করে।",
    image: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviews: [
      { username: "মশিউর রহমান", rating: 5, comment: "আমার লাভবার্ড জোড়া এই খাবারটা অনেক পছন্দ করেছে।" }
    ]
  },
  {
    name: "কালারফুল উডেন ল্যাডার অ্যান্ড সুইং ফর বার্ডস",
    category: "খেলনা",
    petType: "bird",
    price: 180,
    stock: 35,
    brand: "Prevue",
    description: "পাখির খাঁচায় ঝোলানোর জন্য নিরাপদ কাঠের তৈরি রঙ-বেরঙের দোলনা এবং মই সেট। এটি পাখির খাঁচাবন্দী অলসতা দূর করতে ও কসরত করতে সাহায্য করে।",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    rating: 4.5,
    reviews: [
      { username: "তাহসিন উল্লাহ", rating: 4, comment: "খাঁচায় ঝোলানোর পর পাখিগুলো সারাদিন মইয়ে চড়ে বেড়ায়।" }
    ]
  },

  // FISH
  {
    name: "গোল্ডফিশ অ্যান্ড ট্রপিকাল ফ্লেক ফুড",
    category: "খাবার",
    petType: "fish",
    price: 190,
    stock: 90,
    brand: "Tetra",
    description: "অ্যাকোয়ারিয়ামের সোনালী গোল্ডফিশ ও রঙিন ট্রপিকাল মাছের উজ্জ্বল রঙের জন্য বিশেষ পুষ্টিকর ড্রাই ফ্লেক ফুড। এটি পানি ঘোলা না করে মাছের সুস্বাস্থ্য নিশ্চিত করে।",
    image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews: [
      { username: "আশিক মাহমুদ", rating: 5, comment: "এই ফ্লেকটা দিলে পানি পরিষ্কার থাকে, গোল্ডফিশগুলোও বেশ চটপটে হয়েছে।" }
    ]
  },
  {
    name: "অ্যাকোয়ারিয়াম ডেকোরেটিভ এআই ক্যাসল",
    category: "এক্সেসরিজ",
    petType: "fish",
    price: 750,
    stock: 12,
    brand: "Penn-Plax",
    description: "মাছের লুকোচুরি খেলার এবং ডিম পাড়ার জন্য নিরাপদ রেজিন মেটেরিয়াল দিয়ে তৈরি অ্যাকোয়ারিয়ামের ভেতর সাজানোর ক্যাসল (দুর্গ) অরনামেন্ট। এটি ক্ষতিকারক কেমিক্যাল মুক্ত।",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviews: [
      { username: "মেহেদী হাসান", rating: 5, comment: "একুরিয়ামের সৌন্দর্য অনেক বেড়ে গিয়েছে। ছোট ছোট মাছগুলো এটার ভেতরে খেলা করে।" }
    ]
  }
];

const seedDB = async () => {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB database.");

    // Clear existing products and categories
    await Product.deleteMany({});
    console.log("Deleted all old products.");

    await Category.deleteMany({});
    console.log("Deleted all old categories.");

    // Insert categories
    const seededCategories = await Category.insertMany(categories);
    console.log(`Seeded ${seededCategories.length} categories.`);

    // Insert products
    const seededProducts = await Product.insertMany(products);
    console.log(`Seeded ${seededProducts.length} products.`);

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding error:", error);
    process.exit(1);
  }
};

seedDB();
