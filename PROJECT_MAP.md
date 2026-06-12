# PROJECT_MAP — Tech E-Commerce Store

## [TECH_STACK]
- **Frontend:** React 19 + Vite 8 + Tailwind CSS 4 + React Router 7 + Inter / Manrope / Plus Jakarta Sans
- **Backend:** Express 5 + Mongoose 9 + JWT (jsonwebtoken 9) + bcryptjs 3
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT Bearer tokens (7d expiry), bcrypt password hashing
- **HTTP Client:** Axios 1 (with interceptors for auto-auth + global loading tracking)
- **Notifications:** react-hot-toast 2
- **Email:** Resend (via resend npm package)
- **Security:** helmet (HTTP headers), sanitized error responses, JWT auth on protected routes
- **Dark mode default:** Applied via `.dark` class on `<html>` (main.jsx reads localStorage)
- **Theme toggle:** ThemeContext add/removes `.dark` class; light mode = no class
- **CSS theming:** `:root` vars = light palette, `.dark` vars = dark palette; `@custom-variant dark` enables `dark:` Tailwind utilities
- **Light-mode overrides:** Opacity-based classes (`bg-white/5`, `border-white/10`, `text-white/80`, etc.) assume dark backgrounds; mapped to solid light colors (e.g. `#F1F5F9`, `#E2E8F0`, `#475569`) for light mode, restored in `.dark` block
- **Input text contrast:** `input.text-white`, `textarea.text-white`, `select.text-white` overridden to `#0F172A` in light mode (prevents invisible text on light input backgrounds), restored to `#FFFFFF` in `.dark`
- **Text utility contrast:** `text-gray-400` overridden to `#64748B` (spec muted), `text-gray-500` to `#475569` (spec secondary) for proper WCAG AA contrast in light mode
- **Glass/glow theming:** `--glass-bg`, `--glass-border`, `--glass-shadow`, `--glow-shadow` CSS vars are set per-theme in `:root` / `.dark`

## [DESIGN SYSTEM]

### Light Theme (default when no `.dark` class)
- **Background:** `#F8FAFC`, Sections `#F1F5F9`, Cards `#FFFFFF`
- **Accent:** Electric blue `#3B5BFF`, hover `#2949F5`, soft surfaces `#EEF2FF`
- **Typography:** Primary `#0F172A`, Secondary `#475569`, Muted `#64748B`
- **Borders:** `#E2E8F0`, Subtle `#CBD5E1`
- **Glassmorphism:** `glass-card` — white semi-transparent bg, soft shadows, blue border tint
- **Cards:** Clean white, 20px radius, soft shadow, subtle blue glow on hover
- **Hero accent glow:** rgba(59, 91, 255, 0.15–0.35) blurred ambient orbs

### Dark Theme (`.dark` class active)
- **Background:** Deep navy/black `#050816`, cards `#0B1020`
- **Accent:** Electric blue `#3B5BFF` → dark variant `#6B8BFF`
- **Typography:** High-contrast white `#F1F5F9`, secondary slate `#64748B`
- **Borders:** Subtle blue-tinted `rgba(59, 91, 255, 0.10)`
- **Glassmorphism:** `glass-card` — dark semi-transparent bg, stronger shadows, blue border tint

### Shared
- **Buttons:** Pill-shaped (`rounded-full`) or 12px–16px radius, solid `bg-blue-600`, glow hover
- **Hover states:** Glow box-shadow, `-4px` lift (`.glow-on-hover`), `hover:bg-blue-700` background on all `bg-blue-600` buttons, smooth 300ms transitions
- **Animations:** `float-slow`/`float-slower` for decorative orbs, `glow-pulse` for accent, `fade-in`/`scale-in` for transitions, `loading-bar` for API requests
- **Responsiveness:** Responsive down to 344px viewport; 2-column grid on mobile for products/categories/wishlist, single-column for features/footer/auth; `p-4` mobile padding on tight cards, `gap-4` mobile grid gaps, image sizes scale down with `sm:` prefix
- **Font stack:** Inter (primary), Manrope (headings), Plus Jakarta Sans (alternative)

## [SYSTEM_FLOW]
```
Browser → React SPA → Axios → Express REST API → Mongoose → MongoDB
                              ↕
                         JWT Auth Middleware
```

**Public routes:** GET /api/products, GET /api/products/:id
**Auth routes:** POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
**Authenticated routes:** GET/POST/PATCH/DELETE /api/cart, GET/POST/DELETE /api/wishlist, POST /api/checkout
**Admin routes:** POST /api/products (add), DELETE /api/products/:id (delete)

### User Journeys
1. **Customer (public):** Landing page → browse hero → shop by category → product grid → click product → detail page
2. **Admin (authenticated):** Login → Click "Admin" in nav → Add/delete products
3. **Authenticated user:** Like products → View wishlist → Add to cart → Edit cart quantities → Checkout → Order email sent to admin
4. **Unauthenticated user:** Try to add to cart / like → Redirected to /login
5. **Any user:** Register → Login → Browse products (search filters in real time)
6. **First run:** 7 mock products auto-seeded into empty database on server start

