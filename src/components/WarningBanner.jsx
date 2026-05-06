// components/WarningBanner.jsx — Sticky top warning shown on every page
//
// Renders above the NavBar in App.jsx so it persists across all routes.
// Includes a dismiss button that hides it for the session (React state — no localStorage).

import { useState } from "react";

export default function WarningBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className="sticky top-0 z-[60] w-full bg-amber-100 border-b border-amber-300 text-amber-900 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 py-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2 min-w-0">
          {/* Warning icon */}
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-amber-700"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2L1 21h22L12 2zm0 4.6l8.5 14.4h-17L12 6.6zm-1 5.4v4h2v-4h-2zm0 5v2h2v-2h-2z" />
          </svg>
          <p className="font-medium leading-snug">
            <span className="font-bold">Student project notice:</span>{" "}
            This is a student project for educational purposes only. Not
            affiliated with, endorsed by, or connected to Coinbase Inc.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss warning banner"
          className="shrink-0 p-1 rounded hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
