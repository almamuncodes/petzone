"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  PawPrint,
  CornerDownLeft
} from "lucide-react";

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "model",
      content: "হ্যালো! আমি PetZone AI অ্যাসিস্ট্যান্ট। আপনার পোষা প্রাণীর যত্ন, রোগবালাই, আদর্শ খাবার অথবা আমাদের সাইট নেভিগেশনের যেকোনো বিষয় নিয়ে আমি আপনাকে সাহায্য করতে পারি। আজ আপনাকে কীভাবে সাহায্য করতে পারি?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    "কুকুরছানার সুষম খাদ্য কী?",
    "বিড়ালের অলসতা দূর করার উপায়?",
    "খাঁচার পাখির যত্নে কী করা উচিত?",
    "ড্যাশবোর্ড পেজটি কোথায় পাব?"
  ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || message;
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    if (!textToSend) setMessage("");
    setIsLoading(true);

    try {
      // Map frontend history format to backend history format
      const historyPayload = newMessages.slice(1, -1); // Exclude initial welcome and current message

      const response = await axios.post("http://localhost:5000/api/ai/chat", {
        message: text,
        history: historyPayload
      }, {
        withCredentials: true
      });

      setMessages(prev => [...prev, { role: "model", content: response.data.reply }]);
    } catch (error) {
      console.error("AI Chat error:", error);
      // Friendly offline fallback response
      setMessages(prev => [...prev, { 
        role: "model", 
        content: "দুঃখিত, এআই অ্যাসিস্ট্যান্ট সার্ভারের সাথে সংযোগ করতে পারছে না। অনুগ্রহ করে নিশ্চিত করুন যে আপনার ব্যাকএন্ড সার্ভারটি (Port 5000) সচল আছে।" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] sm:h-[600px] bg-white rounded-3xl border border-gray-100 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-inner">
                <PawPrint className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wide flex items-center gap-1.5">
                  PetZone AI
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </h3>
                <p className="text-[10px] text-emerald-400 font-semibold tracking-widest">পেট কেয়ার অ্যাসিস্ট্যান্ট</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white rounded-lg p-1.5 hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {msg.role !== "user" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div 
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "user" 
                      ? "bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-tr-none" 
                      : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 shrink-0">
                  <Sparkles className="h-4 w-4 animate-spin" />
                </div>
                <div className="p-3.5 bg-white text-gray-400 rounded-2xl rounded-tl-none border border-gray-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-gray-50 bg-white">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">সাজেস্টেড প্রশ্নসমূহ:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-xs text-gray-600 bg-gray-50 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 px-3 py-1.5 rounded-full transition-all duration-200 text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
            <textarea
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="বার্তা লিখুন..."
              className="flex-1 resize-none rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 max-h-20"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !message.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-300 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        id="ai-chat-button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300 relative group focus:outline-none"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageSquare className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          </>
        )}
      </button>
    </div>
  );
}
