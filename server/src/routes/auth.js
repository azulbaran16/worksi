import { Router } from "express";
import { prisma } from "../db.js";
import { hashPassword, verifyPassword, signToken, requireAuth, requireAdminRole } from "../auth.js";
import { loginLimiter } from "../limits.js";

const router = Router();

// POST /api/auth/login  { email, password }
router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required." });

    const user = await prisma.recruiterUser.findUnique({ where: { email: String(email).toLowerCase() } });
    if (!user || !user.active) return res.status(401).json({ error: "Invalid credentials." });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials." });

    const token = signToken(user);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  res.json({ id: req.user.sub, email: req.user.email, name: req.user.name, role: req.user.role });
});

// --- Recruiter management (ADMIN only) ---

// GET /api/auth/users
router.get("/users", requireAuth, requireAdminRole, async (_req, res, next) => {
  try {
    const users = await prisma.recruiterUser.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/users  { name, email, password, role }
router.post("/users", requireAuth, requireAdminRole, async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }
    const exists = await prisma.recruiterUser.findUnique({ where: { email: String(email).toLowerCase() } });
    if (exists) return res.status(409).json({ error: "A user with that email already exists." });

    const user = await prisma.recruiterUser.create({
      data: {
        name: String(name).slice(0, 100),
        email: String(email).toLowerCase().slice(0, 200),
        passwordHash: await hashPassword(String(password)),
        role: role === "ADMIN" ? "ADMIN" : "RECRUITER",
      },
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
    });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/auth/users/:id  { active?, role?, password? }
router.patch("/users/:id", requireAuth, requireAdminRole, async (req, res, next) => {
  try {
    const data = {};
    if (typeof req.body.active === "boolean") data.active = req.body.active;
    if (req.body.role) data.role = req.body.role === "ADMIN" ? "ADMIN" : "RECRUITER";
    if (req.body.password) {
      if (String(req.body.password).length < 8)
        return res.status(400).json({ error: "Password must be at least 8 characters." });
      data.passwordHash = await hashPassword(String(req.body.password));
    }
    const user = await prisma.recruiterUser.update({
      where: { id: req.params.id },
      data,
      select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
