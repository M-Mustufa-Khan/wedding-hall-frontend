# Elegant Celebrations — Project Context
> Last updated: June 27, 2026  
> Full conversation history preserved here for continuity across sessions.

---

## 1. Project Overview

**Name:** Elegant Celebrations  
**Type:** FYP (Final Year Project) — Wedding Hall Management System  
**Stack:** React (CRA) frontend + ASP.NET Core Web API (.NET 8) backend  
**Database:** PostgreSQL via EF Core + Npgsql (`EnsureCreated`, no migrations)  
**Auth:** JWT stored in `localStorage` as `token` and `user` keys  
**Image storage:** Base64 strings in DB  

### Paths
| Part | Path |
|---|---|
| Frontend | `C:\Users\mustu\OneDrive\Desktop\Project-2026\wedding-hall-frontend` |
| Backend | `C:\Users\mustu\OneDrive\Desktop\Project-2026\WeddingHallAPI\WeddingHallAPI` |

### GitHub Repos
| Part | URL |
|---|---|
| Frontend | https://github.com/M-Mustufa-Khan/wedding-hall-frontend |
| Backend | https://github.com/M-Mustufa-Khan/wedding-hall-api |

### Local Start commands
```bash
# Backend — MUST use --launch-profile https (binds to port 7134 which frontend expects)
dotnet run --launch-profile https

# Frontend
npm start
```

> ⚠️ Always use `--launch-profile https`. Running `dotnet run` without it starts on HTTP port 5259 and the frontend (configured for `https://localhost:7134`) won't connect.

---

## 2. Deployment (LIVE)

| Part | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://elegantcelebrations.vercel.app |
| Backend API | Railway | https://wedding-hall-api-production-b553.up.railway.app/api |
| Database | Railway PostgreSQL | (internal — injected via `DATABASE_URL` env var) |

### Railway Environment Variables (wedding-hall-api service)
| Name | Value |
|---|---|
| `DATABASE_URL` | Set via Variable Reference from PostgreSQL service |
| `Jwt__Key` | `MySuperSecretKeyForWeddingHall2025!AtLeast32Chars` |
| `Jwt__Issuer` | `WeddingHallAPI` |
| `Jwt__Audience` | `WeddingHallClient` |
| `AllowedOrigins` | `https://elegantcelebrations.vercel.app` |

### Vercel Environment Variables (wedding-hall-frontend)
| Name | Value |
|---|---|
| `REACT_APP_API_URL` | `https://wedding-hall-api-production-b553.up.railway.app/api` |

### Railway Free Credit
- $5 free credit, costs ~$0.40-0.50/day
- Lasts ~10 days from deploy date (June 26) → safe until ~July 5-6
- In-house presentation July 2 is within the free window
- If selected for main exhibition → add card to Railway ($5/month hobby plan)

### Admin credentials (live + local)
- Email: `admin@weddinghall.com`
- Password: `admin123`

---

## 3. Tech Stack Details

| Layer | Tech |
|---|---|
| Frontend framework | React 19 (CRA / react-scripts 5) |
| Routing | react-router-dom v7 |
| Icons | lucide-react **v1.18.0** |
| HTTP client | axios v1.17 |
| Backend | ASP.NET Core Web API (.NET 8) |
| ORM | Entity Framework Core + Npgsql.EntityFrameworkCore.PostgreSQL 8.0.11 |
| DB (local) | SQL Server replaced by PostgreSQL |
| DB (production) | Railway PostgreSQL |

### ⚠️ Critical: lucide-react v1.18.0 Icon Rules
These social-brand icons **do NOT exist** and will cause a white-screen crash:
- `Instagram` → use `Camera`
- `Facebook` → use `Globe`
- `Twitter` → use `MessageCircle`
- `Linkedin` → use `Briefcase`
- `Youtube`, `Tiktok`, `Whatsapp`, `Github`, `Gitlab` → do NOT use

All other standard icons (77 verified) are fine in v1.18.0.

---

## 4. Backend Fix — Windows Smart App Control

**Problem:** Backend crashed with exit code `0xe0434352` (EXCEPTION_COMPLUS) and frontend showed `ERR_CONNECTION_REFUSED`.  
**Root cause:** Windows Smart App Control (`VerifiedAndReputablePolicyState = 1`) blocked the freshly-compiled DLL.  
**Fix:** Turned off Smart App Control in Windows Security settings.  
**Note:** `Unblock-File` did NOT help — this was not a Zone.Identifier issue.

---

## 5. Design System

