# Crypto App — Coinbase Clone

Full-stack student project: a Coinbase-style frontend wired up to a Node/Express/MongoDB backend with JWT authentication and CRUD on a cryptocurrency catalog.

> ⚠️ Demo project for educational purposes only. Not affiliated with Coinbase, Inc.

---

## Tech stack

**Frontend:** React 19 · Vite 7 · React Router v7 · Tailwind CSS v4 · Axios
**Backend:** Node.js · Express 4 · Mongoose 8 · JWT · bcryptjs · cookie-parser
**Database:** MongoDB Atlas

---

## Project structure

```
.
├── backend/                    # Express API
│   ├── controllers/            # Route handlers (auth, user, crypto)
│   ├── middleware/             # protect (JWT verification)
│   ├── models/                 # Mongoose schemas (User, Crypto)
│   ├── routes/                 # Express routers
│   ├── seed.js                 # Seeds 10 sample cryptocurrencies
│   ├── server.js               # App entry point
│   └── .env                    # MONGO_URI, JWT_SECRET, etc.
│
├── src/                        # React frontend
│   ├── components/             # WarningBanner, FooterDisclaimer, DemoNotice, etc.
│   ├── context/                # AuthContext (global auth state)
│   ├── hooks/                  # useCrypto
│   ├── lib/api.js              # Axios instance with withCredentials
│   ├── pages/                  # Home, SignIn, SignUp, Profile, Explore, AddCrypto, ...
│   └── App.jsx                 # Routes + global banner/footer
│
├── .env.example                # Frontend env template
└── PROJECT_README.md           # This file
```

---

## Local setup

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- A MongoDB Atlas cluster (free tier works)

### 1. Clone & install

```bash
git clone <repo-url>
cd interim-assesment-Drco-code

# Backend deps
cd backend
pnpm install

# Frontend deps
cd ..
pnpm install
```

### 2. Configure environment variables

**Backend** — copy `backend/.env.example` to `backend/.env` and fill in:

```env
PORT=5001
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/cryptoapp?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

> If `mongodb+srv://` fails with `querySrv ECONNREFUSED` (common on some Windows + mobile-hotspot setups), use the **standard non-SRV** string from Atlas → Connect → Drivers (toggle SRV off).

**Frontend** — copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Seed the database

```bash
cd backend
pnpm seed
```

Inserts 10 sample coins (BTC, ETH, SOL, ADA, DOGE, XRP, DOT, AVAX, LINK, LTC).

### 4. Run both apps

```bash
# Terminal 1 — backend (http://localhost:5001)
cd backend
pnpm dev

# Terminal 2 — frontend (http://localhost:5173)
pnpm dev
```

---

## API documentation

Base URL: `http://localhost:5001/api`

All requests include credentials (`withCredentials: true`) so the JWT cookie is sent automatically. The Authorization Bearer header is also accepted as a fallback.

### Authentication

| Method | Endpoint | Body / Query | Description |
|--------|----------|--------------|-------------|
| `GET` / `POST` | `/register` | `name`, `email`, `password` | Create account, set JWT cookie, return user + token |
| `GET` / `POST` | `/login` | `email`, `password` | Verify credentials, set JWT cookie, return user + token |
| `GET` / `POST` | `/logout` | — | Clear the JWT cookie |

> The assignment specifies GET for `/register` and `/login`; POST equivalents are also exposed.

### User profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/profile` | ✅ Required | Returns `{ _id, name, email }` for the logged-in user |

### Crypto

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/crypto` | All cryptocurrencies (newest first) |
| `GET` | `/crypto/gainers` | Top 6 by 24-hour % change (descending) |
| `GET` | `/crypto/new` | 6 most recently added (descending `createdAt`) |
| `POST` | `/crypto` | Add new crypto. Body: `{ name, symbol, price, image?, change24h? }`. Rejects duplicate symbols with 409. |

### Status codes

| Code | Meaning |
|------|---------|
| 200 / 201 | Success |
| 400 | Validation error (missing/invalid fields) |
| 401 | Not authenticated / invalid token |
| 409 | Duplicate (email or crypto symbol) |
| 500 | Server / DB error |

---

## End-to-end test checklist

- [ ] `pnpm seed` populates 10 cryptos in MongoDB
- [ ] Register a new user → document appears in MongoDB `users` collection
- [ ] Login → DevTools → Application → Cookies → `token` is set with `HttpOnly` flag
- [ ] Visit `/profile` → real name and email shown
- [ ] Logout button → cookie cleared, `/profile` redirects to `/signin`
- [ ] Homepage crypto card (Tradable / Top gainers / New on Coinbase) shows DB data
- [ ] `/explore` shows all coins from DB (no CoinGecko data)
- [ ] `/add-crypto` form adds a new coin → appears on `/explore`
- [ ] Adding the same symbol twice returns "already exists" (409)
- [ ] Sticky warning banner appears on every page; × button dismisses for the session

---

## Deployment

### Backend → Render

1. Push the repo to GitHub
2. Render → New → Web Service → connect repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `pnpm install`
   - **Start Command:** `pnpm start`
4. Environment variables:
   - `MONGO_URI` — your Atlas connection string
   - `JWT_SECRET` — long random string
   - `FRONTEND_URL` — *temporarily* `http://localhost:5173`, **update after frontend deploys**
   - `NODE_ENV` — `production`
5. Whitelist `0.0.0.0/0` in Atlas → Network Access (Render IPs are dynamic)

### Frontend → Netlify (or Vercel)

1. Netlify → Add new site → connect repo
2. Settings:
   - **Build Command:** `pnpm build`
   - **Publish Directory:** `dist`
3. Environment variable:
   - `VITE_API_URL` — `https://<your-backend>.onrender.com/api`

### Critical post-deployment step

After both deploys are live:

1. **Update `FRONTEND_URL`** on Render to the actual Netlify URL (`https://<your-app>.netlify.app`) — CORS will block requests until this matches exactly
2. Trigger a Render redeploy so the new env var takes effect

### Why `secure: true` and `sameSite: 'none'` are required in production

The backend's cookie options are:

```js
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}
```

In production the frontend (Netlify) and backend (Render) live on **different domains**. Browsers only allow cookies to be sent across origins when:

- `sameSite: 'none'` — explicitly opts in to cross-site sending
- `secure: true` — required by the spec when `sameSite: 'none'` is set

This means **both domains must use HTTPS** (Render and Netlify both provide HTTPS by default — don't disable it). In local development we use `sameSite: 'lax'` because the browser allows same-site requests over HTTP.

---

## Project notes / quirks

- **GET for auth routes** — the assignment specifies `GET /register` and `GET /login`. Both GET and POST are wired up; the frontend uses GET with query params.
- **Hybrid auth** — backend sets an HTTP-only cookie *and* returns the token in the response body. Auth middleware checks the cookie first, then the `Authorization: Bearer` header. This makes the system resilient if cookies fail (e.g., third-party cookie blocking).
- **Symbol uniqueness** — enforced both at the schema level (`unique: true`) and with an explicit check in the controller for clearer error messages.

---

## Author

Student project for the Coinbase Clone interim assessment.
