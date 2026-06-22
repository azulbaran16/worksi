import { Link } from "react-router-dom";
import { Icon } from "../icons.jsx";

const benefits = [
  { icon: Icon.Clock, title: "Fast turnaround", text: "Pre-screened candidates delivered in days, not weeks." },
  { icon: Icon.Users, title: "Vetted talent", text: "Every candidate is interviewed and reference-checked." },
  { icon: Icon.Shield, title: "Fully licensed", text: "Compliant temporary help and recruitment services." },
  { icon: Icon.Briefcase, title: "Flexible models", text: "Temporary, temp-to-perm or permanent placements." },
];

export default function Employers() {
  return (
    <div>
      <section className="bg-brand-900 text-white">
        <div className="container-page py-20">
          <div className="max-w-2xl">
            <span className="chip bg-white/10 text-brand-100">For employers</span>
            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">
              Hire reliable people, faster.
            </h1>
            <p className="mt-4 text-lg text-brand-100">
              From a single hire to a full crew, WorkSi delivers pre-screened candidates matched to
              your needs — backed by 4,000+ successful placements.
            </p>
            <Link to="/contact" className="btn-accent mt-8 inline-flex">
              Request talent <Icon.ArrowRight width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="card p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <b.icon />
              </span>
              <h3 className="mt-4 text-lg font-bold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="rounded-2xl bg-white p-8 shadow-card sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">How we work with you</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              { n: "1", t: "Tell us your needs", d: "Share the role, skills and timeline. We listen first." },
              { n: "2", t: "We source & screen", d: "We tap our database and interview the best fits." },
              { n: "3", t: "You hire with confidence", d: "Meet qualified candidates and make the call." },
            ].map((s) => (
              <div key={s.n}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-bold text-white">{s.n}</span>
                <h3 className="mt-3 text-lg font-bold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted">{s.d}</p>
              </div>
            ))}
          </div>
          <Link to="/contact" className="btn-primary mt-10 inline-flex">Get started</Link>
        </div>
      </section>
    </div>
  );
}
