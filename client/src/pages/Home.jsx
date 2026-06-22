import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { Icon } from "../icons.jsx";
import JobCard from "../components/JobCard.jsx";
import HeroArt from "../components/HeroArt.jsx";
import { CategoryArt } from "../components/CategoryArt.jsx";
import Avatar from "../components/Avatar.jsx";
import Reveal from "../components/Reveal.jsx";
import Counter from "../components/Counter.jsx";

const stats = [
  { to: 4000, suffix: "+", label: "Successful placements" },
  { to: 100, suffix: "+", label: "Applications a day" },
  { to: 24, suffix: "h", label: "Typical first response" },
];

const categories = [
  "Warehouse & Logistics",
  "Manufacturing",
  "Skilled Trades",
  "Office & Administration",
  "Accounting & Finance",
  "Customer Service",
];

const values = [
  { icon: Icon.Shield, title: "Transparent", text: "Honest, upfront communication at every step — no surprises." },
  { icon: Icon.Users, title: "Authentic", text: "Real relationships built between candidates and businesses." },
  { icon: Icon.Clock, title: "Speedy", text: "We recruit and onboard daily, so we respond fast when you need us." },
];

const paths = [
  { title: "Temporary", text: "You're an agency employee paid by WorkSi — ideal for flexibility and getting started quickly." },
  { title: "Temporary-to-Permanent", text: "Start temporary with the potential to convert into a direct hire with the company." },
  { title: "Permanent", text: "Go through the full hiring process and become a direct employee of the company." },
];

// Replace these with real client/candidate reviews when available.
const testimonials = [
  {
    quote:
      "WorkSi found me a role within days. The team genuinely cared and kept me informed the whole way through. I felt supported from the first call.",
    name: "Maria G.",
    role: "Warehouse Associate",
  },
  {
    quote:
      "Professional, responsive and reliable. They understood exactly the kind of people we needed and delivered qualified candidates fast.",
    name: "David L.",
    role: "Operations Manager",
  },
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
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #2f6fb5 0, transparent 40%), radial-gradient(circle at 80% 0%, #f2b632 0, transparent 38%)" }} />
        <div className="container-page relative grid items-center gap-10 py-20 sm:py-24 lg:grid-cols-2">
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

          <div className="hidden justify-center lg:flex">
            <HeroArt className="w-full max-w-lg animate-float" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page grid grid-cols-3 gap-4 py-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <Counter
                to={s.to}
                suffix={s.suffix}
                className="block text-2xl font-extrabold text-brand-900 sm:text-3xl"
              />
              <p className="mt-1 text-xs text-muted sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why WorkSi (values) */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Supporting companies, empowering individuals</h2>
          <p className="mt-3 text-muted">
            We believe recruitment should be transparent, authentic and speedy — focused on quality and
            efficiency for both candidates and employers.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <div className="card h-full p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                  <v.icon />
                </span>
                <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted">{v.text}</p>
              </div>
            </Reveal>
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
          {featured.map((job, i) => (
            <Reveal key={job.id} delay={(i % 3) * 90}>
              <JobCard job={job} />
            </Reveal>
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
            {categories.map((c, i) => (
              <Reveal key={c} delay={(i % 3) * 80}>
                <Link
                  to={`/jobs?category=${encodeURIComponent(c)}`}
                  className="card flex items-center justify-between gap-3 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="flex items-center gap-3 font-semibold text-brand-900">
                    <CategoryArt category={c} className="h-11 w-11" /> {c}
                  </span>
                  <Icon.ArrowRight width={18} height={18} className="text-slate-400" />
                </Link>
              </Reveal>
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
          ].map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <div className="card h-full p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                  <s.icon />
                </span>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Choose your path */}
      <section className="bg-white py-16">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Choose your path</h2>
            <p className="mt-3 text-muted">Three ways to work with us — pick what fits your goals.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {paths.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <div className="card relative h-full overflow-hidden p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
                  <span className="absolute right-4 top-3 font-display text-5xl font-extrabold text-brand-50">
                    {i + 1}
                  </span>
                  <h3 className="relative text-lg font-bold text-brand-900">{p.title}</h3>
                  <p className="relative mt-2 text-sm text-muted">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/apply" className="btn-primary">
              Start your application <Icon.ArrowRight width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Our approach */}
      <section className="container-page py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="chip bg-success-500/10 text-success-600">Our approach</span>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">A ready talent pool, every single day</h2>
            <p className="mt-4 text-muted">
              We don't wait for a job to start recruiting. We proactively recruit and onboard candidates
              daily, maintaining one of the largest candidate databases across industries — so when an
              employer needs people, we can respond fast.
            </p>
            <ul className="mt-5 space-y-2">
              {[
                "Daily recruiting & onboarding",
                "Pre-screened, reference-checked candidates",
                "Coverage across multiple industries",
                "Rapid response when you need talent",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-slate-700">
                  <Icon.Check width={18} height={18} className="mt-0.5 shrink-0 text-success-600" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="card p-6 text-center">
                <Counter to={s.to} suffix={s.suffix} className="block text-2xl font-extrabold text-brand-900" />
                <p className="mt-1 text-xs text-muted">{s.label}</p>
              </div>
            ))}
            <div className="card p-6 text-center">
              <p className="text-2xl font-extrabold text-brand-900">Daily</p>
              <p className="mt-1 text-xs text-muted">New candidates onboarded</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">What people say</h2>
            <p className="mt-3 text-muted">Real relationships, real results.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <Reveal as="figure" key={t.name} delay={i * 120} className="card p-6">
                <span className="text-brand-200"><Icon.Quote /></span>
                <blockquote className="mt-3 text-slate-700">"{t.quote}"</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <Avatar name={t.name} className="h-11 w-11" />
                  <span>
                    <span className="block font-semibold text-brand-900">{t.name}</span>
                    <span className="block text-sm text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20 pt-16">
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
