import { Link } from "react-router-dom";
import { Icon } from "../icons.jsx";
import HeroArt from "../components/HeroArt.jsx";
import useDocumentTitle from "../useDocumentTitle.js";

const benefits = [
  { icon: Icon.Clock, title: "Fast turnaround", text: "Pre-screened candidates delivered in days, not weeks." },
  { icon: Icon.Users, title: "Largest database", text: "Access the largest candidate network of any employment agency." },
  { icon: Icon.Shield, title: "Fully licensed", text: "Compliant temporary help and recruitment services." },
  { icon: Icon.Briefcase, title: "Flexible & scalable", text: "From 5 people to 5,000 — scaled up or down to your budget." },
];

export default function Employers() {
  useDocumentTitle(
    "For Employers",
    "Hire reliable, pre-screened talent fast — temporary, temp-to-perm or permanent. From one hire to a full crew."
  );
  return (
    <div>
      <section className="bg-brand-900 text-white">
        <div className="container-page grid items-center gap-10 py-20 lg:grid-cols-2">
          <div className="max-w-2xl">
            <span className="chip bg-white/10 text-brand-100">For employers</span>
            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">Looking to hire?</h1>
            <p className="mt-3 text-xl font-semibold text-brand-100">
              Tackle tomorrow's workforce challenges today.
            </p>
            <p className="mt-4 text-lg text-brand-100">
              Go beyond goals. Exceed expectations. You can do it all — but you need more than an
              employment agency. You need the world's best talent network, backed by 4,000+ successful
              placements.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact?type=employer" className="btn-accent">
                Request a proposal <Icon.ArrowRight width={18} height={18} />
              </Link>
              <Link to="/contact?type=employer" className="btn-outline border-white/30 bg-transparent text-white hover:bg-white/10">
                Request talent
              </Link>
            </div>
          </div>

          <div className="hidden justify-center lg:flex">
            <HeroArt className="w-full max-w-lg" />
          </div>
        </div>
      </section>

      {/* Scale messaging */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Let's talk about the employees you need</h2>
          <p className="mt-4 text-lg text-muted">
            Whether it's temporary or permanent employees, 5 people or 5,000, we'll come up with a plan
            that works for your budget and can be easily scaled up or down. Our enormous candidate
            database — the largest of any employment agency — lets us source the right people fast.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* How we work */}
      <section className="container-page pb-16">
        <div className="rounded-2xl bg-white p-8 shadow-card sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">How we work with you</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              { n: "1", t: "Tell us your needs", d: "Share the role, skills and timeline. We listen first." },
              { n: "2", t: "We source & screen", d: "We tap our database and interview the best fits daily." },
              { n: "3", t: "You hire with confidence", d: "Meet qualified candidates and make the call." },
            ].map((s) => (
              <div key={s.n}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-bold text-white">{s.n}</span>
                <h3 className="mt-3 text-lg font-bold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted">
            We work for many great companies that can provide references upon request.
          </p>
          <Link to="/contact?type=employer" className="btn-primary mt-6 inline-flex">Get started</Link>
        </div>
      </section>
    </div>
  );
}
