"use client";

import React from "react";
import ClientsGlobe from "@/components/three/ClientsGlobe";

const LOGOS = ["injazat", "Lowe's", "Cognizant", "Trimble", "e2open", "Toyota"];

export default function ClientsSection() {
  return (
    <section
      id="clients"
      className="section-wrapper relative w-full"
      style={{ paddingTop: "80px", paddingBottom: "0" }}
    >
      {/* Top part: text left + globe right */}
      <div className="content-container cs-grid-layout">
        {/* Left Column: Text Content */}
        <div className="cs-text-col">
          <h2
            className="font-bold tracking-tight cs-heading"
            style={{
              fontSize: "clamp(44px, 5.5vw, 68px)",
              lineHeight: 1.1,
              marginBottom: "24px",
              letterSpacing: "-0.03em",
            }}
          >
            {/* "Trusted" in gold */}
            <span style={{ color: "#BEA256" }}>Trusted</span>
            {" by Industry Leaders"}
          </h2>

          <p
            className="cs-desc"
            style={{
              fontSize: "17px",
              color: "var(--text-muted)",
              fontWeight: 400,
              lineHeight: 1.7,
              letterSpacing: "0.02em",
              marginBottom: "0",
            }}
          >
            Powering Innovation for Companies Worldwide. AVALENCE collaborates
            with global enterprises to orchestrate high-throughput, low-latency
            agentic workflows and intelligence at scale.
          </p>
        </div>

        {/* Right Column: 3D Globe — overflow visible so sphere isn't clipped */}
        <div className="cs-globe-col">
          <ClientsGlobe />
        </div>
      </div>

      {/* Bottom client name strip enclosed in gold lines */}
      <div className="cs-client-strip">
        <div className="cs-strip-line" />
        <div className="cs-strip-names">
          {LOGOS.map((logo) => (
            <span key={logo} className="cs-strip-name">
              {logo}
            </span>
          ))}
        </div>
        <div className="cs-strip-line" />
      </div>

      {/* Scoped CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* ── Two-column grid ── */
          .cs-grid-layout {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 48px;
            width: 100%;
          }

          /* ── Left text col ── */
          .cs-text-col {
            flex: 1;
            max-width: 560px;
            text-align: left;
          }

          /* ── Globe col: overflow visible so sphere isn't clipped ── */
          .cs-globe-col {
            flex: 1.2;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: visible;
          }

          /* ── Client strip at the bottom ── */
          .cs-client-strip {
            margin-top: 48px;
          }

          .cs-strip-line {
            width: 100%;
            height: 1px;
            background: linear-gradient(
              90deg,
              transparent 0%,
              #BEA256 20%,
              #BEA256 80%,
              transparent 100%
            );
            opacity: 0.7;
          }

          .cs-strip-names {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 0;
            padding: 18px 0;
          }

          .cs-strip-name {
            font-size: 13px;
            color: var(--text-muted);
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            padding: 0 28px;
            position: relative;
          }

          /* Separator dots between names */
          .cs-strip-name + .cs-strip-name::before {
            content: "·";
            position: absolute;
            left: 0;
            transform: translateX(-50%);
            color: rgba(190, 162, 86, 0.5);
            font-size: 20px;
            line-height: 1;
          }

          /* ── Responsive: stack vertically ── */
          @media (max-width: 1024px) {
            .cs-grid-layout {
              flex-direction: column;
              gap: 36px;
            }
            .cs-text-col {
              max-width: 100%;
              text-align: center;
            }
            .cs-globe-col {
              flex: 1;
              width: 100%;
            }
          }

          @media (max-width: 768px) {
            .cs-strip-name {
              padding: 0 16px;
              font-size: 11px;
            }
          }
        `
      }} />
    </section>
  );
}