## [ARCHITECTURE]
```
mern/
├── PROJECT_MAP.md
├── README.md
├── server/
│   ├── index.js              # Express entry + middleware wiring
│   ├── .env / .env.example
│   ├── package.json
│   ├── config/
│   │   └── db.js             # Mongoose connection + seed 7 products
│   ├── models/
│   │   ├── User.js           # email, name, passwordHash, isAdmin
│   │   ├── Product.js        # name, slug, description, price, image, category, specs
│   │   ├── CartItem.js       # user, product, quantity
│   │   └── WishlistItem.js   # user, product
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   └── admin.js          # isAdmin check (uses authRequired)
│   └── routes/
│       ├── auth.js           # register, login, me
│       ├── products.js       # GET all, GET by id, POST (admin), DELETE (admin)
│       ├── cart.js           # GET items, POST add, PATCH qty, DELETE item
│       ├── checkout.js       # POST order (validates form, sends email via Resend, clears cart)
│       └── wishlist.js       # GET items, POST toggle, DELETE item
└── client/
    ├── index.html            # Meta description, async font preload (Inter + Manrope + Jakarta Sans)
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx          # React entry + browser router + dark mode pre-apply
        ├── App.jsx           # Providers + routes + scroll-to-top on route change + footer
        ├── index.css         # Tailwind v4 + custom dark variant + CSS vars (dual-theme: light/dark) + accent overrides + glass-card/glow-on-hover utilities + opacity-class theming + animations
        ├── lib/
        │   ├── api.js        # Axios instance with JWT + loading interceptors
        │   └── loadingManager.js # Module-level loading counter (no React deps)
        ├── context/
        │   ├── AuthContext.jsx    # Auth state provider (login, register, logout, user)
        │   ├── CartContext.jsx    # Cart state: items, addItem, updateQuantity, removeItem, fetchCart
        │   ├── WishlistContext.jsx # Wishlist state: items, isLiked, toggleLike
        │   ├── ThemeContext.jsx   # Dark/light theme toggle, persisted in localStorage
        │   └── LoadingContext.jsx # Bridges loadingManager → React
        ├── components/
        │   ├── Navbar.jsx      # Sticky frosted-glass navbar (theme-aware CSS vars), search bar, mobile hamburger
        │   ├── ProductCard.jsx # Glassmorphism card, solid bg-blue-500/5 image area, glow hover lift, like button
        │   ├── LoadingBanner.jsx # Fixed 2px solid bg-blue-500 bar during API calls
        │   ├── Hero.jsx        # Floating blurred orbs, flat text-blue-400 headline, CTA buttons with scrollIntoView
        │   ├── Categories.jsx  # 4 interactive category cards with glow hover + onCategoryClick prop
        │   ├── Features.jsx    # SaaS-style feature cards (icon + title + desc)
        │   └── Footer.jsx      # Minimal dark footer with links
        └── pages/
            ├── Login.jsx           # Glass card form
            ├── Register.jsx        # Glass card form
            ├── Products.jsx        # Hero + Categories + filtered product grid + Features
            ├── ProductDetail.jsx   # Single product view + specs + add-to-cart + like
            ├── Cart.jsx            # Cart with qty controls, remove, checkout button
            ├── Checkout.jsx        # Glass card form + order summary
            ├── Wishlist.jsx        # Liked products grid
            └── AdminDashboard.jsx  # Glass card table + add form
```

## [ORPHANS & PENDING]
- Admin flag must be set manually via MongoDB shell or seed script (no admin registration endpoint)
- No image upload — products use URL strings
- No pagination — returns all products (acceptable for <500 items)
- No rate limiting on auth routes (future enhancement)
- 7 mock products auto-seeded on first run when DB is empty (MacBook Pro, iPhone 17 Pro Max, iPad Air, Galaxy Tab, Sony WH-1000XM6, Logitech MX Keyboard, Dell UltraSharp Monitor)
- Checkout sends email via Resend only (no payment processing, no order history stored)
- Categories section accepts `onCategoryClick` prop from Products page to set `?category=` URL param when a category card is clicked
- Search+category use client-side filtering via URL search params (no server-side endpoints)
- Checkout order summary `sticky top-24` → `md:sticky md:top-24` to prevent sticky overlap on mobile viewports
- Navbar inner wrapper `relative` for reliable `absolute top-full` mobile dropdown positioning (works around browsers where `sticky` doesn't establish a containing block)
- Navbar mobile horizontal padding reduced to `px-3 md:px-4` — 12px on mobile vs 16px for edge-to-edge feel at 350px
- 350px overflow protection: App `min-h-screen` div gets `overflow-x-hidden` to prevent any horizontal scroll site-wide; Navbar inner container gets `w-full` for full-width fill; Checkout outer container gets `w-full`; Order Summary flex items get `flex-wrap`
