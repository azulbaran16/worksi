import { Icon } from "../icons.jsx";

const emptyExp = () => ({
  company: "",
  title: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
});

export default function ExperienceEditor({ items, onChange }) {
  function update(index, patch) {
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }
  function add() {
    onChange([...items, emptyExp()]);
  }
  function remove(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-muted">
          No work experience added yet. Add your most recent roles below — this helps employers match you faster.
        </p>
      )}

      {items.map((exp, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700">Position {i + 1}</h4>
            <button
              type="button"
              className="btn-ghost px-2 text-slate-500 hover:text-red-600"
              onClick={() => remove(i)}
              aria-label={`Remove position ${i + 1}`}
            >
              <Icon.Trash width={18} height={18} />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Job title</label>
              <input
                className="field"
                value={exp.title}
                onChange={(e) => update(i, { title: e.target.value })}
                placeholder="e.g. Forklift Operator"
              />
            </div>
            <div>
              <label className="label">Company</label>
              <input
                className="field"
                value={exp.company}
                onChange={(e) => update(i, { company: e.target.value })}
                placeholder="e.g. ABC Logistics"
              />
            </div>
            <div>
              <label className="label">Location</label>
              <input
                className="field"
                value={exp.location}
                onChange={(e) => update(i, { location: e.target.value })}
                placeholder="City, Province"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Start</label>
                <input
                  type="month"
                  className="field"
                  value={exp.startDate}
                  onChange={(e) => update(i, { startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="label">End</label>
                <input
                  type="month"
                  className="field disabled:bg-slate-100"
                  value={exp.endDate}
                  disabled={exp.current}
                  onChange={(e) => update(i, { endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              checked={exp.current}
              onChange={(e) => update(i, { current: e.target.checked, endDate: "" })}
            />
            I currently work here
          </label>

          <div className="mt-3">
            <label className="label">What did you do? (optional)</label>
            <textarea
              className="field min-h-[80px]"
              value={exp.description}
              onChange={(e) => update(i, { description: e.target.value })}
              placeholder="Key responsibilities and achievements"
            />
          </div>
        </div>
      ))}

      <button type="button" className="btn-outline w-full" onClick={add}>
        <Icon.Plus width={18} height={18} /> Add {items.length ? "another " : ""}work experience
      </button>
    </div>
  );
}
