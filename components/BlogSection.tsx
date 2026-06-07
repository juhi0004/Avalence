import TestimonialsClient from "./TestimonialsClient";

export default function BlogSection() {
  return (
    <section
      id="blog"
      className="section-wrapper"
      style={{ paddingTop: "20px" }}
    >
      <div className="content-container">
        {/* ── Testimonials / Customer Reviews Subsection ── */}
        <TestimonialsClient />
      </div>
    </section>
  );
}
