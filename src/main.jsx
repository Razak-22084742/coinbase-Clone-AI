import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

/**
 * Mount the React app and add global error handlers / debug logging.
 *
 * These handlers help surface runtime errors on the page during development
 * by logging them to the console and rendering a simple visible error message
 * into the root element so the page isn't blank when an exception occurs.
 */
function mountApp() {
  console.log("[dev] mounting app", new Date().toISOString());

  // Global runtime error handler
  window.addEventListener("error", (event) => {
    try {
      console.error("[global error] ", event.error || event.message, event);
      const root = document.getElementById("root");
      if (root) {
        const message =
          event?.error?.message || event?.message || "Unknown global error";
        root.innerHTML = `<pre style="color:#fff; background:#b91c1c; padding:20px; white-space:pre-wrap;">Global error:\n\n${escapeHtml(
          String(message),
        )}</pre>`;
      }
    } catch (e) {
      // If error handling itself fails, at least log to console.
      console.error("Error in global error handler:", e);
    }
  });

  // Unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    try {
      console.error("[unhandledrejection] ", event.reason, event);
      const root = document.getElementById("root");
      if (root) {
        const message =
          (event && event.reason && event.reason.message) ||
          String(event.reason) ||
          "Unhandled promise rejection";
        root.innerHTML = `<pre style="color:#111; background:#fef3c7; padding:20px; white-space:pre-wrap;">Unhandled promise rejection:\n\n${escapeHtml(
          String(message),
        )}</pre>`;
      }
    } catch (e) {
      console.error("Error in unhandledrejection handler:", e);
    }
  });

  // Render inside try/catch to catch synchronous render errors
  try {
    const container = document.getElementById("root");
    if (!container) {
      console.error("Root container not found: #root");
      return;
    }
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <BrowserRouter>
          {/* AuthProvider makes login/logout state available to every component */}
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </StrictMode>,
    );
  } catch (err) {
    console.error("[render error]", err);
    const root = document.getElementById("root");
    if (root) {
      const message = err && err.message ? err.message : String(err);
      root.innerHTML = `<pre style="color:#fff; background:#b91c1c; padding:20px; white-space:pre-wrap;">Render error:\n\n${escapeHtml(
        String(message),
      )}</pre>`;
    }
  }
}

// Small helper to escape HTML in the displayed error message
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Start the app
mountApp();
