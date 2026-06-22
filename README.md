# WorkSi — Staffing & Recruitment Platform

A modern, full-stack rebuild of [worksi.net](https://worksi.net) with a simpler, guided job
application flow: candidates apply **directly to a specific job**, upload their resume with
drag-and-drop, and add **work experience** and education dynamically. All applications are stored
in a database and managed from a recruiter dashboard.

## ✨ What's included

- **Public site:** Home, Find Jobs (search + filters), Job detail, For Employers, Contact.
- **Guided application flow** (`/apply` or `/apply/:job-slug`):
  1. Engagement type (Temporary / Temp-to-Perm / Permanent)
  2. Personal details
  3. Dynamic resume upload (drag & drop, PDF/DOC/DOCX/TXT/RTF)
  4. Dynamic **work experience** (add/remove multiple roles)
  5. Education
  6. Review & submit
- **Recruiter dashboard** (`/admin`) with email + password login (JWT):
  - **Applications:** view, change status, download resumes.
  - **Jobs:** create / edit / delete postings, toggle active & featured (no code needed).
  - **Recruiters** (admin only): add recruiter accounts, enable/disable, reset passwords.
- **REST API** with file uploads and optional email notifications.
- **Database** via Prisma — SQLite by default (zero config), switchable to PostgreSQL.

## 🧱 Tech stack

| Layer    | Tech                                            |
| -------- | ----------------------------------------------- |
| Frontend | React 18 + Vite + React Router + Tailwind CSS   |
| Backend  | Node.js + Express                               |
| Database | Prisma ORM (SQLite default / PostgreSQL option) |
| Uploads  | Multer (stored on disk in `server/uploads/`)    |

## 🚀 Quick start (local)

> Requires **Node.js 18+**.

```bash
# 1. Install all dependencies (root, server, client)
npm install

# 2. Create env files from the examples
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env

# 3. Create the database and load sample jobs
npm run db:setup

# 4. Run frontend + backend together
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:4000
- Recruiter dashboard: http://localhost:5173/admin
  - Default login (created by the seed): `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `server/.env`
    (defaults: `admin@worksi.net` / `ChangeMe123!` — **change these in production**).

## 📦 Production build

The Express server serves the built React app, so you deploy **one** Node service.

```bash
npm install
npm run build       # builds the React app + generates Prisma client
npm run db:setup    # first deploy only: create tables + seed jobs
npm start           # serves API + frontend on PORT (default 4000)
```

Then open `http://your-server:PORT`.

## ☁️ Deploying to a host

### Option A — Node host (Render, Railway, Fly.io, a VPS)  *(recommended)*

1. Push this repo to GitHub.
2. Create a new **Web Service** pointing at the repo.
3. Settings:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
   - **Node version:** 18+
4. Environment variables (see `.env.example`): set `ADMIN_TOKEN`, and for a persistent DB set
   `DATABASE_URL`. For SQLite on a host with a persistent disk, point it at the disk, e.g.
   `DATABASE_URL="file:/data/worksi.db"`. For PostgreSQL, see Option C.
5. After the first deploy, run `npm run db:setup` once (most hosts offer a one-off shell/job).

A `render.yaml` is included for one-click setup on Render.

### Option B — Split hosting (static frontend + Node API)

- Deploy `client/` to Netlify/Vercel/static hosting (`npm run build`, publish `client/dist`).
- Deploy `server/` to a Node host.
- Set `VITE_API_URL` in `client/.env` to the API URL, and `CORS_ORIGIN` on the server to the
  frontend URL.

### Option C — Use PostgreSQL instead of SQLite

1. In `server/prisma/schema.prisma` change `provider = "sqlite"` to `provider = "postgresql"`.
2. Set `DATABASE_URL` to your Postgres connection string.
3. Run `npm run db:setup`.

> **Shared/cPanel hosting note:** this is a Node app, so it needs a host that runs Node
> (most modern hosts do, including cPanel's "Setup Node.js App"). Classic PHP-only shared hosting
> won't run it as-is.

## 🔐 Security & data notes

- Candidate resumes are stored in `server/uploads/` and are **git-ignored** — never commit them.
- The dashboard uses real recruiter accounts (email + password, bcrypt-hashed) with JWT sessions.
  Set a strong, random `JWT_SECRET` and change the seeded admin password in production.
- Roles: `ADMIN` can manage other recruiters and jobs; `RECRUITER` can manage jobs and
  applications. Add/disable recruiters from the dashboard's **Recruiters** tab.
- Always run behind HTTPS in production.

## 🗂️ Project structure

```
NewWorksi/
├─ package.json          # workspaces + dev/build/start scripts
├─ render.yaml           # Render deploy config
├─ client/               # React + Vite + Tailwind frontend
│  └─ src/
│     ├─ pages/          # Home, Jobs, JobDetail, Apply, Employers, Contact, Admin
│     └─ components/     # Navbar, Footer, JobCard, ResumeDropzone, ExperienceEditor, …
└─ server/               # Express API
   ├─ prisma/            # schema.prisma + seed.js
   ├─ uploads/           # resume storage (git-ignored)
   └─ src/
      ├─ index.js        # app entry, serves API + built client
      └─ routes/         # jobs, applications, contact, admin
```

## 🧩 Managing jobs

The easiest way is the **Jobs** tab in the recruiter dashboard (`/admin`) — create, edit, delete,
and toggle active/featured with no code.

Other options:

- Sample jobs are seeded from `server/prisma/seed.js`; edit it and re-run `npm run db:setup`.
- Use a DB GUI: `npx prisma studio` (run inside `server/`).
```
