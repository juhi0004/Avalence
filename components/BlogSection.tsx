import BlogGrid from "./BlogGrid";
import { getPosts } from "@/lib/sanity";

export default async function BlogSection() {
  // Fetch posts server-side
  const posts = await getPosts();

  return (
    <section id="blog" className="w-full bg-black py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <h2 className="text-3xl md:text-[40px] lg:text-[48px] font-bold text-white tracking-tight leading-tight">
            Insights & Perspectives
          </h2>
          <p className="text-text-muted max-w-sm text-base md:text-lg">
            Thoughts on AI, product, and the future of intelligent software.
          </p>
        </div>

        {/* ── Animated Grid ── */}
        <BlogGrid posts={posts} />
      </div>
    </section>
  );
}