All pages use this consistent dark-gold premium theme:

### Colors
```css
--bg:           #080808
--card-bg:      rgba(14,14,14,0.95)
--card-border:  1px solid rgba(255,255,255,0.07)
--gold:         #d4af37
--gold-bright:  #f4d03f
--text-primary: #f0ece4
--text-muted:   rgba(170,165,155,0.70)
--green:        #4caf50   /* confirmed/success */
--amber:        #f59e0b   /* pending */
--red:          #ef4444   /* cancelled/error */
--blue:         #3b82f6   /* info/view */
```

### Key Patterns
```css
/* Gold CTA button */
background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
color: #080808; font-weight: 700; border: none; border-radius: 10px;

/* Dark input */
background: rgba(255,255,255,0.04);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 10px; color: #f0ece4;
/* focus: */ border-color: rgba(212,175,55,0.40);

/* Glass morphism */
backdrop-filter: blur(16px);
background: rgba(6,6,6,0.60);

/* Card hover lift */
transform: translateY(-6px);
border-color: rgba(212,175,55,0.35);
box-shadow: 0 20px 40px rgba(0,0,0,0.50), 0 0 20px rgba(212,175,55,0.10);

/* Hero structure */
.hero-bg      → position:absolute; inset:0; background-image; animation: Ken Burns zoom
.hero-overlay → position:absolute; inset:0; dark gradient
.hero-inner   → position:relative; z-index:3; content

/* Two-line wordmark (Navbar, Footer, AdminLayout) */
"ELEGANT"       → gold, small-caps, letter-spacing:0.25em, font-size:0.65rem
"Celebrations"  → white, font-weight:700, font-size:1.05rem
```

### Status Badges
```css
/* Confirmed/Active */ background:rgba(76,175,80,0.12);  border:1px solid rgba(76,175,80,0.25);  color:#4caf50
/* Pending */          background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.25); color:#f59e0b
/* Cancelled */        background:rgba(239,68,68,0.12);  border:1px solid rgba(239,68,68,0.25);  color:#ef4444
/* Unread/Info */      background:rgba(59,130,246,0.12); border:1px solid rgba(59,130,246,0.25); color:#3b82f6
```

---

## 6. All Pages — Status

### Public Pages
| File | Status | Key Features |
|---|---|---|
| `Navbar.js/css` | ✅ | Glass morphism, avatar dropdown, mobile right-drawer, gold active pill |
| `Footer.js/css` | ✅ | 4-col grid, ornament top line, gold link dots, back-to-top |
| `HomePage.js/css` | ✅ | Ken Burns hero, dark glass search bar, stats strip, gallery mosaic, How It Works, Why Us, CTA |
| `HallsPage.js/css` | ✅ | Image hero, dark filter sidebar, sort dropdown, active filter pills, skeleton loader |
| `HallCard.js/css` | ✅ | 230px image, location badge, "View Hall →" hover hint, list mode |
| `PackagesPage.js/css` | ✅ | 3-tier cards, featured gold card, add-ons grid, comparison table |
| `GalleryPage.js/css` | ✅ | Fetches from API, shimmer skeleton, category filter pills, lightbox modal |
| `AboutPage.js/css` | ✅ | Story + stats strip, team cards, values grid, CTA |
| `ContactPage.js/css` | ✅ | Two-column layout, dark glass form, FAQ accordion, Google Maps embed |
| `BookingPage.js/css` | ✅ | 3-step progress bar (margin-top: 48px), dark form panels, sticky pricing summary, payment cards |
| `BookingSuccessPage.js/css` | ✅ | Floating particles, animated check, booking details grid, next steps |
| `HallDetailPage.js/css` | ✅ | Full-width image hero, sticky booking sidebar, amenities grid, lightbox |
| `ProfilePage.js/css` | ✅ | Dark sidebar nav, 5 tabs, gold toggle switches, localStorage notif persistence |
| `LoginPage.js` | ✅ | Two-panel split, show/hide password |
| `RegisterPage.js` | ✅ | Same split layout, password strength bar |
| `AuthPages.css` | ✅ | Shared auth styles |

