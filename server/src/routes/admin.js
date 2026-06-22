import { Router } from "express";
import path from "node:path";
import { prisma } from "../db.js";
import { UPLOAD_DIR } from "../upload.js";

const router = Router();

// Lightweight token guard. Send header: Authorization: Bearer <ADMIN_TOKEN>
function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

router.use(requireAdmin);

// GET /api/admin/applications
router.get("/applications", async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;
    const applications = await prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { experiences: { orderBy: { sortOrder: "asc" } }, education: { orderBy: { sortOrder: "asc" } } },
    });
    res.json(applications);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/applications/:id  { status }
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

// GET /api/admin/applications/:id/resume  -> download the resume
router.get("/applications/:id/resume", async (req, res, next) => {
  try {
    const app = await prisma.application.findUnique({ where: { id: req.params.id } });
    if (!app || !app.resumePath) return res.status(404).json({ error: "No resume on file" });
    res.download(path.join(UPLOAD_DIR, app.resumePath), app.resumeOriginalName || app.resumePath);
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/messages
router.get("/messages", async (_req, res, next) => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

export default router;
