export default function Logo({ className = "", light = false }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-xl font-extrabold tracking-tight ${className}`}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 4 10 5-13 5 13 4-10" />
        </svg>
        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-accent-500" />
      </span>
      <span className={light ? "text-white" : "text-brand-900"}>
        Work<span className={light ? "text-accent-400" : "text-brand-500"}>Si</span>
      </span>
    </span>
  );
}
