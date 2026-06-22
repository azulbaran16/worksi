import { Icon } from "../icons.jsx";

const emptyEdu = () => ({ school: "", degree: "", field: "", year: "" });

export default function EducationEditor({ items, onChange }) {
  function update(index, patch) {
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }
  function add() {
    onChange([...items, emptyEdu()]);
  }
  function remove(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {items.map((edu, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700">Education {i + 1}</h4>
            <button
              type="button"
              className="btn-ghost px-2 text-slate-500 hover:text-red-600"
              onClick={() => remove(i)}
              aria-label={`Remove education ${i + 1}`}
            >
              <Icon.Trash width={18} height={18} />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">School / Institution</label>
              <input
                className="field"
                value={edu.school}
                onChange={(e) => update(i, { school: e.target.value })}
                placeholder="e.g. Seneca College"
              />
            </div>
            <div>
              <label className="label">Credential</label>
              <input
                className="field"
                value={edu.degree}
                onChange={(e) => update(i, { degree: e.target.value })}
                placeholder="e.g. Diploma, Certificate"
              />
            </div>
            <div>
              <label className="label">Field of study</label>
              <input
                className="field"
                value={edu.field}
                onChange={(e) => update(i, { field: e.target.value })}
                placeholder="e.g. Supply Chain"
              />
            </div>
            <div>
              <label className="label">Year completed</label>
              <input
                className="field"
                value={edu.year}
                onChange={(e) => update(i, { year: e.target.value })}
                placeholder="e.g. 2021"
              />
            </div>
          </div>
        </div>
      ))}

      <button type="button" className="btn-outline w-full" onClick={add}>
        <Icon.Plus width={18} height={18} /> Add education
      </button>
    </div>
  );
}
