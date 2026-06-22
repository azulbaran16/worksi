import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, EMPLOYMENT_LABELS } from "../api.js";
import { Icon } from "../icons.jsx";
import Spinner from "../components/Spinner.jsx";
import ResumeDropzone from "../components/ResumeDropzone.jsx";
import ExperienceEditor from "../components/ExperienceEditor.jsx";
import EducationEditor from "../components/EducationEditor.jsx";
import Autocomplete from "../components/Autocomplete.jsx";
import { PROVINCES, CITIES_BY_PROVINCE, ALL_CITIES } from "../data/canada.js";

const STEPS = ["Position", "About you", "Resume", "Experience", "Education", "Review"];
const STEP_HINTS = [
  "What kind of work are you after?",
  "Your contact details — takes about a minute.",
  "Upload a resume and add extra context (optional).",
  "Add your recent roles so we can match you faster (optional).",
  "Your education background (optional).",
  "Check everything looks right, then submit.",
];

const engagementOptions = [
  { value: "PERMANENT", label: "Permanent", desc: "Long-term, full-time placement" },
  { value: "TEMP_TO_PERM", label: "Temp-to-Perm", desc: "Start temporary, convert to permanent" },
  { value: "TEMPORARY", label: "Temporary", desc: "Short-term or seasonal contracts" },
];

// Returns a city suggestion loader scoped to the selected province (or all cities).
function cityLoader(province) {
  const list = province && CITIES_BY_PROVINCE[province] ? CITIES_BY_PROVINCE[province] : ALL_CITIES;
  return (q) => {
    const ql = (q || "").toLowerCase();
    return list
      .filter((c) => c.toLowerCase().includes(ql))
      .slice(0, 10)
      .map((c) => ({ label: c, value: c }));
  };
}

const initialForm = {
  engagementType: "PERMANENT",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  province: "",
  availability: "",
  salaryExpectation: "",
  linkedin: "",
  skills: "",
  coverLetter: "",
};

