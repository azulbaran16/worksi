import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// POST /api/contact
router.post("/", async (req, res, next) => {
  try {
    const { type, name, email, phone, company, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required." });
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) return res.status(400).json({ error: "Please provide a valid email address." });

    await prisma.contactMessage.create({
      data: {
        type: type === "employer" ? "employer" : "candidate",
        name: String(name).slice(0, 200),
        email: String(email).slice(0, 200),
        phone: phone ? String(phone).slice(0, 50) : null,
        company: company ? String(company).slice(0, 200) : null,
        message: String(message).slice(0, 5000),
      },
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
