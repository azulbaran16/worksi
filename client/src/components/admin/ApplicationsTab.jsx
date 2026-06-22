import { useEffect, useState } from "react";
import { adminApi } from "../../admin.js";
import { EMPLOYMENT_LABELS } from "../../api.js";
import { Icon } from "../../icons.jsx";
import Spinner from "../Spinner.jsx";

const STATUSES = ["NEW", "REVIEWING", "SHORTLISTED", "REJECTED", "HIRED"];
const statusColor = {
  NEW: "bg-blue-50 text-blue-700",
  REVIEWING: "bg-amber-50 text-amber-700",
  SHORTLISTED: "bg-violet-50 text-violet-700",
  REJECTED: "bg-red-50 text-red-700",
  HIRED: "bg-success-500/10 text-success-600",
};

export default function ApplicationsTab({ token, onAuthError }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  function fail(err) {
    if (err.message === "UNAUTHORIZED") onAuthError();
  }

  function load() {
    setLoading(true);
    adminApi.listApplications(token).then(setApps).catch(fail).finally(() => setLoading(false));
  }
  useEffect(load, [token]);

  async function setStatus(id, status) {
    try {
      await adminApi.setApplicationStatus(token, id, status);
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err) {
      fail(err);
    }
  }

  if (loading) return <Center><Spinner className="h-8 w-8 text-brand-600" /></Center>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{apps.length} application{apps.length === 1 ? "" : "s"}</p>
        <button className="btn-outline" onClick={load}>Refresh</button>
      </div>

      {apps.length === 0 && <p className="card p-8 text-center text-muted">No applications yet.</p>}

      <div className="space-y-3">
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
                  <Block title="Cover note">
                    <p className="whitespace-pre-line text-sm text-slate-700">{a.coverLetter}</p>
                  </Block>
                )}

                {a.experiences?.length > 0 && (
                  <Block title="Work experience">
                    <ul className="space-y-1 text-sm text-slate-700">
                      {a.experiences.map((e) => (
                        <li key={e.id}>
                          <strong>{e.title}</strong> @ {e.company}
                          {e.startDate && ` (${e.startDate} – ${e.current ? "Present" : e.endDate || "?"})`}
                        </li>
                      ))}
                    </ul>
                  </Block>
                )}

                {a.education?.length > 0 && (
                  <Block title="Education">
                    <ul className="space-y-1 text-sm text-slate-700">
                      {a.education.map((e) => (
                        <li key={e.id}>{[e.degree, e.field, e.school, e.year].filter(Boolean).join(" · ")}</li>
                      ))}
                    </ul>
                  </Block>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {a.resumePath && (
                    <button className="btn-outline" onClick={() => adminApi.downloadResume(token, a).catch(fail)}>
                      <Icon.File width={16} height={16} /> Download resume
                    </button>
                  )}
                  <select className="field max-w-[200px]" value={a.status} onChange={(e) => setStatus(a.id, e.target.value)}>
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
    </div>
  );
}

const Center = ({ children }) => <div className="flex justify-center py-20">{children}</div>;
const Block = ({ title, children }) => (
  <div className="mt-3">
    <p className="text-xs font-semibold uppercase text-muted">{title}</p>
    <div className="mt-1">{children}</div>
  </div>
);
function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="text-sm text-slate-800">{value}</p>
    </div>
  );
}
