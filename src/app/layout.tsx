import type { Metadata } from "next";
import { Host_Grotesk, Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
import SmoothScroll from "@/components/providers/SmoothScroll";
import ContactModalProvider from "@/components/providers/ContactModalProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Nord Harton Group — Where strategy meets execution",
  description:
    "A digital solutions enterprise turning complex business requirements into elegant, scalable software. 15+ years of expertise, 100+ projects delivered worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${hostGrotesk.variable} ${inter.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen">
        <SmoothScroll />
        <ContactModalProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ContactModalProvider>
      </body>
    </html>
  );
}
