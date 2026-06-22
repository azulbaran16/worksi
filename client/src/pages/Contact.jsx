import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import { Icon } from "../icons.jsx";
import Spinner from "../components/Spinner.jsx";
import Honeypot from "../components/Honeypot.jsx";
import useDocumentTitle from "../useDocumentTitle.js";
import { SITE } from "../config.js";

export default function Contact() {
  useDocumentTitle(
    "Contact",
    "Get in touch with WorkSi about jobs or hiring. Head office in Mississauga, Ontario."
  );
  const [params] = useSearchParams();
  const initialType = params.get("type") === "employer" ? "employer" : "candidate";
  const [form, setForm] = useState({ type: initialType, name: "", email: "", phone: "", company: "", message: "" });
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    setStatus("sending");
    try {
      await api.submitContact({ ...form, company_website: hp });
      setStatus("sent");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  if (status === "sent")
    return (
      <div className="container-page py-20 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-500/10 text-success-600">
          <Icon.Check width={32} height={32} />
        </span>
        <h1 className="mt-5 text-2xl font-bold">Message sent</h1>
        <p className="mt-2 text-muted">Thanks for reaching out — we'll get back to you shortly.</p>
      </div>
    );

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Contact us</h1>
        <p className="mt-1 text-muted">
          Contact us to learn more about our business and how we can help each other.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Contact details + map */}
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="text-lg font-bold">Head office</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Icon.MapPin width={18} height={18} /></span>
                <span className="text-slate-700">{SITE.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Icon.Phone width={18} height={18} /></span>
                <a href={SITE.contact.phoneHref} className="text-slate-700 hover:text-brand-700">{SITE.contact.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Icon.Mail width={18} height={18} /></span>
                <a href={`mailto:${SITE.contact.email}`} className="text-slate-700 hover:text-brand-700">{SITE.contact.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Icon.Clock width={18} height={18} /></span>
                <span className="text-slate-700">{SITE.contact.hours}</span>
              </li>
            </ul>
          </div>
          <div className="card overflow-hidden">
            <iframe
              title="WorkSi head office map"
              className="h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="card space-y-4 self-start p-6">
          <Honeypot value={hp} onChange={setHp} />
          <div>
            <label className="label">I am a…</label>
            <div className="grid grid-cols-2 gap-3">
              {[["candidate", "Job seeker"], ["employer", "Employer"]].map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set({ type: v })}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                    form.type === v ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name *</label>
              <input className="field" value={form.name} onChange={(e) => set({ name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Email *</label>
              <input type="email" className="field" value={form.email} onChange={(e) => set({ email: e.target.value })} required />
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" className="field" value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Company {form.type === "employer" && "*"}</label>
              <input className="field" value={form.company} onChange={(e) => set({ company: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="label">Message *</label>
            <textarea className="field min-h-[120px]" value={form.message} onChange={(e) => set({ message: e.target.value })} required />
          </div>

          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={status === "sending"}>
            {status === "sending" ? <Spinner /> : null}
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
}
