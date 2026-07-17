import { GoogleGenerativeAI } from "@google/generative-ai";
import Product from "../models/Product.js";
import AIHistory from "../models/AIHistory.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

let genAI = null;
if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  } catch (error) {
    console.error("Gemini SDK Init error:", error);
  }
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY is not defined. The system will fall back to mock AI responses.");
}

// Helper to save AI history
const saveAIHistory = async (userId, type, input, output) => {
  try {
    const history = new AIHistory({
      userId,
      type,
      input,
      output
    });
    await history.save();
  } catch (error) {
    console.error("Failed to save AI history:", error);
  }
};

// @desc    Generate product description using Gemini AI
// @route   POST /api/ai/generate-description
export const generateDescription = async (req, res) => {
  try {
    const { name, category, petType, features = "" } = req.body;

    if (!name || !category || !petType) {
      return res.status(400).json({ error: "প্রোডাক্টের নাম, ক্যাটাগরি এবং পেট টাইপ আবশ্যক।" });
    }

    const prompt = `Generate a premium, professional e-commerce product description in Bengali (বাংলা) for a pet product.
    Name: ${name}
    Category: ${category}
    Pet Type: ${petType}
    Features: ${features}
    
    Make it look appealing, high-quality, and detailed. Do not include any markdown headings (e.g. # or ##), keep it as readable paragraph formatting suitable for a shop site. Max 150 words.`;

    let descriptionText = "";

    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      descriptionText = result.response.text().trim();
    } else {
      // Mock Fallback
      descriptionText = `আমাদের প্রিমিয়াম কোয়ালিটির "${name}" পোষা প্রাণীদের (${petType}) জন্য বিশেষভাবে তৈরি। এটি একটি অত্যন্ত পুষ্টিকর ও সুস্বাদু খাবার/পণ্য যা আপনার আদরের প্রাণীর রোগ প্রতিরোধ ক্ষমতা বাড়াতে সাহায্য করে। এর উন্নত ফর্মুলা প্রাণীর লোম সুন্দর রাখে ও হজমে সহায়তা করে। যেকোনো বয়সী পোষা প্রাণীর নিয়মিত ব্যবহারের জন্য এটি অত্যন্ত নিরাপদ ও চিকিৎসকদের দ্বারা অনুমোদিত।${features ? ` এতে রয়েছে বিশেষ বৈশিষ্ট্যসমূহ: ${features}।` : ""}`;
    }

    // Save history
    await saveAIHistory(req.user?.id, "description", `Name: ${name}, Pet: ${petType}`, descriptionText);

    res.json({ description: descriptionText });
  } catch (error) {
    console.error("Error in generateDescription:", error);
    res.status(500).json({ error: "সার্ভার এরর! এআই ডেসক্রিপশন জেনারেট করা যায়নি।" });
  }
};

