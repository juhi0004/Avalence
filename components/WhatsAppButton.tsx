"use client";

import React from "react";

export default function WhatsAppButton() {
  return (
    <>
      <a
        href="https://wa.me/8855007004"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label="Contact us on WhatsApp"
      >
        {/* Official WhatsApp icon PNG image */}
        <img
          src="/whatsapp-icon.png"
          alt="WhatsApp"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block"
          }}
        />

        {/* Tooltip */}
        <span className="whatsapp-tooltip">Chat with us</span>
      </a>

      <style dangerouslySetInnerHTML={{ __html: `
        .whatsapp-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);
          border: none;
          background: transparent;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
          text-decoration: none;
          animation: waPulse 2.5s infinite;
        }

        @keyframes waPulse {
          0%   { box-shadow: 0 4px 16px rgba(37,211,102,0.4), 0 0 0 0 rgba(37,211,102,0.3); }
          70%  { box-shadow: 0 4px 16px rgba(37,211,102,0.4), 0 0 0 14px rgba(37,211,102,0); }
          100% { box-shadow: 0 4px 16px rgba(37,211,102,0.4), 0 0 0 0 rgba(37,211,102,0); }
        }

        .whatsapp-fab:hover {
          transform: scale(1.12);
          box-shadow: 0 6px 28px rgba(37, 211, 102, 0.7);
          animation: none;
        }

        .whatsapp-tooltip {
          position: absolute;
          right: 72px;
          background: rgba(10, 10, 10, 0.92);
          color: #BEA256;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid rgba(190, 162, 86, 0.3);
          white-space: nowrap;
          opacity: 0;
          transform: translateX(6px);
          transition: opacity 0.25s ease, transform 0.25s ease;
          pointer-events: none;
        }

        .whatsapp-fab:hover .whatsapp-tooltip {
          opacity: 1;
          transform: translateX(0);
        }
      `}} />
    </>
  );
}
