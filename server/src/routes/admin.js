import { Router } from "express";
import path from "node:path";
import { prisma } from "../db.js";
import { UPLOAD_DIR } from "../upload.js";
import { requireAuth } from "../auth.js";
import { uniqueJobSlug } from "../slug.js";

const router = Router();

// Every /api/admin route requires a valid recruiter session
router.use(requireAuth);

/* ----------------------------- Applications ----------------------------- */

router.get("/applications", async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;
    const applications = await prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        experiences: { orderBy: { sortOrder: "asc" } },
        education: { orderBy: { sortOrder: "asc" } },
      },
    });
    res.json(applications);
  } catch (err) {
    next(err);
  }
});

router.patch("/applications/:id", async (req, res, next) => {
  try {
    const updated = await prisma.application.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.get("/applications/:id/resume", async (req, res, next) => {
  try {
    const app = await prisma.application.findUnique({ where: { id: req.params.id } });
    if (!app || !app.resumePath) return res.status(404).json({ error: "No resume on file" });
    res.download(path.join(UPLOAD_DIR, app.resumePath), app.resumeOriginalName || app.resumePath);
  } catch (err) {
    next(err);
  }
});

router.get("/messages", async (_req, res, next) => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

/* -------------------------------- Jobs --------------------------------- */

const JOB_FIELDS = [
  "title",
  "category",
  "location",
  "employmentType",
  "payRange",
  "summary",
  "description",
  "requirements",
  "isActive",
  "featured",
];

const VALID_TYPE = new Set(["TEMPORARY", "TEMP_TO_PERM", "PERMANENT"]);

function pickJobData(body) {
  const data = {};
  for (const f of JOB_FIELDS) {
    if (body[f] === undefined) continue;
    if (f === "isActive" || f === "featured") data[f] = Boolean(body[f]);
    else if (f === "employmentType") data[f] = VALID_TYPE.has(body[f]) ? body[f] : "PERMANENT";
    else data[f] = body[f] === null ? null : String(body[f]);
  }
  return data;
}

// GET /api/admin/jobs  -> all jobs (including inactive) + application counts
router.get("/jobs", async (_req, res, next) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: [{ createdAt: "desc" }],
      include: { _count: { select: { applications: true } } },
    });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/jobs
router.post("/jobs", async (req, res, next) => {
  try {
    const data = pickJobData(req.body);
    if (!data.title || !data.category || !data.location || !data.summary || !data.description) {
      return res.status(400).json({ error: "Title, category, location, summary and description are required." });
    }
    data.slug = await uniqueJobSlug(data.title);
    const job = await prisma.job.create({ data });
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/jobs/:id
router.patch("/jobs/:id", async (req, res, next) => {
  try {
    const data = pickJobData(req.body);
    if (data.title) data.slug = await uniqueJobSlug(data.title, req.params.id);
    const job = await prisma.job.update({ where: { id: req.params.id }, data });
    res.json(job);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/jobs/:id
router.delete("/jobs/:id", async (req, res, next) => {
  try {
    await prisma.job.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
