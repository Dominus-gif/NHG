import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import { posts } from "@/content/posts";
import PostsIndex from "./PostsIndex";

export const metadata: Metadata = {
  title: "Posts — Nord Harton",
  description:
    "Perspectives on enterprise digital transformation, engineering, design, and cloud from the Nord Harton team.",
  alternates: { canonical: "/posts" },
};

export default function PostsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Posts"
        title="Insights from the Nord Harton team"
        description="Perspectives on strategy, engineering, and design from the people building mission-critical systems."
      />

      <PostsIndex posts={posts} />
    </>
  );
}
