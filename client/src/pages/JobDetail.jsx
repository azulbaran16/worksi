import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, EMPLOYMENT_LABELS } from "../api.js";
import { Icon } from "../icons.jsx";
import Spinner from "../components/Spinner.jsx";

export default function JobDetail() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    api
      .getJob(slug)
      .then((j) => {
        setJob(j);
        setStatus("ok");
      })
      .catch(() => setStatus("notfound"));
  }, [slug]);

  if (status === "loading")
    return (
      <div className="flex justify-center py-32 text-brand-600">
        <Spinner className="h-8 w-8" />
      </div>
    );

  if (status === "notfound")
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">Job not found</h1>
        <p className="mt-2 text-muted">This position may have been filled.</p>
        <Link to="/jobs" className="btn-primary mt-6 inline-flex">Browse open jobs</Link>
      </div>
    );

  const requirements = (job.requirements || "")
    .split(";")
    .map((r) => r.trim())
    .filter(Boolean);

  return (
    <div className="container-page py-10">
      <Link to="/jobs" className="btn-ghost mb-4 inline-flex px-0 text-sm">
        <Icon.ArrowLeft width={16} height={16} /> All jobs
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="chip bg-brand-50 text-brand-700">{job.category}</span>
          <h1 className="mt-3 text-3xl font-bold">{job.title}</h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5"><Icon.MapPin width={16} height={16} className="text-slate-400" />{job.location}</span>
            <span className="inline-flex items-center gap-1.5"><Icon.Briefcase width={16} height={16} className="text-slate-400" />{EMPLOYMENT_LABELS[job.employmentType]}</span>
            {job.payRange && <span className="inline-flex items-center gap-1.5"><Icon.Dollar width={16} height={16} className="text-slate-400" />{job.payRange}</span>}
          </div>

          <div className="prose-sm mt-8 max-w-none">
            <h2 className="text-xl font-bold">About the role</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-700">{job.description}</p>

            {requirements.length > 0 && (
              <>
                <h2 className="mt-8 text-xl font-bold">What we're looking for</h2>
                <ul className="mt-3 space-y-2">
                  {requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <Icon.Check width={18} height={18} className="mt-0.5 shrink-0 text-accent-600" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Apply card */}
        <aside className="lg:col-span-1">
          <div className="card sticky top-20 p-6">
            <p className="text-sm text-muted">Interested in this role?</p>
            <p className="mt-1 text-lg font-bold text-brand-900">Apply in minutes</p>
            <p className="mt-2 text-sm text-muted">
              Upload your resume and add your experience. Our recruiters review every application.
            </p>
            <Link to={`/apply/${job.slug}`} className="btn-primary mt-5 w-full">
              Apply for this job <Icon.ArrowRight width={18} height={18} />
            </Link>
            <Link to="/jobs" className="btn-ghost mt-2 w-full">See other jobs</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
