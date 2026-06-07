"use client";

import React from "react";
import ClientsGlobe from "@/components/three/ClientsGlobe";

const LOGOS = ["injazat", "Lowe's", "Cognizant", "Trimble", "e2open", "Toyota"];

export default function ClientsSection() {
  return (
    <section id="clients" className="section-wrapper relative w-full flex flex-col items-center" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
      <div className="content-container flex flex-col items-center w-full">
        {/* Header Block */}
        <div className="text-center w-full" style={{ marginBottom: "20px" }}>
          <h2
            className="font-bold text-[var(--text-primary)] tracking-tight"
            style={{
              fontSize: "clamp(28px, 3.5vw, 42px)",
              marginBottom: "12px",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            Trusted by Industry Leaders
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--text-muted)",
              fontWeight: 400,
              letterSpacing: "0.02em",
              marginTop: "12px",
            }}
          >
            Powering Innovation for Companies Worldwide
          </p>
        </div>

        {/* 3D Clients Globe */}
        <div className="w-full" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <ClientsGlobe />
        </div>

        {/* Muted Client Name Strip */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
            marginTop: "16px",
          }}
        >
          {LOGOS.map((logo) => (
            <span
              key={logo}
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
