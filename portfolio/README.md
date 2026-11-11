# Santanu Manna — Full-Stack Portfolio

React + Vite frontend, Node/Express/MongoDB backend.

## Status
- [x] Phase 1: setup, structure, DB connection
- [x] Phase 2: frontend layout + 7 pages
- [x] Phase 3: models, API, auth
- [x] Phase 4: admin dashboard + CRUD
- [x] Phase 5: Multer uploads (admin only)
- [ ] Phase 6: animations, validation, security
- [ ] Phase 7: testing + deployment docs (tooling and guide added early; final pass after Phases 4-6)

## Setup
Requires Node 18+ and a running MongoDB (local or Atlas).

```bash
# Backend
cd backend
cp .env.example .env        # set a strong JWT_SECRET and your MONGO_URI
npm install
npm run dev                 # http://localhost:5000

# Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

## Verify Phase 1
Open http://localhost:5173. It should show "API ok · database connected".
You can also open http://localhost:5000/api/health.

## Upload policy
Project thumbnail/screenshots and certificate PDF/image uploads, replacements and deletions
are available only in the protected admin dashboard and behind JWT + admin-role middleware
on the server (401 unauthenticated, 403 unauthorized). Uploaded files are served read-only
at `/uploads/*`. There is no public upload endpoint. Images are limited to JPEG, PNG, or
WebP (8 MB each); certificate files may also be PDF (10 MB).

## Phase 2 notes
- Public routes: `/`, `/about`, `/skills`, `/projects`, `/certificates`, `/services`, `/contact`, plus a 404 page.
- Pages load data through `useApi()` (`GET /api/...`, expects `{ success, data }`) and fall back to
  `frontend/src/data/defaults.js` when the API has nothing yet. The admin Profile editor manages your social links and email.
- The contact form posts to `POST /api/contact`, which is built in Phase 3.

## Phase 3: API, models and authentication

### First run
```bash
cd backend
npm install
npm run seed            # profile, skills, services and the 2 example projects
npm run create-admin    # prompts for name, email and a hidden password (12+ chars)
npm run dev
```
Add your GitHub, LinkedIn, Instagram and email to the `profile` object in `backend/scripts/seed.js`
and run `npm run seed -- --reset` (this replaces profile, skills, services and projects only).

### Creating the first admin securely
- There is no public register endpoint. The admin is created only by `npm run create-admin` on a machine with access to your database.
- The password is typed at a hidden prompt, hashed with bcrypt (cost 12) and never written to a file or env var.
- The script refuses to run if an admin already exists.

### Endpoints
| Method | Path | Access |
|---|---|---|
| POST | /api/auth/login | public (10 attempts / 15 min) |
| POST | /api/auth/logout | public |
| GET | /api/auth/me | admin session |
| GET | /api/projects, /api/projects/:id | public |
| POST / PUT / DELETE | /api/projects[/:id] | admin |
| GET / POST / PUT / DELETE | /api/certificates, /api/skills, /api/services | GET public, writes admin |
| POST | /api/contact | public (5 / hour, honeypot) |
| GET, PATCH /:id/read, DELETE /:id | /api/contact | admin |
| GET | /api/profile, /api/profile/about | public |
| PUT | /api/profile, /api/profile/about | admin |
| POST / DELETE | /api/uploads/projects/:id/thumbnail | admin |
| POST | /api/uploads/projects/:id/screenshots | admin |
| DELETE | /api/uploads/projects/:id/screenshots/:index | admin |
| POST / DELETE | /api/uploads/certificates/:id/file | admin |

Unauthenticated requests get 401, signed-in non-admins get 403. File fields (thumbnails, screenshots,
certificate files, resume, profile image) cannot be set through these JSON endpoints; only the admin-only
upload routes write them. Project images and certificate files are supported in the dashboard; resume
and profile-image uploads are not yet available.

## Admin dashboard
Open `/admin` on the frontend and sign in with the account created by `npm run create-admin`.
The dashboard manages projects, skills, services, certificates, profile/about text, and contact
messages, including project images and certificate files. Sign-in uses the backend's HTTP-only
session cookie; there is no public registration.

### Quick test
```bash
curl http://localhost:5000/api/projects
curl -i -X POST http://localhost:5000/api/projects -H "Content-Type: application/json" -d "{}"   # expect 401
curl -c jar.txt -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"you@example.com\",\"password\":\"your-password\"}"
curl -b jar.txt http://localhost:5000/api/auth/me
```

## Testing and deployment
See [DEPLOYMENT.md](DEPLOYMENT.md). Run API checks with `npm test` in `backend`; deploy with `docker compose up -d --build`.
