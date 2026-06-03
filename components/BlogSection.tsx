import BlogGrid from "./BlogGrid";
import { getPosts } from "@/lib/sanity";
import TestimonialsClient from "./TestimonialsClient";

export default async function BlogSection() {
  // Fetch posts server-side
  const posts = await getPosts();
  const hasPosts = posts && posts.length > 0;

  return (
    <section 
      id="blog" 
      className="section-wrapper"
      style={{ paddingTop: "20px" }}
    >
      <div className="content-container">
        
        {/* ── Blog Grid Subsection (ONLY rendered if posts actually exist) ── */}
        {hasPosts && (
          <>
            <div>
              {/* Section Header */}
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <h2 className="text-3xl md:text-[40px] lg:text-[48px] font-bold text-white tracking-tight leading-tight">
                  Insights & Perspectives
                </h2>
                <p className="text-text-muted max-w-sm text-base md:text-lg">
                  Thoughts on AI, product, and the future of intelligent software.
                </p>
              </div>

              {/* Animated Grid */}
              <BlogGrid posts={posts} />
            </div>

            {/* Separator inside Blog Section to create elegant pacing */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-20 md:my-28" />
          </>
        )}

        {/* ── Testimonials / Customer Reviews Subsection ── */}
        <TestimonialsClient />

      </div>
    </section>
  );
}
