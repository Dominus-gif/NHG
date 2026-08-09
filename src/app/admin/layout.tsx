import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

// Private administrative area — never index.
export const metadata: Metadata = {
  title: "Admin — Nord Harton",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
