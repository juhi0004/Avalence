import BlogGrid from "./BlogGrid";
import { getPosts } from "@/lib/sanity";

/* ── Fake Customer Reviews Data ── */
const TESTIMONIALS = [
  {
    name: "Sarah Jenkins",
    role: "Chief Product Officer",
    company: "Clinix Health",
    quote:
      "Avalence completely transformed our generative UI pipelines. We reduced our GTM deployment window from months to under three weeks. Their intent-based intelligence system is truly lightyears ahead of anything we built internally.",
    stars: 5,
    initials: "SJ",
  },
  {
    name: "David Chen",
    role: "Lead DevOps Architect",
    company: "Injazat Solutions",
    quote:
      "The integration of Avalence Agentic core into our multi-tenant API gateway has been a game-changer. Scale throughput increased by 40% while keeping memory footprint practically negligible. Phenomenal technology and support.",
    stars: 5,
    initials: "DC",
  },
  {
    name: "Elena Rostova",
    role: "Founder",
    company: "Sentix AI",
    quote:
      "What impressed us most was Avalence's product design precision. They don't just build APIs—they curate cohesive, human-centric workflows that make complex cognitive steps feel simple. Incredible partners to grow with.",
    stars: 5,
    initials: "ER",
  },
];

export default async function BlogSection() {
  // Fetch posts server-side
  const posts = await getPosts();
  const hasPosts = posts && posts.length > 0;

  return (
    <section 
      id="blog" 
      className="section-wrapper"
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

        {/* ── Testimonials / Customer Reviews Subsection (Spacious containing box with ambient background glow) ── */}
        <div 
          className="testimonials-subsection relative overflow-hidden py-20 px-6 md:py-24 md:px-12 bg-white/[0.01] border border-white/[0.03] rounded-3xl"
        >
          {/* Subtle Ambient Radial Purple Glow Behind Cards Only */}
          <div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: "radial-gradient(circle at center, rgba(108, 99, 255, 0.05) 0%, transparent 70%)",
            }}
          />

          {/* Header with increased margin-bottom for typographical rhythm */}
          <div className="relative z-10 text-center max-w-3xl mx-auto mb-20">
            <h3 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-white mb-6 tracking-tight leading-tight">
              What Our Partners Say
            </h3>
            <p className="text-text-muted text-base md:text-lg">
              Enterprise-grade feedback from industry leaders collaborating with AVALENCE.
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {TESTIMONIALS.map((review, i) => (
              <div
                key={i}
                className="relative flex flex-col justify-between bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:border-[#6C63FF]/30 hover:shadow-[0_12px_40px_rgba(108,99,255,0.08)] transition-all duration-300 group"
              >
                {/* Accent Violet Blur behind active hover */}
                <div className="absolute inset-0 bg-[#6C63FF]/5 opacity-0 group-hover:opacity-100 rounded-2xl blur-xl transition-opacity duration-300 pointer-events-none" />

                {/* Top Info: Stars & Quotes */}
                <div className="relative z-10">
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(review.stars)].map((_, starIdx) => (
                      <span key={starIdx} className="text-[#8B7FFF] text-lg select-none">
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Review Quote */}
                  <p className="text-white/70 italic text-[14px] leading-relaxed mb-8">
                    "{review.quote}"
                  </p>
                </div>

                {/* Bottom Profile Row */}
                <div className="relative z-10 flex items-center gap-4 mt-auto pt-6 border-t border-white/[0.05]">
                  {/* Initials Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#6C63FF]/20 border border-[#6C63FF]/40 flex items-center justify-center text-[#8B7FFF] font-semibold text-[13px] tracking-wider uppercase shrink-0">
                    {review.initials}
                  </div>
                  {/* Name and Designation */}
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-[14px]">{review.name}</span>
                    <span className="text-white/40 text-[12px] font-medium leading-tight">
                      {review.role} · <span className="text-[#8B7FFF]/80">{review.company}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