export default function Apply() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(Boolean(slug));

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [resume, setResume] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);
  const [maxReached, setMaxReached] = useState(0); // furthest step the user has visited
  const topRef = useRef(null);

  // Scroll the form into view whenever the step changes (keeps the user oriented).
  useEffect(() => {
    setMaxReached((m) => Math.max(m, step));
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  useEffect(() => {
    if (!slug) return;
    setJobLoading(true);
    api
      .getJob(slug)
      .then((j) => {
        setJob(j);
        setForm((f) => ({ ...f, engagementType: j.employmentType }));
      })
      .catch(() => setJob(null))
      .finally(() => setJobLoading(false));
  }, [slug]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  function validateStep(s) {
    const e = {};
    if (s === 1) {
      if (!form.firstName.trim()) e.firstName = "Required";
      if (!form.lastName.trim()) e.lastName = "Required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
      if (!form.phone.trim()) e.phone = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }
  // Jump to an already-visited step via the stepper.
  function goTo(target) {
    if (target <= maxReached && target !== step) setStep(target);
  }

  async function submit() {
    setSubmitError("");
    if (!validateStep(1)) {
      setStep(1);
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
      if (job) {
        fd.append("jobId", job.id);
        fd.append("jobTitleSnapshot", job.title);
      }
      fd.append("experiences", JSON.stringify(experiences));
      fd.append("education", JSON.stringify(education));
      if (resume) fd.append("resume", resume);

      await api.submitApplication(fd);
      setDone(true);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  if (done) return <SuccessScreen job={job} />;

  return (
    <div className="container-page py-10">
      <div ref={topRef} className="mx-auto max-w-3xl scroll-mt-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {job ? `Apply: ${job.title}` : "Apply to WorkSi"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {job
              ? `${job.location} · ${EMPLOYMENT_LABELS[job.employmentType]}`
              : "Submit one application and we'll match you to the right opportunities."}
          </p>
          {jobLoading && <p className="mt-2 text-sm text-muted">Loading position…</p>}
        </div>

        {/* Stepper */}
        <div className="mb-6">
          <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <ol className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
            {STEPS.map((s, i) => {
              const visited = i <= maxReached;
              return (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    disabled={!visited}
                    className={`flex items-center gap-1.5 rounded-lg px-1 py-0.5 transition-colors ${
                      i === step ? "text-brand-700" : i < step ? "text-success-600" : "text-slate-400"
                    } ${visited ? "cursor-pointer hover:bg-slate-100" : "cursor-default"}`}
                    aria-current={i === step ? "step" : undefined}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] transition-colors ${
                        i < step
                          ? "bg-success-500 text-white"
                          : i === step
                          ? "bg-brand-600 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {i < step ? <Icon.Check width={12} height={12} /> : i + 1}
                    </span>
                    {s}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="mb-3 text-sm font-medium text-brand-700">
          Step {step + 1} of {STEPS.length} · <span className="text-muted font-normal">{STEP_HINTS[step]}</span>
        </p>

        <div className="card p-5 sm:p-7">
          <div key={step} className="animate-fade-up">
            {step === 0 && (
              <StepPosition job={job} value={form.engagementType} onChange={(v) => set({ engagementType: v })} />
            )}
            {step === 1 && <StepAbout form={form} set={set} errors={errors} />}
            {step === 2 && (
              <StepResume form={form} set={set} resume={resume} setResume={setResume} />
            )}
            {step === 3 && <ExperienceEditor items={experiences} onChange={setExperiences} />}
            {step === 4 && <EducationEditor items={education} onChange={setEducation} />}
            {step === 5 && (
              <StepReview
                form={form}
                job={job}
                resume={resume}
                experiences={experiences}
                education={education}
              />
            )}
          </div>

          {submitError && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{submitError}</p>
          )}

          <div className="mt-6 flex items-center justify-between">
            {step > 0 ? (
              <button type="button" className="btn-outline" onClick={back}>
                <Icon.ArrowLeft width={18} height={18} /> Back
              </button>
            ) : (
              <span />
            )}

            {step < STEPS.length - 1 ? (
              <button type="button" className="btn-primary" onClick={next}>
                Continue <Icon.ArrowRight width={18} height={18} />
              </button>
            ) : (
              <button type="button" className="btn-accent" onClick={submit} disabled={submitting}>
                {submitting ? <Spinner /> : <Icon.Check width={18} height={18} />}
                {submitting ? "Submitting…" : "Submit application"}
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
          <Icon.Shield width={14} height={14} /> Your information is kept confidential and used only for recruitment.
        </p>
      </div>
    </div>
  );
}

function StepPosition({ job, value, onChange }) {
  return (
    <div>
      {job && (
        <div className="mb-5 rounded-xl border border-brand-100 bg-brand-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">You're applying for</p>
          <p className="mt-1 text-lg font-bold text-brand-900">{job.title}</p>
          <p className="text-sm text-muted">{job.location} · {job.category}</p>
        </div>
      )}
      <h3 className="text-lg font-semibold">What type of work are you looking for?</h3>
      <p className="mt-1 text-sm text-muted">Pick the option that best fits you.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {engagementOptions.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                active ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100" : "border-slate-200 bg-white hover:border-brand-300"
              }`}
            >
              <span className="flex items-center justify-between">
                <span className="font-semibold text-brand-900">{opt.label}</span>
                {active && <Icon.Check width={18} height={18} className="text-brand-600" />}
              </span>
              <span className="mt-1 block text-xs text-muted">{opt.desc}</span>
            </button>
          );
        })}
      </div>
      {!job && (
        <p className="mt-5 text-sm text-muted">
          Looking for a specific role?{" "}
          <Link to="/jobs" className="font-semibold text-brand-700">Browse open jobs</Link>.
        </p>
      )}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function StepAbout({ form, set, errors }) {
  return (
    <div>
      <h3 className="text-lg font-semibold">Tell us about you</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="First name *" error={errors.firstName}>
          <input className="field" value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} />
        </Field>
        <Field label="Last name *" error={errors.lastName}>
          <input className="field" value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} />
        </Field>
        <Field label="Email *" error={errors.email}>
          <input type="email" className="field" value={form.email} onChange={(e) => set({ email: e.target.value })} />
        </Field>
        <Field label="Phone *" error={errors.phone}>
          <input type="tel" className="field" value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
        </Field>
        <Field label="Province">
          <select
            className="field"
            value={form.province}
            onChange={(e) => set({ province: e.target.value })}
          >
            <option value="">Select province…</option>
            {PROVINCES.map((p) => (
              <option key={p.code} value={p.code}>{p.name}</option>
            ))}
          </select>
        </Field>
        <Field label="City">
          <Autocomplete
            value={form.city}
            onChange={(t) => set({ city: t })}
            onSelect={(o) => set({ city: o.value })}
            placeholder={form.province ? "Start typing your city" : "Select a province first (or type)"}
            loadOptions={cityLoader(form.province)}
            renderOption={(o) => <span>{o.label}</span>}
          />
        </Field>
        <Field label="Availability">
          <input className="field" value={form.availability} onChange={(e) => set({ availability: e.target.value })} placeholder="e.g. Immediately, 2 weeks" />
        </Field>
        <Field label="Salary / rate expectation">
          <input className="field" value={form.salaryExpectation} onChange={(e) => set({ salaryExpectation: e.target.value })} placeholder="e.g. $22/hr" />
        </Field>
      </div>
    </div>
  );
}

function StepResume({ form, set, resume, setResume }) {
  return (
    <div>
      <h3 className="text-lg font-semibold">Upload your resume</h3>
      <p className="mt-1 text-sm text-muted">Recommended — it speeds up your application.</p>
      <div className="mt-4">
        <ResumeDropzone file={resume} onChange={setResume} />
      </div>
      <div className="mt-5 grid gap-4">
        <Field label="LinkedIn / portfolio (optional)">
          <input className="field" value={form.linkedin} onChange={(e) => set({ linkedin: e.target.value })} placeholder="https://linkedin.com/in/…" />
        </Field>
        <Field label="Key skills (optional)">
          <input className="field" value={form.skills} onChange={(e) => set({ skills: e.target.value })} placeholder="e.g. Forklift, WHMIS, Inventory (comma separated)" />
        </Field>
        <Field label="Cover note (optional)">
          <textarea className="field min-h-[110px]" value={form.coverLetter} onChange={(e) => set({ coverLetter: e.target.value })} placeholder="Anything you'd like the recruiter to know?" />
        </Field>
      </div>
    </div>
  );
}

function StepReview({ form, job, resume, experiences, education }) {
  const Row = ({ k, v }) => (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted">{k}</span>
      <span className="text-right font-medium text-slate-800">{v || "—"}</span>
    </div>
  );
  return (
    <div>
      <h3 className="text-lg font-semibold">Review &amp; submit</h3>
      <p className="mt-1 text-sm text-muted">Make sure everything looks right before submitting.</p>

      <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 p-4">
        <Row k="Position" v={job ? job.title : "General application"} />
        <Row k="Engagement" v={EMPLOYMENT_LABELS[form.engagementType]} />
        <Row k="Name" v={`${form.firstName} ${form.lastName}`} />
        <Row k="Email" v={form.email} />
        <Row k="Phone" v={form.phone} />
        <Row k="Location" v={[form.city, form.province].filter(Boolean).join(", ")} />
        <Row k="Availability" v={form.availability} />
        <Row k="Resume" v={resume ? resume.name : "Not attached"} />
        <Row k="Work experience" v={`${experiences.length} entr${experiences.length === 1 ? "y" : "ies"}`} />
        <Row k="Education" v={`${education.length} entr${education.length === 1 ? "y" : "ies"}`} />
        <Row k="Skills" v={form.skills} />
      </div>
    </div>
  );
}

const NEXT_STEPS = [
  { title: "We review your profile", text: "Your application lands directly with our recruitment team." },
  { title: "A recruiter gets in touch", text: "If there's a match, we'll reach out by phone or email." },
  { title: "Training & onboarding", text: "We onboard you and match you with the employer best suited to your skills and goals." },
];

function SuccessScreen({ job }) {
  return (
    <div className="container-page py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-500/10 text-success-600">
          <Icon.Check width={32} height={32} />
        </span>
        <h1 className="mt-5 text-2xl font-bold">Application submitted!</h1>
        <p className="mt-2 text-muted">
          Thanks for applying{job ? ` for ${job.title}` : ""}. Here's what happens next.
        </p>

        <ol className="mt-8 grid gap-4 text-left sm:grid-cols-3">
          {NEXT_STEPS.map((s, i) => (
            <li key={s.title} className="card p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 font-bold text-white">{i + 1}</span>
              <h3 className="mt-3 text-base font-bold text-brand-900">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex justify-center gap-3">
          <Link to="/jobs" className="btn-primary">Browse more jobs</Link>
          <Link to="/" className="btn-outline">Back home</Link>
        </div>
      </div>
    </div>
  );
}