// @desc    Analyze product and recommend accessories/tips
// @route   POST /api/ai/recommend
export const recommendProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "প্রোডাক্ট আইডি আবশ্যক।" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "প্রোডাক্টটি খুঁজে পাওয়া যায়নি।" });
    }

    const prompt = `You are a pet care expert and sales recommendation engine. 
    Analyze this product and generate standard recommendations:
    Product Name: ${product.name}
    Category: ${product.category}
    Pet Type: ${product.petType}
    Description: ${product.description}
    
    Return a structured JSON object containing:
    1. "explanation": A short 2-sentence explanation of why these items are recommended for this product.
    2. "accessories": An array of 2 items, each with "name" and "reason" (why they pair well together, e.g. feeding bowls, vitamin supplements, toys).
    3. "tips": An array of 2 practical pet care/safety tips related to this product type.
    
    CRITICAL: Output ONLY valid JSON. Your response must start with '{' and end with '}'. Do not wrap the JSON in markdown formatting or code blocks. All text inside JSON must be in Bengali (বাংলা).`;

    let recommendationData = null;

    if (genAI) {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      try {
        recommendationData = JSON.parse(text);
      } catch (err) {
        console.error("Failed to parse Gemini JSON:", text);
      }
    }

    // Default mock or fallback if JSON parse fails or GenAI is disabled
    if (!recommendationData) {
      if (product.petType === "dog") {
        recommendationData = {
          explanation: `এই ডগ প্রোডাক্টটি (${product.name}) আপনার কুকুরের শক্তি বৃদ্ধি ও সুস্বাস্থ্যের জন্য অত্যন্ত উপযোগী। এটি কুকুরের পেশী গঠন ও হজম প্রক্রিয়া ঠিক রাখতে সাহায্য করে।`,
          accessories: [
            { name: "নন-স্লিপ ফুড বোল (Food Bowl)", reason: "কুকুরের স্বাচ্ছন্দ্যে খাওয়ার জন্য এবং খাবার পড়ে অপচয় হওয়া রোধ করতে এটি দরকার।" },
            { name: "মাল্টিভিটামিন সাপ্লিমেন্ট", reason: "হাড় মজবুত ও শরীরের রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে প্রিমিয়াম সাপ্লিমেন্ট জোড়া হিসেবে ভালো কাজ করে।" }
          ],
          tips: [
            "খাবারটি সরাসরি রোদে না রেখে শুষ্ক ও ঠান্ডা স্থানে সংরক্ষণ করুন।",
            "কুকুরকে প্রতিদিন পর্যাপ্ত পরিষ্কার ও বিশুদ্ধ খাবার পানি পান করান।"
          ]
        };
      } else if (product.petType === "cat") {
        recommendationData = {
          explanation: `বিড়ালের স্বভাবজাত চঞ্চলতা ও মানসিক বিকাশের জন্য এই পণ্যটি (${product.name}) অত্যন্ত উপযোগী। এটি বিড়ালের অলসতা দূর করতে সাহায্য করে।`,
          accessories: [
            { name: "ক্যাটনিপ টয় (Catnip Toy)", reason: "বিড়ালের একাকীত্ব দূর করতে ও আনন্দের সাথে খেলাধুলা করার জন্য অত্যন্ত চমৎকার।" },
            { name: "গ্রুমিং ব্রাশ (Grooming Brush)", reason: "লোম পড়া কমাতে এবং গায়ের মরা চামড়া পরিষ্কার করতে এটি নিয়মিত ব্যবহার করা উচিত।" }
          ],
          tips: [
            "বিড়ালের মানসিক অবসাদ এড়াতে প্রতিদিন অন্তত ১০-১৫ মিনিট তার সাথে খেলুন।",
            "খাবারের থালা নিয়মিত কুসুম গরম পানি দিয়ে ধুয়ে পরিষ্কার রাখুন।"
          ]
        };
      } else {
        recommendationData = {
          explanation: `এই পণ্যটি (${product.name}) আপনার আদরের পোষা প্রাণীর স্বাভাবিক বৃদ্ধি ও সুস্থ পরিবেশ নিশ্চিত করতে ডিজাইন করা হয়েছে।`,
          accessories: [
            { name: "অটোমেটিক ওয়াটার ডিসপেনসার", reason: "পোষা প্রাণীর খাঁচা বা ঘরে সার্বক্ষণিক বিশুদ্ধ পানির প্রবাহ সচল রাখতে এটি দারুন সাহায্য করে।" },
            { name: "ভিটামিন ড্রপস", reason: "প্রাণীর রোগ প্রতিরোধ ক্ষমতা সচল ও লোম/পালক উজ্জ্বল রাখতে অত্যন্ত কার্যকরী।" }
          ],
          tips: [
            "পোষা প্রাণীর খাঁচা বা থাকার জায়গাটি সপ্তাহে অন্তত একবার ভালোমতো জীবাণুমুক্ত করুন।",
            "যেকোনো অস্বাভাবিক আচরণ বা লক্ষণ দেখলে অবিলম্বে একজন পশু চিকিৎসকের পরামর্শ নিন।"
          ]
        };
      }
    }

    // Save history
    await saveAIHistory(req.user?.id, "recommendation", `Product: ${product.name}`, JSON.stringify(recommendationData));

    res.json(recommendationData);
  } catch (error) {
    console.error("Error in recommendProduct:", error);
    res.status(500).json({ error: "সার্ভার এরর! এআই রিকমেন্ডেশন তৈরি করা যায়নি।" });
  }
};

