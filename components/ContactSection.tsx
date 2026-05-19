"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Update this with the target WhatsApp phone number (include country code, e.g., "15550199")
const WHATSAPP_NUMBER = "15550199";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    brief: "",
    budget: "Under $10k",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.brief.trim()) {
      setErrorMessage("Please fill in all required fields.");
      setStatus("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const formattedMessage = `Hello AVALENCE! I would like to build a project together.

*Name:* ${formData.name}
*Email:* ${formData.email}
*Company:* ${formData.company || "N/A"}
*Budget:* ${formData.budget}

*Project Details:*
${formData.brief}`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;
      
      // Open WhatsApp in a new tab/app
      window.open(whatsappUrl, "_blank");

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage("Failed to initiate WhatsApp chat. Please try again.");
    }
  };

  const inputStyles = `
    w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5
    text-white placeholder-white/35 outline-none transition-all duration-300
    focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/25
  `;

  return (
    <section 
      id="contact" 
      className="section-wrapper"
    >
      <div className="content-container">
        
        {/* ── CINEMATIC ISOLATED HEADING ── */}
        <div className="text-center max-w-6xl mx-auto mb-16 md:mb-20">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[0.95]">
            Let's Build the <span className="text-[#8B7FFF]">Future</span> Together
          </h2>
        </div>

        {/* ── FORM GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center mt-16 md:mt-20">
          
          {/* Left Side: Decorative Visual Sphere */}
          <div className="contact-left hidden lg:flex justify-center items-center relative w-full h-[500px] pointer-events-none">
            {/* Soft Glows */}
            <div className="absolute w-[450px] h-[450px] rounded-full bg-[#6C63FF]/15 blur-[120px] animate-pulse" />
            <div 
              className="absolute w-[350px] h-[350px] rounded-full bg-[#4A3FBF]/20 blur-[100px] animate-pulse" 
              style={{ animationDelay: "1s" }} 
            />
            {/* Abstract Wireframe Sphere */}
            <svg className="relative z-10 w-[400px] h-[400px] opacity-40 animate-[spin_60s_linear_infinite]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              {Array.from({ length: 12 }).map((_, i) => (
                <ellipse 
                  key={i} 
                  cx="100" 
                  cy="100" 
                  rx="80" 
                  ry="30" 
                  fill="none" 
                  stroke="#6C63FF" 
                  strokeWidth="0.5" 
                  transform={`rotate(${i * 15} 100 100)`} 
                />
              ))}
            </svg>
          </div>

          {/* Right Side: Form */}
          <div className="w-full relative">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/[0.02] border border-[#6C63FF]/30 rounded-3xl p-10 md:p-12 shadow-[0_0_50px_rgba(108,99,255,0.15)] flex flex-col items-center justify-center text-center w-full min-h-[500px]"
                >
                  {/* Premium Glowing Checkmark Icon */}
                  <div className="relative w-20 h-20 bg-[#6C63FF]/15 border border-[#8B7FFF]/40 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(108,99,255,0.3)]">
                    <svg className="w-10 h-10 text-[#8B7FFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">WhatsApp Redirected!</h3>
                  <p className="text-text-muted mb-10 max-w-sm text-base md:text-lg leading-relaxed">
                    We've opened a direct WhatsApp chat window. Please send the pre-filled text in WhatsApp to submit your request instantly.
                  </p>
                  
                  <button
                    onClick={() => {
                      const formattedMessage = `Hello AVALENCE! I would like to build a project together.

*Name:* ${formData.name}
*Email:* ${formData.email}
*Company:* ${formData.company || "N/A"}
*Budget:* ${formData.budget}

*Project Details:*
${formData.brief}`;
                      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`, "_blank");
                    }}
                    style={{ backgroundColor: "#6C63FF" }}
                    className="w-full max-w-[320px] py-4 mt-6 md:mt-8 rounded-full text-white text-sm font-semibold hover:shadow-[0_0_32px_rgba(108,99,255,0.6)] hover:bg-[#5a52e0] transition-all duration-300 active:scale-[0.97]"
                  >
                    Re-open WhatsApp Chat
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  className="contact-form space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Aarav Sharma"
                        className={inputStyles}
                        required
                        disabled={status === "loading"}
                      />
                    </div>
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="aarav@example.com"
                        className={inputStyles}
                        required
                        disabled={status === "loading"}
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Company (Optional)</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your Organization"
                      className={inputStyles}
                      disabled={status === "loading"}
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Estimated Budget</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className={inputStyles}
                      disabled={status === "loading"}
                    >
                      <option className="bg-black text-white" value="Under $10k">Under $10k</option>
                      <option className="bg-black text-white" value="$10k–$50k">$10k – $50k</option>
                      <option className="bg-black text-white" value="$50k–$150k">$50k – $150k</option>
                      <option className="bg-black text-white" value="$150k+">$150k+</option>
                    </select>
                  </div>

                  {/* Project Brief */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Project Details *</label>
                    <textarea
                      name="brief"
                      value={formData.brief}
                      onChange={handleChange}
                      placeholder="Tell us about your project goals, timeline, and any specific challenges..."
                      rows={5}
                      className={`${inputStyles} resize-none`}
                      required
                      disabled={status === "loading"}
                    />
                  </div>

                  {/* Error Banner */}
                  {status === "error" && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                      {errorMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="
                      w-full py-4 rounded-xl font-bold text-white
                      bg-gradient-to-r from-[#4A3FBF] to-[#6C63FF]
                      hover:shadow-[0_0_30px_rgba(108,99,255,0.4)]
                      transition-all duration-300
                      disabled:opacity-70 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2
                    "
                  >
                    {status === "loading" ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <span className="text-xl leading-none">→</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Contact Info Footer */}
            <div className="mt-10 flex flex-col sm:flex-row items-center sm:justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-white/50 pt-8 border-t border-white/[0.05]">
              <a href="mailto:atom@avalence.ai" className="hover:text-white transition-colors">
                atom@avalence.ai
              </a>
              <span className="hidden sm:inline">•</span>
              <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </a>
              <span className="hidden sm:inline">•</span>
              <span>Based globally · Serving worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