### Admin Pages
| File | Status | Key Features |
|---|---|---|
| `AdminLayout.js/css` | ✅ | Glass sidebar, pending bookings badge, unread messages badge, sticky topbar, mobile bottom nav bar |
| `AdminDashboard.js/css` | ✅ | Colored stat cards, dark shimmer table, booking detail modal |
| `AdminHalls.js/css` | ✅ | Dark glass modals, gold dashed upload zone, image compression, gallery grid, package cards |
| `AdminBookings.js/css` | ✅ | Newest first, NEW badge, Booked On column, pagination (8/page), status badges |
| `AdminContacts.js/css` | ✅ | Gold left-border unread, detail modal, reply/mark-read/delete, pagination (10/page) |
| `AdminGallery.js/css` | ✅ | Category tabs, drag-and-drop upload, image grid with hover-delete, confirm modal, toasts |

---

## 7. Features Implemented

### ✅ Mobile Bottom Navigation Bar (AdminLayout.js/css)
- Fixed bottom tab bar visible only on mobile (≤768px)
- Shows all 5 admin sections: Dashboard, Manage Halls, Bookings, Messages, Gallery
- Gold active state, badge dots for pending bookings / unread messages
- `safe-area-inset-bottom` padding for iPhone home indicator
- `admin-content` bottom padding increased to 80px to avoid content hiding behind bar
- Hamburger sidebar remains as secondary navigation option

### ✅ Password Hashing (AuthController.cs)
- Register: `PasswordHasher<User>().HashPassword()` — PBKDF2-SHA256
- Login: `PasswordHasher<User>().VerifyHashedPassword()`
- Admin seed in `Program.cs` also hashed

### ✅ Authorization (Controllers)
- `[Authorize(Roles = "Admin")]` on: POST/PUT/DELETE Halls, GET/PUT Bookings, GET/PUT/DELETE Contacts, POST/DELETE Gallery
- `[Authorize]` on: POST Bookings (any logged-in user)
- JWT Role claim already emitted at `AuthController.cs:90`

### ✅ API URL Environment Variable (api.js)
```js
const API_BASE = process.env.REACT_APP_API_URL || "https://localhost:7134/api";
```

### ✅ Configurable CORS (Program.cs)
- Reads `AllowedOrigins` config key (comma-separated) at startup
- Always includes `localhost:3000` and `localhost:5173`
- Set `AllowedOrigins=https://elegantcelebrations.vercel.app` in Railway

### ✅ PostgreSQL Migration (for Railway)
- Removed `Microsoft.EntityFrameworkCore.SqlServer`
- Added `Npgsql.EntityFrameworkCore.PostgreSQL 8.0.11`
- `UseNpgsql()` in Program.cs
- Railway `DATABASE_URL` URI auto-converted to Npgsql key-value format
- `AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true)` — allows `DateTime.Now` (local) with PostgreSQL

### ✅ Railway Deployment Fixes (Program.cs)
- Dynamic port: `builder.WebHost.UseUrls($"http://0.0.0.0:{PORT}")`
- HTTPS redirect disabled in production: `if (IsDevelopment()) app.UseHttpsRedirection()`

### ✅ CSS Class Collision Fix
All page-specific CSS classes renamed to be page-scoped (no global collisions):
- `.page-hero` → `.about-page-hero`, `.contact-page-hero`, `.gallery-page-hero`, `.pkg-page-hero`
- `.hero-bg` → `.home-hero-bg`, `.hero-overlay` → `.home-hero-overlay`
- `.section-title` → `.home-section-title`, `.adash-section-title`
- `.lightbox-overlay` → `.gallery-lightbox-overlay`, `.hd-lightbox-overlay`

### ✅ Trackpad Scroll Freeze Fix (HomePage.css)
- `.hero { overflow: clip }` (was `hidden`) — prevents false scroll container
- `will-change: transform` on `.home-hero-bg` — pre-promotes GPU layer

### ✅ Admin Gallery Management (`/admin/gallery`)
- Category tabs, drag-and-drop upload, compression (1200px/80% JPEG), optional caption
- Image grid with hover-delete, confirm modal, toast notifications
- Public GalleryPage fetches from API with shimmer skeleton

### ✅ Seeded Data (live Railway DB)
- **15 halls** across Pakistan (Karachi, Lahore, Islamabad, Faisalabad, Multan, Peshawar, Quetta, Sialkot, Rawalpindi, Hyderabad, Abbotabad, Murree)
- **46 gallery images** across 5 categories (Ceremony Halls, Reception, Decoration, Outdoor, Guest Moments)

### ✅ Google Maps Embed (ContactPage)
```jsx
<iframe src="https://maps.google.com/maps?q=Nazimabad+Karachi+Pakistan&...&output=embed" />
```

### ✅ Dynamic Page Titles
Every page: `useEffect(() => { document.title = "Page — Elegant Celebrations"; }, [])`