// @desc    Global AI Chat assistant
// @route   POST /api/ai/chat
export const chatAssistant = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "বার্তা বা প্রম্পট ফালি রাখা যাবে না।" });
    }

    const systemInstruction = `You are PetZone AI, an expert pet care consultant and helpful virtual store guide.
    Your traits:
    - You answer pet health, food suggestions, shopping tips, safety precautions, and general advice.
    - If the user asks about website navigation, help them with this layout:
      * Home Page (হোম পেজ): Features, reviews, categories.
      * Products Catalog (পণ্যসমূহ): Browse, search, filter, and buy products.
      * About Page (আমাদের সম্পর্কে): Our history, mission, and team.
      * Contact Page (যোগাযোগ): Contact form, phone, location map.
      * Dashboard (ড্যাশবোর্ড): Track inventory, add, edit, or delete items.
    - Keep your responses friendly, professional, and clear.
    - CRITICAL: Always respond in Bengali (বাংলা).
    - Limit responses to max 120 words unless they ask for a detailed guide.`;

    let reply = "";

    if (genAI) {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: systemInstruction
      });

      // Format history for Gemini API
      // Gemini expects format [{ role: 'user' | 'model', parts: [{ text: '...' }] }]
      const formattedHistory = history.map(h => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }]
      }));

      const chat = model.startChat({
        history: formattedHistory
      });

      const result = await chat.sendMessage(message);
      reply = result.response.text().trim();
    } else {
      // Mock chat replies in Bengali based on keywords
      const msg = message.toLowerCase();
      if (msg.includes("খাবার") || msg.includes("food") || msg.includes("খাদ্য")) {
        reply = "পোষা প্রাণীর সঠিক পুষ্টির জন্য সুষম খাবার নির্বাচন করা জরুরি। বিড়ালের জন্য ওমেগা-৩ ও প্রোটিন সমৃদ্ধ ড্রাই ক্যাট ফুড এবং কুকুরের জন্য চাল-চিকেনের মিশ্রণ বা স্পেশাল ডগ কেয়ার ফুড ভালো। আপনার পোষা প্রাণীর বয়স কত এবং সেটি কী প্রজাতির?";
      } else if (msg.includes("অসুখ") || msg.includes("জ্বর") || msg.includes("রোগ") || msg.includes("sick")) {
        reply = "পোষা প্রাণী অসুস্থ হলে অলস বসে থাকা, খাবার কম খাওয়া বা ঘন ঘন বমি করা ইত্যাদি উপসর্গ দেখা যায়। এআই দিয়ে চিকিৎসা করা নিরাপদ নয়, দয়া করে দ্রুত কোনো পশু চিকিৎসক বা ভেটেরিনারি ক্লিনিকে যোগাযোগ করুন। আমরা সাধারণ পরামর্শ দিতে পারি মাত্র।";
      } else if (msg.includes("ড্যাশবোর্ড") || msg.includes("dashboard") || msg.includes("যোগ") || msg.includes("add")) {
        reply = "আপনি যদি অ্যাডমিন হন, তবে আমাদের ড্যাশবোর্ড পেজে গিয়ে নতুন প্রোডাক্ট অ্যাড করতে পারবেন এবং সেখানে এআই দিয়ে অটোমেটিক ডেসক্রিপশনও জেনারেট করে নিতে পারবেন! ড্যাশবোর্ডে যেতে উপরে ন্যাভবারের ড্যাশবোর্ড লিংকে ক্লিক করুন।";
      } else if (msg.includes("products") || msg.includes("পণ্য") || msg.includes("catalog")) {
        reply = "আমাদের 'পণ্যসমূহ' পেজে আপনি কুকুর, বিড়াল, পাখি এবং মাছের সব রকমের প্রিমিয়াম খাবার, খেলনা এবং আনুষঙ্গিক জিনিসপত্র পাবেন। পেজটিতে সার্চ ও ফিল্টার করার সুবিধা রয়েছে।";
      } else {
        reply = "হ্যালো! আমি PetZone AI চ্যাট অ্যাসিস্ট্যান্ট। আমি পোষা প্রাণীর যত্ন, খাবার পরামর্শ, এবং আমাদের ওয়েবসাইটের যেকোনো তথ্য দিয়ে আপনাকে সাহায্য করতে প্রস্তুত। আপনার পেট সম্পর্কে কিছু জিজ্ঞাসা করতে পারেন!";
      }
    }

    // Save history
    await saveAIHistory(req.user?.id, "chat", message, reply);

    res.json({ reply });
  } catch (error) {
    console.error("Error in chatAssistant:", error);
    res.status(500).json({ error: "সার্ভার এরর! এআই বার্তা প্রসেস করতে ব্যর্থ হয়েছে।" });
  }
};
