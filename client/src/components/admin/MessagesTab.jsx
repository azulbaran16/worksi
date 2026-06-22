import { useEffect, useState } from "react";
import { adminApi } from "../../admin.js";
import { Icon } from "../../icons.jsx";
import Spinner from "../Spinner.jsx";
import { useToast } from "../Toast.jsx";

export default function MessagesTab({ token, onAuthError }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const toast = useToast();

  function fail(err) {
    if (err.message === "UNAUTHORIZED") return onAuthError();
    toast(err.message || "Something went wrong", "error");
  }

  function load() {
    setLoading(true);
    adminApi.listMessages(token).then(setMessages).catch(fail).finally(() => setLoading(false));
  }
  useEffect(load, [token]);

  const filtered = filter === "all" ? messages : messages.filter((m) => m.type === filter);

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-brand-600" /></div>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1">
          {[
            ["all", "All"],
            ["candidate", "Job seekers"],
            ["employer", "Employers"],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === v ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <button className="btn-outline" onClick={load}>Refresh</button>
      </div>

      {filtered.length === 0 && <p className="card p-8 text-center text-muted">No messages yet.</p>}

      <div className="space-y-3">
        {filtered.map((m) => (
          <div key={m.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-brand-900">{m.name}</span>
                <span className={`chip ${m.type === "employer" ? "bg-brand-50 text-brand-700" : "bg-success-500/10 text-success-600"}`}>
                  {m.type === "employer" ? "Employer" : "Job seeker"}
                </span>
              </div>
              <span className="text-xs text-muted">{new Date(m.createdAt).toLocaleString()}</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-brand-700">
                <Icon.Mail width={14} height={14} /> {m.email}
              </a>
              {m.phone && (
                <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:text-brand-700">
                  <Icon.Phone width={14} height={14} /> {m.phone}
                </a>
              )}
              {m.company && <span className="inline-flex items-center gap-1"><Icon.Briefcase width={14} height={14} /> {m.company}</span>}
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-slate-700">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
