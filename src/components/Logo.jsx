import React from "react";

// This matches your new logo image (Image 7)
export default function Logo({ size = 38, className = "" }) {
  return (
   <svg
    width="64"
    height="100"
    viewBox="0 0 64 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer blue badge shape */}
    <path
      d="M32 0C14.3 0 0 14.3 0 32c0 9.8 4.4 18.5 11.3 24.5L2 92l19.2-13 10.8 8 10.8-8L62 92l-9.3-35.5C59.6 50.5 64 41.8 64 32 64 14.3 49.7 0 32 0z"
      fill="#264283"
    />

    {/* Light blue background circle */}
    <circle cx="32" cy="32" r="20" fill="#E6EDFF" />

    {/* Magnifying glass circle */}
    <circle cx="32" cy="29" r="7" stroke="#264283" strokeWidth="2" />

    {/* Vertical bar */}
    <rect x="31" y="25" width="2" height="5" rx="1" fill="#264283" />

    {/* Horizontal bar */}
    <rect x="29" y="30" width="6" height="2" rx="1" fill="#264283" />
  </svg>
  );
}