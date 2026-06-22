import { Router } from "express";
import { prisma } from "../db.js";
import { uploadResume } from "../upload.js";
import { notifyNewApplication } from "../mailer.js";
import { honeypotBlocked } from "../limits.js";

const router = Router();

function safeParseArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const VALID_ENGAGEMENT = new Set(["TEMPORARY", "TEMP_TO_PERM", "PERMANENT"]);

// POST /api/applications  (multipart/form-data, field "resume" + JSON fields)
router.post("/", uploadResume.single("resume"), async (req, res, next) => {
  try {
    const b = req.body;

    // Silently accept (but discard) submissions that tripped the honeypot.
    if (honeypotBlocked(req)) return res.status(201).json({ ok: true, id: null });

    if (!b.firstName || !b.lastName || !b.email || !b.phone) {
      return res.status(400).json({ error: "First name, last name, email and phone are required." });
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email);
    if (!emailOk) return res.status(400).json({ error: "Please provide a valid email address." });

    const engagementType = VALID_ENGAGEMENT.has(b.engagementType) ? b.engagementType : "PERMANENT";

    let jobConnect = null;
    let jobTitleSnapshot = b.jobTitleSnapshot || null;
    if (b.jobId) {
      const job = await prisma.job.findUnique({ where: { id: b.jobId } });
      if (job) {
        jobConnect = job.id;
        jobTitleSnapshot = job.title;
      }
    }

    const experiences = safeParseArray(b.experiences)
      .filter((e) => e && (e.company || e.title))
      .map((e, i) => ({
        company: String(e.company || "").slice(0, 200),
        title: String(e.title || "").slice(0, 200),
        location: e.location ? String(e.location).slice(0, 200) : null,
        startDate: e.startDate ? String(e.startDate).slice(0, 40) : null,
        endDate: e.endDate ? String(e.endDate).slice(0, 40) : null,
        current: Boolean(e.current),
        description: e.description ? String(e.description).slice(0, 2000) : null,
        sortOrder: i,
      }));

    const education = safeParseArray(b.education)
      .filter((e) => e && e.school)
      .map((e, i) => ({
        school: String(e.school || "").slice(0, 200),
        degree: e.degree ? String(e.degree).slice(0, 200) : null,
        field: e.field ? String(e.field).slice(0, 200) : null,
        year: e.year ? String(e.year).slice(0, 20) : null,
        sortOrder: i,
      }));

    const application = await prisma.application.create({
      data: {
        jobId: jobConnect,
        jobTitleSnapshot,
        firstName: String(b.firstName).slice(0, 100),
        lastName: String(b.lastName).slice(0, 100),
        email: String(b.email).slice(0, 200),
        phone: String(b.phone).slice(0, 50),
        city: b.city ? String(b.city).slice(0, 100) : null,
        province: b.province ? String(b.province).slice(0, 100) : null,
        engagementType,
        availability: b.availability ? String(b.availability).slice(0, 100) : null,
        salaryExpectation: b.salaryExpectation ? String(b.salaryExpectation).slice(0, 100) : null,
        linkedin: b.linkedin ? String(b.linkedin).slice(0, 300) : null,
        skills: b.skills ? String(b.skills).slice(0, 1000) : null,
        coverLetter: b.coverLetter ? String(b.coverLetter).slice(0, 5000) : null,
        resumePath: req.file ? req.file.filename : null,
        resumeOriginalName: req.file ? req.file.originalname : null,
        experiences: { create: experiences },
        education: { create: education },
      },
      include: { experiences: true, education: true },
    });

    notifyNewApplication(application); // fire and forget

    res.status(201).json({ ok: true, id: application.id });
  } catch (err) {
    next(err);
  }
});

export default router;
