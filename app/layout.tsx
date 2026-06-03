import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LenisProvider from "@/components/LenisProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AVALENCE — Intelligence at Scale",
  description:
    "AVALENCE empowers organizations with cascading AI that turns complex challenges into real-world outcomes.",
  openGraph: {
    title: "AVALENCE — Intelligence at Scale",
    description:
      "AVALENCE empowers organizations with cascading AI that turns complex challenges into real-world outcomes.",
    type: "website",
    locale: "en_US",
    siteName: "AVALENCE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} style={{ scrollBehavior: 'smooth' }}>
      <body className="min-h-screen bg-black text-white font-sans overflow-x-clip">
        <LenisProvider>
          <main>{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
