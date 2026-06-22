import { useEffect, useState } from "react";
import { adminApi } from "../../admin.js";
import { EMPLOYMENT_LABELS } from "../../api.js";
import { Icon } from "../../icons.jsx";
import Spinner from "../Spinner.jsx";
import JobForm from "./JobForm.jsx";
import { useToast } from "../Toast.jsx";

export default function JobsTab({ token, onAuthError }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // job object or {} for new
  const [error, setError] = useState("");
  const toast = useToast();

  function fail(err) {
    if (err.message === "UNAUTHORIZED") return onAuthError();
    setError(err.message);
    toast(err.message || "Something went wrong", "error");
  }

  function load() {
    setLoading(true);
    adminApi.listJobs(token).then(setJobs).catch(fail).finally(() => setLoading(false));
  }
  useEffect(load, [token]);

  async function save(data) {
    const editingId = editing?.id;
    if (editingId) await adminApi.updateJob(token, editingId, data);
    else await adminApi.createJob(token, data);
    setEditing(null);
    load();
    toast(editingId ? "Job updated" : "Job created");
  }

  async function remove(job) {
    if (!confirm(`Delete "${job.title}"? Applications already received will be kept but unlinked.`)) return;
    try {
      await adminApi.deleteJob(token, job.id);
      load();
      toast("Job deleted");
    } catch (err) {
      fail(err);
    }
  }

  async function toggle(job, field) {
    try {
      const updated = await adminApi.updateJob(token, job.id, { [field]: !job[field] });
      setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, ...updated } : j)));
    } catch (err) {
      fail(err);
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-brand-600" /></div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{jobs.length} job{jobs.length === 1 ? "" : "s"} total</p>
        <button className="btn-primary" onClick={() => setEditing({})}>
          <Icon.Plus width={18} height={18} /> New job
        </button>
      </div>

      {error && <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="overflow-x-auto card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Apps</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-brand-900">{j.title}</p>
                  <p className="text-xs text-muted">{j.location} · {j.category}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{EMPLOYMENT_LABELS[j.employmentType]}</td>
                <td className="px-4 py-3 text-slate-600">{j._count?.applications ?? 0}</td>
                <td className="px-4 py-3">
                  <Toggle on={j.isActive} onClick={() => toggle(j, "isActive")} />
                </td>
                <td className="px-4 py-3">
                  <Toggle on={j.featured} onClick={() => toggle(j, "featured")} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button className="btn-ghost px-2" onClick={() => setEditing(j)} aria-label="Edit">Edit</button>
                    <button className="btn-ghost px-2 text-red-600 hover:bg-red-50" onClick={() => remove(j)} aria-label="Delete">
                      <Icon.Trash width={16} height={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted">No jobs yet. Create your first one.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && <JobForm initial={editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? "bg-success-500" : "bg-slate-300"}`}
      aria-pressed={on}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${on ? "translate-x-5" : "translate-x-1"}`} />
    </button>
  );
}
