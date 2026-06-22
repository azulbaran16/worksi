import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";
import { Icon } from "../icons.jsx";
import { SITE } from "../config.js";

const socials = [
  { href: SITE.social.instagram, label: "Instagram", Comp: Icon.Instagram },
  { href: SITE.social.facebook, label: "Facebook", Comp: Icon.Facebook },
  { href: SITE.social.linkedin, label: "LinkedIn", Comp: Icon.Linkedin },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">
            {SITE.tagline}. Fully licensed for temporary help and recruitment services across Canada.
          </p>
          <div className="mt-4 flex gap-2">
            {socials.map(({ href, label, Comp }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                <Comp width={18} height={18} />
              </a>
            ))}
            <a
              href={SITE.social.beacons}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Beacons"
              className="flex h-9 items-center justify-center rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-500 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              Beacons
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Job Seekers</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link to="/jobs" className="hover:text-brand-700">Find Jobs</Link></li>
            <li><Link to="/apply" className="hover:text-brand-700">Apply Now</Link></li>
            <li>
              <a href={SITE.portalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-700">
                Candidate Portal
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Employers</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link to="/employers" className="hover:text-brand-700">Request Talent</Link></li>
            <li><Link to="/contact" className="hover:text-brand-700">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Get in touch</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li className="flex items-start gap-2">
              <Icon.MapPin width={16} height={16} className="mt-0.5 shrink-0 text-slate-400" />
              <span>{SITE.contact.address}</span>
            </li>
            <li>
              <a href={SITE.contact.phoneHref} className="flex items-center gap-2 hover:text-brand-700">
                <Icon.Phone width={16} height={16} className="text-slate-400" /> {SITE.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.contact.email}`} className="flex items-center gap-2 hover:text-brand-700">
                <Icon.Mail width={16} height={16} className="text-slate-400" /> {SITE.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-5">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} WorkSi. All rights reserved.</p>
          <p>Licensed temporary help &amp; recruitment agency.</p>
        </div>
      </div>
    </footer>
  );
}
