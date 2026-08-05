import type { Metadata } from "next";

// The client portal is a private, authenticated area — keep it out of search.
export const metadata: Metadata = {
  title: "Client Portal — Nord Harton",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
