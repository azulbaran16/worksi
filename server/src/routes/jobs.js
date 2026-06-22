import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET /api/jobs?search=&type=&category=
router.get("/", async (req, res, next) => {
  try {
    const { search, type, category } = req.query;
    const where = { isActive: true };
    if (type) where.employmentType = type;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
        { location: { contains: search } },
        { category: { contains: search } },
      ];
    }
    const jobs = await prisma.job.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// GET /api/jobs/categories  -> distinct categories for filters
router.get("/categories", async (_req, res, next) => {
  try {
    const rows = await prisma.job.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    res.json(rows.map((r) => r.category));
  } catch (err) {
    next(err);
  }
});

// GET /api/jobs/:slug
router.get("/:slug", async (req, res, next) => {
  try {
    const job = await prisma.job.findUnique({ where: { slug: req.params.slug } });
    if (!job || !job.isActive) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    next(err);
  }
});

export default router;
