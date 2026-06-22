import { useState } from "react";
import { EMPLOYMENT_LABELS } from "../api.js";
import { Icon } from "../icons.jsx";
import Spinner from "../components/Spinner.jsx";

const BASE = import.meta.env.VITE_API_URL || "";
const STATUSES = ["NEW", "REVIEWING", "SHORTLISTED", "REJECTED", "HIRED"];

const statusColor = {
  NEW: "bg-blue-50 text-blue-700",
  REVIEWING: "bg-amber-50 text-amber-700",
  SHORTLISTED: "bg-violet-50 text-violet-700",
  REJECTED: "bg-red-50 text-red-700",
  HIRED: "bg-accent-500/10 text-accent-600",
};

export default function Admin() {
  const [token, setToken] = useState(sessionStorage.getItem("worksi_admin") || "");
  const [authed, setAuthed] = useState(Boolean(sessionStorage.getItem("worksi_admin")));
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  async function load(tok = token) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/api/admin/applications`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (res.status === 401) throw new Error("Invalid token");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setApps(data);
      setAuthed(true);
      sessionStorage.setItem("worksi_admin", tok);
    } catch (err) {
      setError(err.message);
      setAuthed(false);
      sessionStorage.removeItem("worksi_admin");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    await fetch(`${BASE}/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  if (!authed) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-sm card p-6">
          <h1 className="text-xl font-bold">Recruiter login</h1>
          <p className="mt-1 text-sm text-muted">Enter the admin token to view applications.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              load();
            }}
            className="mt-4 space-y-3"
          >
            <input
              type="password"
              className="field"
              placeholder="Admin token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? <Spinner /> : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-sm text-muted">{apps.length} total</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline" onClick={() => load()}>Refresh</button>
          <button
            className="btn-ghost"
            onClick={() => {
              sessionStorage.removeItem("worksi_admin");
              setAuthed(false);
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-brand-600"><Spinner className="h-8 w-8" /></div>
      ) : (
        <div className="mt-6 space-y-3">
          {apps.length === 0 && <p className="card p-8 text-center text-muted">No applications yet.</p>}
          {apps.map((a) => (
            <div key={a.id} className="card overflow-hidden">
              <button
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
                onClick={() => setOpenId(openId === a.id ? null : a.id)}
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-brand-900">
                    {a.firstName} {a.lastName}
                    <span className="ml-2 font-normal text-muted">{a.jobTitleSnapshot || "General application"}</span>
                  </p>
                  <p className="truncate text-sm text-muted">
                    {a.email} · {a.phone} · {EMPLOYMENT_LABELS[a.engagementType]}
                  </p>
                </div>
                <span className={`chip ${statusColor[a.status] || "bg-slate-100 text-slate-600"}`}>{a.status}</span>
              </button>

              {openId === a.id && (
                <div className="border-t border-slate-100 bg-slate-50 p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Detail label="Location" value={[a.city, a.province].filter(Boolean).join(", ")} />
                    <Detail label="Availability" value={a.availability} />
                    <Detail label="Salary expectation" value={a.salaryExpectation} />
                    <Detail label="LinkedIn" value={a.linkedin} />
                    <Detail label="Skills" value={a.skills} />
                    <Detail label="Applied" value={new Date(a.createdAt).toLocaleString()} />
                  </div>

                  {a.coverLetter && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase text-muted">Cover note</p>
                      <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{a.coverLetter}</p>
                    </div>
                  )}

                  {a.experiences?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase text-muted">Work experience</p>
                      <ul className="mt-1 space-y-1 text-sm text-slate-700">
                        {a.experiences.map((e) => (
                          <li key={e.id}>
                            <strong>{e.title}</strong> @ {e.company}
                            {e.startDate && ` (${e.startDate} – ${e.current ? "Present" : e.endDate || "?"})`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {a.education?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase text-muted">Education</p>
                      <ul className="mt-1 space-y-1 text-sm text-slate-700">
                        {a.education.map((e) => (
                          <li key={e.id}>{[e.degree, e.field, e.school, e.year].filter(Boolean).join(" · ")}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {a.resumePath && (
                      <a
                        className="btn-outline"
                        href={`${BASE}/api/admin/applications/${a.id}/resume`}
                        onClick={(e) => {
                          // attach auth via fetch+blob since <a> can't set headers
                          e.preventDefault();
                          downloadResume(a, token);
                        }}
                      >
                        <Icon.File width={16} height={16} /> Download resume
                      </a>
                    )}
                    <select
                      className="field max-w-[200px]"
                      value={a.status}
                      onChange={(e) => updateStatus(a.id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="text-sm text-slate-800">{value}</p>
    </div>
  );
}

async function downloadResume(app, token) {
  const res = await fetch(`${BASE}/api/admin/applications/${app.id}/resume`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return alert("Could not download resume");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = app.resumeOriginalName || "resume";
  a.click();
  URL.revokeObjectURL(url);
}
