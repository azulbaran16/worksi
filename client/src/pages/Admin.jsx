import { useState } from "react";
import { adminApi } from "../admin.js";
import Spinner from "../components/Spinner.jsx";
import ApplicationsTab from "../components/admin/ApplicationsTab.jsx";
import JobsTab from "../components/admin/JobsTab.jsx";
import MessagesTab from "../components/admin/MessagesTab.jsx";
import RecruitersTab from "../components/admin/RecruitersTab.jsx";

const STORE_KEY = "worksi_session";

function loadSession() {
  try {
    return JSON.parse(sessionStorage.getItem(STORE_KEY) || "null");
  } catch {
    return null;
  }
}

export default function Admin() {
  const [session, setSession] = useState(loadSession);
  const [tab, setTab] = useState("applications");

  function signOut() {
    sessionStorage.removeItem(STORE_KEY);
    setSession(null);
  }

  function onAuthError() {
    // token expired/invalid anywhere -> force re-login
    signOut();
  }

  if (!session) return <Login onLogin={(s) => { sessionStorage.setItem(STORE_KEY, JSON.stringify(s)); setSession(s); }} />;

  const isAdmin = session.user.role === "ADMIN";
  const tabs = [
    { key: "applications", label: "Applications" },
    { key: "jobs", label: "Jobs" },
    { key: "messages", label: "Messages" },
    ...(isAdmin ? [{ key: "recruiters", label: "Recruiters" }] : []),
  ];

  return (
    <div className="container-page py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Recruiter dashboard</h1>
          <p className="text-sm text-muted">
            Signed in as {session.user.name} ({session.user.role.toLowerCase()})
          </p>
        </div>
        <button className="btn-ghost" onClick={signOut}>Sign out</button>
      </div>

      <div className="mt-5 flex gap-1 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.key
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-slate-500 hover:text-brand-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "applications" && <ApplicationsTab token={session.token} onAuthError={onAuthError} />}
        {tab === "jobs" && <JobsTab token={session.token} onAuthError={onAuthError} />}
        {tab === "messages" && <MessagesTab token={session.token} onAuthError={onAuthError} />}
        {tab === "recruiters" && isAdmin && <RecruitersTab token={session.token} onAuthError={onAuthError} />}
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await adminApi.login(email, password);
      onLogin({ token, user });
    } catch (err) {
      setError(err.message === "UNAUTHORIZED" ? "Invalid credentials." : err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-20">
      <div className="mx-auto max-w-sm card p-6">
        <h1 className="text-xl font-bold">Recruiter sign in</h1>
        <p className="mt-1 text-sm text-muted">Access the WorkSi dashboard.</p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <label className="label">Email</label>
            <input type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? <Spinner /> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
