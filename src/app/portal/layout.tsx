import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/layout/Wordmark";

// The client portal is a private, authenticated area — keep it out of search.
export const metadata: Metadata = {
  title: "Client Portal — Nord Harton",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-hairline bg-base/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-6 lg:px-12">
          <Link href="/" title="Back to nordharton.com" className="flex items-center transition-opacity hover:opacity-80">
            <Wordmark size={18} />
          </Link>
        </div>
      </header>
      {children}
    </>
  );
}
