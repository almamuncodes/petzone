import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { message, history } = await request.json();
    if (!message) {
      return NextResponse.json({ error: "কোনো মেসেজ দেওয়া হয়নি" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    // কনভারসেশন হিস্ট্রি এবং নতুন মেসেজ দিয়ে প্রম্পট তৈরি
    let prompt = `You are PetZone AI Assistant, a friendly, expert pet care assistant. 
Help the user with pet care tips, training advice, health advice, food selection, or site navigation.
Keep your answers engaging, warm, helpful, and concise (ideally within 3-5 sentences unless they ask for a detailed explanation).
Always respond in Bengali (বাংলা) unless they ask you in English.

`;

    if (history && Array.isArray(history) && history.length > 0) {
      prompt += "Here is the conversation history so far for context:\n";
      history.forEach(msg => {
        const role = msg.role === "user" ? "User" : "AI Assistant";
        prompt += `${role}: ${msg.content || msg.message || ""}\n`;
      });
      prompt += "\n";
    }

    prompt += `User's new message: ${message}
AI Assistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "চ্যাট অ্যাসিস্ট্যান্ট কাজ করছে না: " + error.message }, { status: 500 });
  }
}
