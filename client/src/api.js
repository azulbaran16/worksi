const BASE = import.meta.env.VITE_API_URL || "";

async function handle(res) {
  if (!res.ok) {
    let msg = "Request failed";
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  listJobs: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v)
    ).toString();
    return fetch(`${BASE}/api/jobs${qs ? `?${qs}` : ""}`).then(handle);
  },
  getCategories: () => fetch(`${BASE}/api/jobs/categories`).then(handle),
  suggest: (q) =>
    fetch(`${BASE}/api/jobs/suggest?q=${encodeURIComponent(q || "")}`).then(handle),
  getJob: (slug) => fetch(`${BASE}/api/jobs/${slug}`).then(handle),
  submitApplication: (formData) =>
    fetch(`${BASE}/api/applications`, { method: "POST", body: formData }).then(handle),
  submitContact: (payload) =>
    fetch(`${BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handle),
};

export const EMPLOYMENT_LABELS = {
  TEMPORARY: "Temporary",
  TEMP_TO_PERM: "Temp-to-Perm",
  PERMANENT: "Permanent",
};
