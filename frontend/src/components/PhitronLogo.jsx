export default function PhitronLogo({ className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Book body */}
      <rect x="10" y="8" width="38" height="48" rx="4" fill="#1e3a5f" />
      <rect x="14" y="8" width="34" height="48" rx="3" fill="#1d4ed8" />
      {/* Spine */}
      <rect x="10" y="8" width="6" height="48" rx="3" fill="#1e3a5f" />
      {/* Lines on page */}
      <rect x="20" y="20" width="20" height="2.5" rx="1.25" fill="#93c5fd" opacity="0.8" />
      <rect x="20" y="27" width="16" height="2.5" rx="1.25" fill="#93c5fd" opacity="0.6" />
      <rect x="20" y="34" width="18" height="2.5" rx="1.25" fill="#93c5fd" opacity="0.6" />
      <rect x="20" y="41" width="13" height="2.5" rx="1.25" fill="#93c5fd" opacity="0.4" />
      {/* Glow circle behind */}
      <circle cx="32" cy="32" r="28" fill="#3b82f6" opacity="0.08" />
    </svg>
  );
}
