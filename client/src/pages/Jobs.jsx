import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, EMPLOYMENT_LABELS } from "../api.js";
import { Icon } from "../icons.jsx";
import JobCard from "../components/JobCard.jsx";
import Reveal from "../components/Reveal.jsx";

function JobCardSkeleton() {
  return (
    <div className="card flex flex-col gap-3 p-5">
      <div className="skeleton h-5 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/3 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-5/6 rounded" />
      <div className="mt-2 flex justify-between">
        <div className="skeleton h-6 w-24 rounded-full" />
        <div className="skeleton h-4 w-20 rounded" />
      </div>
    </div>
  );
}

export default function Jobs() {
  const [params, setParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = params.get("search") || "";
  const type = params.get("type") || "";
  const category = params.get("category") || "";

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .listJobs({ search, type, category })
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [search, type, category]);

  function update(key, value) {
    const nextParams = new URLSearchParams(params);
    if (value) nextParams.set(key, value);
    else nextParams.delete(key);
    setParams(nextParams);
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">Open positions</h1>
      <p className="mt-1 text-muted">Apply directly to any role — it only takes a few minutes.</p>

      {/* Filters */}
      <div className="card mt-6 grid gap-3 p-4 sm:grid-cols-3">
        <div className="relative sm:col-span-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon.Search width={18} height={18} />
          </span>
          <input
            className="field pl-10"
            placeholder="Search title, skill, city"
            defaultValue={search}
            onChange={(e) => update("search", e.target.value)}
            aria-label="Search jobs"
          />
        </div>
        <select className="field" value={type} onChange={(e) => update("type", e.target.value)} aria-label="Employment type">
          <option value="">All types</option>
          {Object.entries(EMPLOYMENT_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select className="field" value={category} onChange={(e) => update("category", e.target.value)} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="mt-6">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="card p-10 text-center text-muted">
            <p className="font-semibold text-slate-700">No jobs match your filters.</p>
            <p className="mt-1 text-sm">Try clearing filters or check back soon — we post new roles daily.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted">{jobs.length} job{jobs.length === 1 ? "" : "s"} found</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job, i) => (
                <Reveal key={job.id} delay={(i % 3) * 70}>
                  <JobCard job={job} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
