"use client";

import React from "react";
import ClientsGlobe from "@/components/three/ClientsGlobe";

const LOGOS = ["injazat", "Lowe's", "Cognizant", "Trimble", "e2open", "Toyota"];

export default function ClientsSection() {
  return (
    <section id="clients" className="section-wrapper">
      <div className="content-container">
        {/* Header Block */}
        <div className="text-center w-full" style={{ marginBottom: "80px" }}>
          <h2
            className="font-bold text-white tracking-tight"
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
              color: "rgba(255,255,255,0.4)",
              fontWeight: 400,
              letterSpacing: "0.02em",
              marginTop: "12px",
            }}
          >
            Powering Innovation for Companies Worldwide
          </p>
        </div>

        {/* 3D Clients Globe */}
        <ClientsGlobe />

        {/* Muted Client Name Strip */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
            marginTop: "32px",
          }}
        >
          {LOGOS.map((logo) => (
            <span
              key={logo}
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.3)",
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