### ✅ Image Compression (AdminHalls + AdminGallery)
Canvas-based: max 1200px, 80% JPEG quality

### ✅ Email Notifications (Backend)
`Services/EmailService.cs` — fires on booking create/status change.
Controlled by `Email:Enabled` in `appsettings.json` (default `false`).

### ✅ Pagination
- AdminBookings: 8 per page
- AdminContacts: 10 per page

---

## 8. Bug Fixes

### Icon Crash (white-screen)
| File | Bad Icon | Fixed With |
|---|---|---|
| `Footer.js` | `Instagram`, `Facebook`, `Twitter` | `Camera`, `Globe`, `MessageCircle` |
| `AboutPage.js` | `Linkedin`, `Twitter` | `Briefcase`, `MessageCircle` |
| `ContactPage.js` | `Instagram`, `Facebook`, `Twitter` | `Camera`, `Globe`, `MessageCircle` |

### ESLint CI Errors (fixed for Vercel deploy)
- `Navbar.js` — removed unused `Menu` import
- `AboutPage.js` — removed unused `TIMELINE` variable

### App.css Broken Media Query
All global styles were accidentally inside `@media (prefers-reduced-motion: no-preference)`. Fixed.

### Bookings Sort Order
Removed double `.slice().reverse()` that was flipping backend's newest-first order.

### Homepage Auto-Scroll + Lag
- `history.scrollRestoration = "manual"` + instant ScrollToTop fix
- Removed `will-change` from reveal classes

### Multiple Backend Processes (Port Conflict)
```powershell
Get-Process -Name "WeddingHallAPI" | Stop-Process -Force
```

---

## 9. Backend Structure

```
WeddingHallAPI/
├── Controllers/
│   ├── AuthController.cs        ← password hashing, JWT
│   ├── HallsController.cs       ← [Authorize(Roles="Admin")] on POST/PUT/DELETE
│   ├── BookingsController.cs    ← [Authorize] on POST, [Authorize(Roles="Admin")] on GET/PUT
│   ├── ContactsController.cs    ← [Authorize(Roles="Admin")] on GET/PUT/DELETE
│   └── GalleryController.cs     ← [Authorize(Roles="Admin")] on POST/DELETE
├── Models/
│   ├── User.cs
│   ├── Hall.cs / HallImage.cs
│   ├── Package.cs
│   ├── Booking.cs / Payment.cs
│   ├── Contact.cs
│   └── GalleryImage.cs
├── Data/
│   └── AppDbContext.cs
├── Services/
│   └── EmailService.cs
├── DTOs/
│   └── BookingDTO.cs
├── Program.cs                   ← Npgsql, dynamic PORT, configurable CORS, legacy timestamps
└── appsettings.json             ← AllowedOrigins, Jwt config, Email config
```

### Database Tables
`Users`, `Halls`, `HallImages`, `Packages`, `Bookings`, `Payments`, `Contacts`, `GalleryImages`

> **EnsureCreated:** Adding a new table requires dropping the DB and restarting. On Railway, redeploy the service — EnsureCreated rebuilds the schema automatically against the Railway PostgreSQL DB.

---

## 10. Frontend File Structure (src/)

```
src/
├── App.js           # Router, ScrollToTop, scroll restoration, reveal observer
├── App.css          # Global: Inter font, body, scrollbar, buttons, inputs
├── index.css        # Reveal/animation classes, spinner, glow-sweep
├── components/
│   ├── Navbar.js / Navbar.css
│   ├── Footer.js / Footer.css
│   ├── HallCard.js / HallCard.css
│   └── AdminLayout.js / AdminLayout.css
├── pages/
│   ├── HomePage.js / .css
│   ├── HallsPage.js / .css
│   ├── HallDetailPage.js / .css
│   ├── BookingPage.js / .css        ← .booking-steps margin-top: 48px
│   ├── BookingSuccessPage.js / .css
│   ├── PackagesPage.js / .css
│   ├── GalleryPage.js / .css
│   ├── AboutPage.js / .css
│   ├── ContactPage.js / .css
│   ├── ProfilePage.js / .css
│   ├── LoginPage.js / AuthPages.css
│   ├── RegisterPage.js
│   ├── MyBookingsPage.js
│   └── admin/
│       ├── AdminDashboard.js / .css
│       ├── AdminHalls.js / .css
│       ├── AdminBookings.js / .css
│       ├── AdminContacts.js / .css
│       └── AdminGallery.js / .css
└── services/
    └── api.js       # REACT_APP_API_URL env var, all axios calls
```

