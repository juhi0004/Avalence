"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import TypewriterText from "./ui/TypewriterText";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "Under $10k",
    details: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", company: "", budget: "Under $10k", details: "" });
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{ 
        background: "var(--bg-primary)", 
        paddingTop: "40px", 
        paddingBottom: "40px", 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center" 
      }}
      className="section-wrapper"
    >
      <div className="content-container" style={{ width: "100%" }}>
        {/* Heading with typewriter effect */}
        <div style={{ marginBottom: 30, textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(30px, 4vw, 46px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
              marginBottom: 16,
              minHeight: "60px", // Ensure space for heading even before typewriter completes
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TypewriterText
              text="Let's Build the Future Together"
              highlightText="Future"
              highlightStyle={{ color: "var(--accent)", fontSize: "calc(1em + 8px)" }}
              speed={40}
              delay={0}
              className="typewriter-heading"
              style={{
                fontSize: "inherit",
                fontWeight: "inherit",
                color: "inherit",
              }}
            />
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-muted)",
              maxWidth: 500,
              margin: "0 auto",
              lineHeight: 1.5,
            }}
          >
            Tell us about your vision. We'll get back to you within 24 hours with a tailored plan.
          </p>
        </div>

        {/* Form in glassmorphism container */}
        <motion.div
          ref={formContainerRef}
          className="glassmorphic"
          style={{
            padding: "24px 28px",
            maxWidth: 520,
            margin: "0 auto",
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ display: "grid", gap: 14 }}
                className="contact-form-grid"
              >
                {/* Two-column row: Name and Email */}
                <div className="contact-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {/* Name Field */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-secondary, rgba(255, 255, 255, 0.7))",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      required
                      style={{
                        background: "var(--bg-card, rgba(255, 255, 255, 0.05))",
                        border: `1px solid var(--border-color, rgba(255, 255, 255, 0.1))`,
                        borderRadius: 12,
                        padding: "10px 14px",
                        fontSize: 14,
                        color: "var(--text-primary, #ffffff)",
                        outline: "none",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent)";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(212,175,55,0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-color, rgba(255, 255, 255, 0.1))";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Email Field */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-secondary, rgba(255, 255, 255, 0.7))",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                      style={{
                        background: "var(--bg-card, rgba(255, 255, 255, 0.05))",
                        border: `1px solid var(--border-color, rgba(255, 255, 255, 0.1))`,
                        borderRadius: 12,
                        padding: "10px 14px",
                        fontSize: 14,
                        color: "var(--text-primary, #ffffff)",
                        outline: "none",
                        transition: "all 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent)";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(212,175,55,0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-color, rgba(255, 255, 255, 0.1))";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Company Field */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-secondary, rgba(255, 255, 255, 0.7))",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your Organization"
                    style={{
                      background: "var(--bg-card, rgba(255, 255, 255, 0.05))",
                      border: `1px solid var(--border-color, rgba(255, 255, 255, 0.1))`,
                      borderRadius: 12,
                      padding: "10px 14px",
                      fontSize: 14,
                      color: "var(--text-primary, #ffffff)",
                      outline: "none",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.15)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-color, rgba(255, 255, 255, 0.1))";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Budget Dropdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-secondary, rgba(255, 255, 255, 0.7))",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Estimated Budget
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    style={{
                      background: "var(--bg-card, rgba(255, 255, 255, 0.05))",
                      border: `1px solid var(--border-color, rgba(255, 255, 255, 0.1))`,
                      borderRadius: 12,
                      padding: "10px 14px",
                      fontSize: 14,
                      color: "var(--text-primary, #ffffff)",
                      outline: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.15)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-color, rgba(255, 255, 255, 0.1))";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <option style={{ background: "#111" }}>Under $10k</option>
                    <option style={{ background: "#111" }}>$10k - $50k</option>
                    <option style={{ background: "#111" }}>$50k - $150k</option>
                    <option style={{ background: "#111" }}>$150k+</option>
                  </select>
                </div>

                {/* Project Details Textarea */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-secondary, rgba(255, 255, 255, 0.7))",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Project Details *
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project goals, timeline, and any specific challenges..."
                    required
                    rows={3}
                    style={{
                      background: "var(--bg-card, rgba(255, 255, 255, 0.05))",
                      border: `1px solid var(--border-color, rgba(255, 255, 255, 0.1))`,
                      borderRadius: 12,
                      padding: "10px 14px",
                      fontSize: 14,
                      color: "var(--text-primary, #ffffff)",
                      outline: "none",
                      resize: "vertical",
                      transition: "all 0.3s ease",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.15)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-color, rgba(255, 255, 255, 0.1))";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    background: isLoading ? "rgba(190, 162, 86, 0.6)" : "#BEA256", // Gold background
                    color: "#0a0a0a", // Dark text on gold
                    border: "none",
                    borderRadius: 12,
                    padding: "14px 32px",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.7 : 1,
                    transition: "all 0.3s ease",
                    width: "100%",
                    marginTop: 8,
                    boxShadow: "0 4px 16px rgba(190, 162, 86, 0.2)",
                  }}
                  whileHover={!isLoading ? {
                    background: "#c9a961",
                    boxShadow: "0 8px 32px rgba(190, 162, 86, 0.4)",
                    transform: "translateY(-2px)",
                  } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = "#c9a961";
                      e.currentTarget.style.boxShadow = "0 8px 32px rgba(190, 162, 86, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = "#BEA256";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(190, 162, 86, 0.2)";
                    }
                  }}
                >
                  {isLoading ? "Sending..." : "Send Message →"}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6 }}
                  style={{ fontSize: 48, marginBottom: 16 }}
                >
                  ✓
                </motion.div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--text-primary, #ffffff)",
                    marginBottom: 8,
                  }}
                >
                  Message Sent Successfully!
                </h3>
                <p style={{ color: "var(--text-muted, rgba(255, 255, 255, 0.55))", fontSize: 14 }}>
                  We've received your message and will get back to you within 24 hours.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Info */}
        <div
          style={{
            marginTop: 40,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            <a
              href="mailto:atom@avalence.ai"
              style={{ color: "var(--text-muted, rgba(255, 255, 255, 0.55))", textDecoration: "none", fontSize: 14, transition: "color 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted, rgba(255, 255, 255, 0.55))";
              }}
            >
              atom@avalence.ai
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-muted, rgba(255, 255, 255, 0.55))", textDecoration: "none", fontSize: 14, transition: "color 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted, rgba(255, 255, 255, 0.55))";
              }}
            >
              LinkedIn ↗
            </a>
          </div>
          <p style={{ color: "var(--text-muted, rgba(255, 255, 255, 0.55))", fontSize: 13 }}>
            Based globally · Serving clients worldwide
          </p>
        </div>
      </div>
    </section>
  );
}

