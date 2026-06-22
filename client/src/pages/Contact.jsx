import { useState } from "react";
import { api } from "../api.js";
import { Icon } from "../icons.jsx";
import Spinner from "../components/Spinner.jsx";

export default function Contact() {
  const [form, setForm] = useState({ type: "candidate", name: "", email: "", phone: "", company: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    setStatus("sending");
    try {
      await api.submitContact(form);
      setStatus("sent");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  if (status === "sent")
    return (
      <div className="container-page py-20 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/10 text-accent-600">
          <Icon.Check width={32} height={32} />
        </span>
        <h1 className="mt-5 text-2xl font-bold">Message sent</h1>
        <p className="mt-2 text-muted">Thanks for reaching out — we'll get back to you shortly.</p>
      </div>
    );

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold sm:text-3xl">Contact us</h1>
        <p className="mt-1 text-muted">Questions about a job or hiring? Send us a message.</p>

        <form onSubmit={submit} className="card mt-6 space-y-4 p-6">
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
