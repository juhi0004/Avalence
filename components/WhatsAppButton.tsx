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
        {/* Official WhatsApp icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 175.216 175.552"
          width="34"
          height="34"
        >
          <defs>
            <linearGradient id="wa-grad" x1="85.915%" x2="14.083%" y1="14.084%" y2="85.916%">
              <stop offset="0%" stopColor="#57D163" />
              <stop offset="100%" stopColor="#23B33A" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wa-grad)"
            d="M87.576 0C39.178 0 .006 39.178.006 87.576c0 15.264 3.963 29.624 10.938 42.092L.006 175.552l47.288-10.678A87.255 87.255 0 0087.576 175.16c48.398 0 87.64-39.178 87.64-87.584C175.216 39.178 135.974 0 87.576 0z"
          />
          <path
            fill="#FFF"
            d="M135.573 111.612c-2.318 6.515-13.468 12.45-18.375 13.245-4.907.795-11.066.856-17.854-1.604-4.109-1.486-9.385-3.468-16.126-6.814-28.4-14.002-46.95-43.026-48.34-45.037-1.39-2.01-11.34-15.064-11.34-28.76 0-13.694 7.195-20.41 9.743-23.19 2.546-2.783 5.554-3.479 7.397-3.479 1.844 0 3.684.017 5.299.085 1.698.07 3.977-.643 6.221 4.748 2.32 5.583 7.868 19.282 8.563 20.685.695 1.39 1.159 3.015.23 4.864-.928 1.848-1.39 2.998-2.77 4.631-1.39 1.634-2.918 3.65-4.166 4.903-1.39 1.384-2.838 2.892-1.22 5.68 1.619 2.784 7.196 11.876 15.44 19.244 10.606 9.46 19.538 12.39 22.308 13.78 2.77 1.39 4.39 1.159 6.01-.695 1.62-1.848 6.94-8.118 8.79-10.903 1.847-2.784 3.693-2.32 6.24-1.39 2.546.928 16.165 7.625 18.937 9.015 2.77 1.39 4.621 2.086 5.293 3.245.678 1.165.678 6.749-1.64 13.267z"
          />
        </svg>

        {/* Tooltip */}
        <span className="whatsapp-tooltip">Chat with us</span>
      </a>

      <style dangerouslySetInnerHTML={{ __html: `
        .whatsapp-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          width: 62px;
          height: 62px;
          background: #25D366;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(37, 211, 102, 0.5);
          border: none;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
          text-decoration: none;
          animation: waPulse 2.5s infinite;
        }

        @keyframes waPulse {
          0%   { box-shadow: 0 4px 16px rgba(37,211,102,0.5), 0 0 0 0 rgba(37,211,102,0.4); }
          70%  { box-shadow: 0 4px 16px rgba(37,211,102,0.5), 0 0 0 14px rgba(37,211,102,0); }
          100% { box-shadow: 0 4px 16px rgba(37,211,102,0.5), 0 0 0 0 rgba(37,211,102,0); }
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