---

## 11. API Endpoints

| Method | Endpoint | Auth | Used In |
|---|---|---|---|
| GET | `/api/Halls` | — | HallsPage, AdminDashboard |
| GET | `/api/Halls/{id}` | — | HallDetailPage |
| POST | `/api/Halls` | Admin | AdminHalls |
| PUT | `/api/Halls/{id}` | Admin | AdminHalls |
| DELETE | `/api/Halls/{id}` | Admin | AdminHalls |
| GET | `/api/Bookings` | Admin | AdminDashboard, AdminBookings |
| POST | `/api/Bookings` | User | BookingPage |
| PUT | `/api/Bookings/{id}/status` | Admin | AdminDashboard, AdminBookings |
| GET | `/api/Contacts` | Admin | AdminLayout, AdminContacts |
| POST | `/api/Contacts` | — | ContactPage |
| PUT | `/api/Contacts/{id}/read` | Admin | AdminContacts |
| DELETE | `/api/Contacts/{id}` | Admin | AdminContacts |
| GET | `/api/Gallery` | — | GalleryPage, AdminGallery |
| POST | `/api/Gallery` | Admin | AdminGallery |
| DELETE | `/api/Gallery/{id}` | Admin | AdminGallery |
| POST | `/api/Auth/login` | — | LoginPage |
| POST | `/api/Auth/register` | — | RegisterPage |

---

## 12. localStorage Keys

| Key | Purpose |
|---|---|
| `token` | JWT auth token |
| `user` | JSON `{ fullName, email, role }` |
| `notifs_<email>` | Per-user notification preferences (ProfilePage) |
| `wishlist` | Array of hall IDs (HallDetailPage) |

---

## 13. Routes

| Path | Component |
|---|---|
| `/` | HomePage |
| `/halls` | HallsPage |
| `/halls/:id` | HallDetailPage |
| `/book/:id` | BookingPage |
| `/booking-success` | BookingSuccessPage |
| `/packages` | PackagesPage |
| `/gallery` | GalleryPage |
| `/about` | AboutPage |
| `/contact` | ContactPage |
| `/profile` | ProfilePage |
| `/my-bookings` | MyBookingsPage |
| `/login` | LoginPage |
| `/register` | RegisterPage |
| `/admin` | AdminLayout > AdminDashboard |
| `/admin/halls` | AdminLayout > AdminHalls |
| `/admin/bookings` | AdminLayout > AdminBookings |
| `/admin/contacts` | AdminLayout > AdminContacts |
| `/admin/gallery` | AdminLayout > AdminGallery |

---

## 14. Known Gotchas

1. **lucide-react v1.18.0** — Brand icons crash the app. Use `Camera`, `Globe`, `MessageCircle`, `Briefcase` instead.

2. **Backend must use `--launch-profile https`** — Plain `dotnet run` binds to HTTP port 5259. Frontend expects `https://localhost:7134`.

3. **Multiple backend processes** — Always run `Get-Process -Name "WeddingHallAPI" | Stop-Process -Force` before restarting.

4. **EF Core EnsureCreated** — No migrations. Adding a new table requires dropping the DB (locally) or redeploying (Railway).

5. **Windows Smart App Control** — If backend crashes with `0xe0434352` after recompile, turn off in Windows Security → App & browser control.

6. **Base64 images** — Stored in DB. Canvas compression (1200px, 80% JPEG) applied before upload.

7. **`auth-change` event** — Logout fires `window.dispatchEvent(new Event("auth-change"))` so Navbar updates reactively.

8. **Railway DATABASE_URL** — Comes as a `postgresql://` URI. Program.cs converts it to Npgsql key-value format manually. `AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true)` required to use `DateTime.Now` with PostgreSQL.

9. **Vercel CI** — Treats ESLint warnings as errors. All unused imports/variables must be cleaned before pushing.

10. **Railway Root Directory** — Must be set to `WeddingHallAPI` in service Settings → Source, otherwise Railpack can't find the `.csproj`.

---

## 15. Presentation Notes

- **In-house (July 2, 2026):** Railway credits last ~10 days from June 26. Safe. Just open the site.
- **If selected for main exhibition:** Add card to Railway ($5/month). No migration needed.
- **Warm up tip:** Open https://elegantcelebrations.vercel.app 1 minute before presenting in case of any cold start.
- **Re-seed script:** If DB is ever wiped, the PowerShell seeding scripts for halls (15) and gallery (46 images) can be re-run pointed at the Railway API URL with admin credentials.
