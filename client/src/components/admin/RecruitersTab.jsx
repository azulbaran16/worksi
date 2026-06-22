import { useEffect, useState } from "react";
import { adminApi } from "../../admin.js";
import { Icon } from "../../icons.jsx";
import Spinner from "../Spinner.jsx";

export default function RecruitersTab({ token, onAuthError }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "RECRUITER" });
  const [error, setError] = useState("");

  function fail(err) {
    if (err.message === "UNAUTHORIZED") return onAuthError();
    setError(err.message);
  }

  function load() {
    setLoading(true);
    adminApi.listUsers(token).then(setUsers).catch(fail).finally(() => setLoading(false));
  }
  useEffect(load, [token]);

  async function add(e) {
    e.preventDefault();
    setError("");
    try {
      await adminApi.createUser(token, form);
      setForm({ name: "", email: "", password: "", role: "RECRUITER" });
      setAdding(false);
      load();
    } catch (err) {
      fail(err);
    }
  }

  async function toggleActive(u) {
    try {
      const updated = await adminApi.updateUser(token, u.id, { active: !u.active });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
    } catch (err) {
      fail(err);
    }
  }

  async function resetPassword(u) {
    const pw = prompt(`New password for ${u.email} (min 8 characters):`);
    if (!pw) return;
    try {
      await adminApi.updateUser(token, u.id, { password: pw });
      alert("Password updated.");
    } catch (err) {
      fail(err);
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-brand-600" /></div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{users.length} recruiter{users.length === 1 ? "" : "s"}</p>
        <button className="btn-primary" onClick={() => setAdding((v) => !v)}>
          <Icon.Plus width={18} height={18} /> Add recruiter
        </button>
      </div>

      {error && <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {adding && (
        <form onSubmit={add} className="card mb-4 grid gap-3 p-4 sm:grid-cols-2">
          <input className="field" placeholder="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <input type="email" className="field" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          <input type="password" className="field" placeholder="Temporary password (min 8)" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
          <select className="field" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
            <option value="RECRUITER">Recruiter</option>
            <option value="ADMIN">Admin</option>
          </select>
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" className="btn-outline" onClick={() => setAdding(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Create</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`chip ${u.role === "ADMIN" ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-600"}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`chip ${u.active ? "bg-accent-500/10 text-accent-600" : "bg-red-50 text-red-700"}`}>
                    {u.active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button className="btn-ghost px-2" onClick={() => resetPassword(u)}>Reset password</button>
                    <button className="btn-ghost px-2" onClick={() => toggleActive(u)}>{u.active ? "Disable" : "Enable"}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
