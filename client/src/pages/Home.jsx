import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { Icon } from "../icons.jsx";
import JobCard from "../components/JobCard.jsx";

const stats = [
  { value: "4,000+", label: "Successful placements" },
  { value: "100+", label: "Applications a day" },
  { value: "24h", label: "Typical first response" },
];

const categories = [
  "Warehouse & Logistics",
  "Manufacturing",
  "Skilled Trades",
  "Office & Administration",
  "Accounting & Finance",
  "Customer Service",
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.listJobs().then((jobs) => setFeatured(jobs.slice(0, 6))).catch(() => {});
  }, []);

  function onSearch(e) {
    e.preventDefault();
    navigate(`/jobs${search ? `?search=${encodeURIComponent(search)}` : ""}`);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #3377f6 0, transparent 40%), radial-gradient(circle at 80% 0%, #10b981 0, transparent 35%)" }} />
        <div className="container-page relative py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="chip bg-white/10 text-brand-100">
              <Icon.Shield width={14} height={14} /> Licensed staffing &amp; recruitment
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Find your next job in minutes — not weeks.
            </h1>
            <p className="mt-4 text-lg text-brand-100">
              WorkSi connects you with temporary, temp-to-perm and permanent roles across Canada.
              Apply directly to any job with one simple, guided application.
            </p>

            <form onSubmit={onSearch} className="mt-8 flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon.Search />
                </span>
                <input
                  className="field h-[52px] pl-11 text-base"
                  placeholder="Job title, skill or city"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search jobs"
                />
              </div>
              <button type="submit" className="btn-accent h-[52px] px-7 text-base">
                Search jobs
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/apply" className="btn-primary bg-white text-brand-800 hover:bg-brand-50">
                Apply now <Icon.ArrowRight width={18} height={18} />
              </Link>
              <Link to="/employers" className="btn-outline border-white/30 bg-transparent text-white hover:bg-white/10">
                I'm hiring
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page grid grid-cols-3 gap-4 py-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-extrabold text-brand-900 sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured jobs */}
      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Featured opportunities</h2>
            <p className="mt-1 text-muted">Hand-picked roles hiring right now.</p>
          </div>
          <Link to="/jobs" className="btn-ghost hidden sm:inline-flex">
            View all jobs <Icon.ArrowRight width={18} height={18} />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link to="/jobs" className="btn-outline">View all jobs</Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-16">
        <div className="container-page">
          <h2 className="text-2xl font-bold sm:text-3xl">Browse by category</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c}
                to={`/jobs?category=${encodeURIComponent(c)}`}
                className="card flex items-center justify-between p-4 transition-shadow hover:shadow-lift"
              >
                <span className="flex items-center gap-3 font-semibold text-brand-900">
                  <Icon.Briefcase className="text-brand-500" /> {c}
                </span>
                <Icon.ArrowRight width={18} height={18} className="text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { icon: Icon.Search, title: "1. Find a job", text: "Search live openings and pick the role that fits you." },
            { icon: Icon.Upload, title: "2. Apply directly", text: "Upload your resume, add your experience — done in minutes." },
            { icon: Icon.Users, title: "3. Get matched", text: "Our recruiters review and connect you with the employer." },
          ].map((s) => (
            <div key={s.title} className="card p-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <s.icon />
              </span>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="rounded-2xl bg-brand-900 px-8 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to take the next step?</h2>
          <p className="mx-auto mt-2 max-w-xl text-brand-100">
            Submit one application and let our team match you with the right opportunity.
          </p>
          <Link to="/apply" className="btn-accent mt-6 inline-flex">
            Start your application <Icon.ArrowRight width={18} height={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
