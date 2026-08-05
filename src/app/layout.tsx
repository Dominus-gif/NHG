import type { Metadata, Viewport } from "next";
import { Host_Grotesk, Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
import SmoothScroll from "@/components/providers/SmoothScroll";
import ContactModalProvider from "@/components/providers/ContactModalProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteUrl, siteName, siteTagline, siteDescription, siteKeywords, absoluteUrl } from "@/lib/seo";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#131517",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — ${siteTagline}`,
    template: "%s",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: siteKeywords,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: `${siteName} — ${siteTagline}`,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — ${siteTagline}`,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// Main navigation, exposed to search engines as SiteNavigationElement — the
// signal Google uses when it builds sitelinks under the main result.
const NAV_LINKS = [
  { name: "About", url: "/nordharton", description: "How Nord Harton engineers digital transformation at enterprise scale." },
  { name: "Services", url: "/services", description: "Custom web applications, business systems, mobile, cloud, and branding." },
  { name: "Posts", url: "/posts", description: "Insights on strategy, engineering, design, and cloud from the Nord Harton team." },
  { name: "Careers", url: "/careers", description: "Open roles across engineering, design, and platform." },
  { name: "Client Portal", url: "/portal", description: "Secure sign-in for Nord Harton clients." },
  { name: "Contact", url: "/contact", description: "Tell us about your project — we reply within one business day." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      alternateName: ["NordHarton"],
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon"),
        width: 64,
        height: 64,
      },
      description: siteDescription,
      slogan: siteTagline,
      email: "hello@nordharton.com",
      sameAs: [] as string[],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      alternateName: "NordHarton",
      description: siteDescription,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en",
    },
    ...NAV_LINKS.map((n) => ({
      "@type": "SiteNavigationElement",
      name: n.name,
      description: n.description,
      url: absoluteUrl(n.url),
    })),
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
