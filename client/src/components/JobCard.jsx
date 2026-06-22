import { Link } from "react-router-dom";
import { Icon } from "../icons.jsx";
import { EMPLOYMENT_LABELS } from "../api.js";

const typeStyles = {
  TEMPORARY: "bg-amber-50 text-amber-700",
  TEMP_TO_PERM: "bg-violet-50 text-violet-700",
  PERMANENT: "bg-success-500/10 text-success-600",
};

export default function JobCard({ job }) {
  return (
    <Link
      to={`/jobs/${job.slug}`}
      className="card group flex h-full flex-col gap-3 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold leading-snug text-brand-900 group-hover:text-brand-700">
            {job.title}
          </h3>
          <p className="mt-0.5 text-sm font-medium text-muted">{job.category}</p>
        </div>
        {job.featured && (
          <span className="chip bg-brand-50 text-brand-700">
            <Icon.Star width={12} height={12} /> Featured
          </span>
        )}
      </div>

      <p className="line-clamp-2 text-sm text-muted">{job.summary}</p>

      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <Icon.MapPin width={16} height={16} className="text-slate-400" />
          {job.location}
        </span>
        {job.payRange && (
          <span className="inline-flex items-center gap-1.5">
            <Icon.Dollar width={16} height={16} className="text-slate-400" />
            {job.payRange}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className={`chip ${typeStyles[job.employmentType] || "bg-slate-100 text-slate-600"}`}>
          {EMPLOYMENT_LABELS[job.employmentType] || job.employmentType}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
          View &amp; Apply <Icon.ArrowRight width={16} height={16} />
        </span>
      </div>
    </Link>
  );
}
