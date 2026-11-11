# Deployment and testing guide

> Status: the public site, API, authentication, contact form, admin dashboard, and admin-only
> project/certificate uploads are available.

## 1. Run the automated API checks
Start MongoDB and the backend, then in another terminal:
```bash
cd backend
npm test
```
Tests cover: health, public reads, 401 on every admin route, bad ids, JSON 404s, login validation,
NoSQL-injection attempt, contact validation, upload-folder traversal, and no public upload/register route.
To test a deployed site: `API_URL=https://yourdomain.com/api npm test`.
Note: the contact and login limiters count failed attempts, so repeated runs can return 429; wait a few minutes.

## 2. Manual checklist (frontend)
- [ ] All 7 navbar links open the right page and the active link is highlighted
- [ ] Mobile menu opens/closes; theme toggle switches and persists after refresh
- [ ] Home: typing effect runs, buttons work, resume button is disabled until a resume exists
- [ ] Projects: filters, search, View Details modal; Skills filters; Certificates empty state
- [ ] Contact: invalid fields show errors; a valid message shows success; the message appears in MongoDB
- [ ] Unknown URL shows the 404 page
- [ ] Keyboard only: Tab reaches every control, Esc closes modals
- [ ] Admin login and CRUD for projects, skills, services, certificates, profile, and messages
- [ ] Admin project images and certificate PDF/image uploads

## 3. Deploy with Docker (one server)
Requires Docker with Compose.
```bash
cp backend/.env.production.example backend/.env.production
# edit it: set CLIENT_URL and a new JWT_SECRET
docker compose up -d --build
docker compose exec backend node scripts/seed.js
docker compose exec -it backend node scripts/createAdmin.js
```
The site is served on port 80. nginx serves the React build and proxies `/api` and `/uploads` to the
backend, so everything is on one domain and the login cookie works with `COOKIE_SAME_SITE=lax`.
Data lives in the `mongo-data` and `uploads-data` volumes; back both up.

### HTTPS
Put a TLS terminator in front (Caddy, or nginx with Let's Encrypt/Certbot, or Cloudflare). Set `CLIENT_URL`
to the `https://` address. Cookies are marked `Secure` automatically when `NODE_ENV=production`.

## 4. Deploy without Docker (e.g. Render/Railway + Atlas + Netlify/Vercel)
- Database: create a MongoDB Atlas cluster and use its URI as `MONGO_URI`.
- Backend: run `npm install && npm start` in `backend` with the env vars from `.env.production.example`.
  Run `npm run seed` and `npm run create-admin` once from a shell on that service.
- Frontend: build with `VITE_API_URL=https://your-api-domain` then publish `frontend/dist`.
- If the frontend and API are on different sites, set `COOKIE_SAME_SITE=none` (requires HTTPS) and make sure
  `CLIENT_URL` is exactly the frontend origin. Same-site setups (e.g. `app.x.com` and `api.x.com`) can keep `lax`.
- Note: platforms with temporary disks lose uploaded files on redeploy. Use a persistent
  disk/volume for `backend/uploads`.

## 5. Pre-launch security checklist
- [ ] `JWT_SECRET` is long and random, and `.env` files are not committed
- [ ] `CLIENT_URL` is your real https origin
- [ ] Admin created with `create-admin` using a unique password of 12+ characters
- [ ] MongoDB is not exposed to the internet (compose publishes no Mongo port)
- [ ] `npm test` passes against the deployed URL
