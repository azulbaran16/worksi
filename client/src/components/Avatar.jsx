// Deterministic SVG avatar — a gradient disc with an abstract person silhouette.
const GRADIENTS = [
  ["#5491cf", "#285d9b"],
  ["#88b4e1", "#2f6fb5"],
  ["#3b82c4", "#1d3e64"],
  ["#5491cf", "#224b7c"],
  ["#6ba0d6", "#285d9b"],
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < (str || "").length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export default function Avatar({ name = "", className = "h-12 w-12" }) {
  const [from, to] = GRADIENTS[hash(name) % GRADIENTS.length];
  const id = `av-${hash(name)}`;
  return (
    <span className={`inline-flex shrink-0 overflow-hidden rounded-full ${className}`}>
      <svg viewBox="0 0 48 48" className="h-full w-full" role="img" aria-label={name}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
        <rect width="48" height="48" fill={`url(#${id})`} />
        <circle cx="24" cy="19" r="8" fill="#ffffff" opacity="0.95" />
        <path d="M10 42a14 12 0 0 1 28 0z" fill="#ffffff" opacity="0.95" />
      </svg>
    </span>
  );
}
