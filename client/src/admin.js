const BASE = import.meta.env.VITE_API_URL || "";

async function handle(res) {
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) {
    let msg = "Request failed";
    try {
      msg = (await res.json()).error || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

function authHeaders(token, json = true) {
  const h = { Authorization: `Bearer ${token}` };
  if (json) h["Content-Type"] = "application/json";
  return h;
}

export const adminApi = {
  login: (email, password) =>
    fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(handle),

  me: (token) => fetch(`${BASE}/api/auth/me`, { headers: authHeaders(token, false) }).then(handle),

  // Applications
  listApplications: (token) =>
    fetch(`${BASE}/api/admin/applications`, { headers: authHeaders(token, false) }).then(handle),
  setApplicationStatus: (token, id, status) =>
    fetch(`${BASE}/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ status }),
    }).then(handle),
  resumeUrl: (id) => `${BASE}/api/admin/applications/${id}/resume`,
  downloadResume: async (token, app) => {
    const res = await fetch(adminApi.resumeUrl(app.id), { headers: authHeaders(token, false) });
    if (!res.ok) throw new Error("Could not download resume");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = app.resumeOriginalName || "resume";
    a.click();
    URL.revokeObjectURL(url);
  },

  // Jobs
  listJobs: (token) => fetch(`${BASE}/api/admin/jobs`, { headers: authHeaders(token, false) }).then(handle),
  createJob: (token, data) =>
    fetch(`${BASE}/api/admin/jobs`, { method: "POST", headers: authHeaders(token), body: JSON.stringify(data) }).then(handle),
  updateJob: (token, id, data) =>
    fetch(`${BASE}/api/admin/jobs/${id}`, { method: "PATCH", headers: authHeaders(token), body: JSON.stringify(data) }).then(handle),
  deleteJob: (token, id) =>
    fetch(`${BASE}/api/admin/jobs/${id}`, { method: "DELETE", headers: authHeaders(token, false) }).then(handle),

  // Contact messages
  listMessages: (token) =>
    fetch(`${BASE}/api/admin/messages`, { headers: authHeaders(token, false) }).then(handle),

  // Recruiters (ADMIN only)
  listUsers: (token) => fetch(`${BASE}/api/auth/users`, { headers: authHeaders(token, false) }).then(handle),
  createUser: (token, data) =>
    fetch(`${BASE}/api/auth/users`, { method: "POST", headers: authHeaders(token), body: JSON.stringify(data) }).then(handle),
  updateUser: (token, id, data) =>
    fetch(`${BASE}/api/auth/users/${id}`, { method: "PATCH", headers: authHeaders(token), body: JSON.stringify(data) }).then(handle),
};
