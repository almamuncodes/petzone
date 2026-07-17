import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: "প্রোডাক্ট আইডি দেওয়া হয়নি" }, { status: 400 });
    }

    // ব্যাকএন্ড API থেকে প্রোডাক্টের বিবরণ নিয়ে আসা
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    let product = null;
    
    try {
      const productResponse = await fetch(`${backendUrl}/api/products/${productId}`);
      if (productResponse.ok) {
        const productData = await productResponse.json();
        if (productData.success && productData.data) {
          product = productData.data;
        }
      }
    } catch (fetchError) {
      console.error("Error fetching product details from backend:", fetchError.message);
    }

    // জেমিনি ৩.১ ফ্ল্যাশ লাইট মডেল এবং JSON আউটপুট কনফিগারেশন
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.1-flash-lite",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are a professional pet care assistant. Analyze this pet product:
Product Name: ${product ? product.name : "Unknown Product"}
Category: ${product ? product.category : "Pet Shop"}
Description: ${product ? product.description : "No description available"}

Provide the recommendation details in Bengali (বাংলা) as a JSON object with this exact structure:
{
  "explanation": "A warm, engaging explanation (2-3 sentences) in Bengali about why this product is useful and how it helps the pet.",
  "accessories": [
    {
      "name": "Name of a companion or matching accessory product that would go well with this product",
      "reason": "Brief explanation in Bengali of why this accessory is helpful"
    },
    {
      "name": "Another matching accessory name",
      "reason": "Why it is helpful"
    }
  ],
  "tips": [
    "Specific care tip 1 in Bengali",
    "Specific care tip 2 in Bengali",
    "Specific care tip 3 in Bengali"
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let aiData;
    try {
      aiData = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON output:", parseError, text);
      aiData = {
        explanation: "পণ্যটির জন্য এআই বিশ্লেষণ করা যায়নি।",
        accessories: [],
        tips: ["পণ্যটি ব্যবহারের সময় পোষা প্রাণীর যত্ন নিন।"]
      };
    }

    return NextResponse.json(aiData);
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return NextResponse.json({ error: "AI কাজ করছে না: " + error.message }, { status: 500 });
  }
}