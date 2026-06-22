import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo.jsx";
import { Icon } from "../icons.jsx";
import { SITE } from "../config.js";

const links = [
  { to: "/jobs", label: "Find Jobs" },
  { to: "/employers", label: "For Employers" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive ? "text-brand-700 bg-brand-50" : "text-slate-600 hover:text-brand-700 hover:bg-slate-50"
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" aria-label="WorkSi home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <a
            href={SITE.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-sm font-medium rounded-lg text-slate-600 transition-colors hover:text-brand-700 hover:bg-slate-50"
          >
            Portal
          </a>
          <Link to="/apply" className="btn-primary ml-2">
            Apply Now
          </Link>
        </div>

        <button
          className="btn-ghost md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Icon.X /> : <Icon.Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            <a
              href={SITE.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:text-brand-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              Portal
            </a>
            <Link to="/apply" className="btn-primary mt-2" onClick={() => setOpen(false)}>
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
