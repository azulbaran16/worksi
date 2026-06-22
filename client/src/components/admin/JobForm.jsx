import { useState } from "react";
import { EMPLOYMENT_LABELS } from "../../api.js";
import Spinner from "../Spinner.jsx";

const blank = {
  title: "",
  category: "",
  location: "",
  employmentType: "PERMANENT",
  payRange: "",
  summary: "",
  description: "",
  requirements: "",
  isActive: true,
  featured: false,
};

export default function JobForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({ ...blank, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!form.title || !form.category || !form.location || !form.summary || !form.description) {
      setError("Please fill in title, category, location, summary and description.");
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-8 w-full max-w-2xl card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{initial?.id ? "Edit job" : "New job"}</h2>
          <button className="btn-ghost px-2" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Job title *">
              <input className="field" value={form.title} onChange={(e) => set({ title: e.target.value })} />
            </Field>
            <Field label="Category *">
              <input className="field" value={form.category} onChange={(e) => set({ category: e.target.value })} placeholder="e.g. Warehouse & Logistics" />
            </Field>
            <Field label="Location *">
              <input className="field" value={form.location} onChange={(e) => set({ location: e.target.value })} placeholder="e.g. Mississauga, ON" />
            </Field>
            <Field label="Employment type">
              <select className="field" value={form.employmentType} onChange={(e) => set({ employmentType: e.target.value })}>
                {Object.entries(EMPLOYMENT_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label="Pay range">
              <input className="field" value={form.payRange || ""} onChange={(e) => set({ payRange: e.target.value })} placeholder="e.g. $20 - $24 / hr" />
            </Field>
          </div>

          <Field label="Short summary *">
            <input className="field" value={form.summary} onChange={(e) => set({ summary: e.target.value })} placeholder="One-line teaser shown on job cards" />
          </Field>

          <Field label="Full description *">
            <textarea className="field min-h-[120px]" value={form.description} onChange={(e) => set({ description: e.target.value })} />
          </Field>

          <Field label="Requirements (separate each with a semicolon ;)">
            <textarea
              className="field min-h-[80px]"
              value={form.requirements || ""}
              onChange={(e) => set({ requirements: e.target.value })}
              placeholder="Valid forklift licence; 1+ year experience; Able to lift 50 lbs"
            />
          </Field>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600" checked={form.isActive} onChange={(e) => set({ isActive: e.target.checked })} />
              Active (visible on site)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600" checked={form.featured} onChange={(e) => set({ featured: e.target.checked })} />
              Featured
            </label>
          </div>

          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <div className="flex justify-end gap-3">
            <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <Spinner /> : null} {initial?.id ? "Save changes" : "Create job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
