import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Nord Harton Group",
  description:
    "Tell us about your project. A member of the Nord Harton team will respond within one business day.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
