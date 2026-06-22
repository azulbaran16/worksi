// Abstract recruitment illustration for the hero — pure SVG, scales to its container.
// Designed to sit on the dark navy hero background.
export default function HeroArt({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 460 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="People being matched with jobs"
    >
      <defs>
        <linearGradient id="ha-card" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#eef6ff" />
        </linearGradient>
        <linearGradient id="ha-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7c948" />
          <stop offset="1" stopColor="#d99a1e" />
        </linearGradient>
        <linearGradient id="ha-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5491cf" />
          <stop offset="1" stopColor="#285d9b" />
        </linearGradient>
        <linearGradient id="ha-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* soft blobs */}
      <circle cx="360" cy="80" r="120" fill="#2f6fb5" opacity="0.30" />
      <circle cx="90" cy="300" r="90" fill="#f2b632" opacity="0.16" />

      {/* connecting dashed line */}
      <path d="M150 130 C 230 160, 240 230, 320 250" stroke="#88b4e1" strokeWidth="2.5" strokeDasharray="6 8" strokeLinecap="round" opacity="0.7" />

      {/* Back job card */}
      <g transform="rotate(-6 120 150)">
        <rect x="40" y="70" width="190" height="120" rx="16" fill="url(#ha-card)" />
        <circle cx="72" cy="102" r="16" fill="url(#ha-blue)" />
        <rect x="98" y="92" width="100" height="10" rx="5" fill="#142d49" opacity="0.85" />
        <rect x="98" y="110" width="64" height="8" rx="4" fill="#94a3b8" />
        <rect x="56" y="138" width="158" height="8" rx="4" fill="#cbd5e1" />
        <rect x="56" y="154" width="120" height="8" rx="4" fill="#cbd5e1" />
        <rect x="56" y="170" width="70" height="14" rx="7" fill="url(#ha-gold)" />
      </g>

      {/* Front candidate card */}
      <g transform="rotate(5 320 250)">
        <rect x="230" y="190" width="190" height="130" rx="16" fill="url(#ha-card)" />
        <circle cx="264" cy="226" r="18" fill="url(#ha-blue)" />
        <path d="M264 218 a7 7 0 1 1 0 14 a7 7 0 1 1 0 -14 M252 244 a12 9 0 0 1 24 0" fill="#ffffff" />
        <rect x="292" y="214" width="104" height="10" rx="5" fill="#142d49" opacity="0.85" />
        <rect x="292" y="232" width="70" height="8" rx="4" fill="#94a3b8" />
        <rect x="248" y="262" width="154" height="8" rx="4" fill="#cbd5e1" />
        <rect x="248" y="278" width="120" height="8" rx="4" fill="#cbd5e1" />
        <rect x="248" y="296" width="60" height="14" rx="7" fill="url(#ha-gold)" />
      </g>

      {/* Match badge */}
      <g transform="translate(214 150)">
        <circle r="30" fill="url(#ha-green)" />
        <circle r="30" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.5" />
        <path d="M-13 1 L-4 11 L14 -9" stroke="#ffffff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* small floating dots */}
      <circle cx="410" cy="170" r="6" fill="#f2b632" />
      <circle cx="120" cy="40" r="5" fill="#88b4e1" />
      <circle cx="60" cy="220" r="4" fill="#ffffff" opacity="0.8" />
    </svg>
  );
}
