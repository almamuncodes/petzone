import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatWidget from "@/components/AIChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PetZone AI - প্রিমিয়াম পেট কেয়ার ও শপিং প্ল্যাটফর্ম",
  description: "এআই চালিত স্মার্ট পেট শপ, হেল্পফুল পেট কেয়ার সাজেশন্স এবং আপনার পোষা প্রাণীর নিখুঁত যত্নের জন্য এআই চ্যাট অ্যাসিস্ট্যান্ট।",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-gray-800 font-sans">
        <Providers>
          <Navbar />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
          <AIChatWidget />
        </Providers>
      </body>
    </html>
  );
}


