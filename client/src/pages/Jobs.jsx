import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, EMPLOYMENT_LABELS } from "../api.js";
import { Icon } from "../icons.jsx";
import JobCard from "../components/JobCard.jsx";
import Reveal from "../components/Reveal.jsx";
import Autocomplete from "../components/Autocomplete.jsx";
import { jobSuggestLoader, SuggestionRow } from "../components/jobSuggest.jsx";
import useDocumentTitle from "../useDocumentTitle.js";

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
  useDocumentTitle("Find Jobs");
  const [params, setParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = params.get("search") || "";
  const type = params.get("type") || "";
  const category = params.get("category") || "";
  const sort = params.get("sort") || "";
  const hasFilters = Boolean(search || type || category || sort);

  const sortedJobs = (() => {
    const arr = [...jobs];
    if (sort === "az") arr.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "za") arr.sort((a, b) => b.title.localeCompare(a.title));
    return arr; // default: backend order (featured first, newest)
  })();

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

  function clearFilters() {
    setParams(new URLSearchParams());
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">Open positions</h1>
      <p className="mt-1 text-muted">Apply directly to any role — it only takes a few minutes.</p>

      {/* Filters */}
      <div className="card mt-6 grid gap-3 p-4 sm:grid-cols-3">
        <Autocomplete
          className="sm:col-span-1"
          icon={Icon.Search}
          placeholder="Search title, category, city"
          aria-label="Search jobs"
          value={search}
          onChange={(t) => update("search", t)}
          loadOptions={jobSuggestLoader}
          onSelect={(opt) => update("search", opt.value)}
          renderOption={SuggestionRow}
        />
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
        <select className="field" value={sort} onChange={(e) => update("sort", e.target.value)} aria-label="Sort by">
          <option value="">Sort: Recommended</option>
          <option value="az">Title: A–Z</option>
          <option value="za">Title: Z–A</option>
        </select>
        {hasFilters && (
          <button type="button" className="btn-ghost justify-self-start sm:col-span-3" onClick={clearFilters}>
            <Icon.X width={16} height={16} /> Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      <div className="mt-6">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : sortedJobs.length === 0 ? (
          <div className="card p-10 text-center text-muted">
            <p className="font-semibold text-slate-700">No jobs match your filters.</p>
            <p className="mt-1 text-sm">Try a different search or clear your filters — we post new roles daily.</p>
            {hasFilters && (
              <button type="button" className="btn-primary mt-5" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted">{sortedJobs.length} job{sortedJobs.length === 1 ? "" : "s"} found</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sortedJobs.map((job, i) => (
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
