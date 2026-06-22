// Distinct SVG illustration per job category, rendered inside a gradient tile.
const ICONS = {
  "Warehouse & Logistics": (
    <>
      <path d="M3 9l9-5 9 5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M9 21v-6h6v6" />
      <path d="M3 13h18" />
    </>
  ),
  Manufacturing: (
    <>
      <path d="M4 21V10l5 3V10l5 3V7l6 3v11z" />
      <circle cx="12" cy="17" r="1.4" />
    </>
  ),
  "Skilled Trades": (
    <>
      <path d="M14.5 5.5a3.5 3.5 0 0 1-4.6 4.6L4 16v4h4l5.9-5.9a3.5 3.5 0 0 1 4.6-4.6l-2.5 2.5-2-2z" />
    </>
  ),
  "Office & Administration": (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  "Accounting & Finance": (
    <>
      <path d="M4 19V5M4 19h16" />
      <path d="M8 16v-4M12 16V8M16 16v-6" />
    </>
  ),
  "Customer Service": (
    <>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="2.5" y="13" width="4" height="6" rx="1.5" />
      <rect x="17.5" y="13" width="4" height="6" rx="1.5" />
      <path d="M20 19a4 4 0 0 1-4 3h-2" />
    </>
  ),
};

const GRADIENTS = [
  ["#599dff", "#1f57db"],
  ["#22d3a8", "#059669"],
  ["#8ec0ff", "#3377f6"],
  ["#34d399", "#10b981"],
  ["#60a5fa", "#1a44b0"],
  ["#2dd4bf", "#0d9488"],
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function CategoryArt({ category, className = "h-11 w-11" }) {
  const icon = ICONS[category] || ICONS["Office & Administration"];
  const [from, to] = GRADIENTS[hash(category) % GRADIENTS.length];
  const id = `cat-${hash(category)}`;
  return (
    <span className={`inline-flex items-center justify-center rounded-xl ${className}`}>
      <svg viewBox="0 0 48 48" className="h-full w-full">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="13" fill={`url(#${id})`} />
        <g
          transform="translate(12 12)"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon}
        </g>
      </svg>
    </span>
  );
}
