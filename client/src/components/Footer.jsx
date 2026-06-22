import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">
            Connecting people with the right opportunities across Canada. Fully licensed for
            temporary help and recruitment services.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Job Seekers</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link to="/jobs" className="hover:text-brand-700">Find Jobs</Link></li>
            <li><Link to="/apply" className="hover:text-brand-700">Apply Now</Link></li>
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
            <li><a href="mailto:info@worksi.net" className="hover:text-brand-700">info@worksi.net</a></li>
            <li>Ontario, Canada</li>
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
