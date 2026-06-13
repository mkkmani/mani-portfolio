"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ background: "#000", color: "#fff", fontFamily: "sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: 900 }}>Something went wrong</h1>
          <p style={{ opacity: 0.5 }}>A critical error occurred. Please try again.</p>
          <button
            onClick={reset}
            style={{
              padding: "1rem 2rem",
              background: "#fff",
              color: "#000",
              fontWeight: 900,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontSize: "0.7rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
