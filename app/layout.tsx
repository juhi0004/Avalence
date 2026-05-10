import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Avalence — Powerful, Scalable Software Solutions",
  description:
    "Avalence delivers AI-powered SaaS solutions that scale with your enterprise. From intelligent automation to predictive analytics, we build the software infrastructure that drives growth.",
  keywords: [
    "AI SaaS",
    "enterprise software",
    "scalable solutions",
    "intelligent automation",
    "predictive analytics",
  ],
  openGraph: {
    title: "Avalence — Powerful, Scalable Software Solutions",
    description:
      "AI-powered SaaS solutions that scale with your enterprise.",
    type: "website",
    locale: "en_US",
    siteName: "Avalence",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground font-sans">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
