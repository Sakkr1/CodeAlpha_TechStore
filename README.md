# TechStore — MERN E-Commerce

A full-stack e-commerce store for premium tech products built with React 19, Express 5, MongoDB, and Tailwind CSS 4. Features a dark-mode-first UI with indigo accent palette, customer cart/wishlist flows, admin product management, and email-based checkout via Resend.

## Tech Stack

| Layer        | Technology                                                        |
| ------------ | ----------------------------------------------------------------- |
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios           |
| **Backend**  | Express 5, Mongoose 9, JWT, bcryptjs                              |
| **Database** | MongoDB                                                           |
| **Auth**     | JWT Bearer tokens (7d expiry), bcrypt password hashing             |
| **Email**    | Resend (order confirmation)                                       |
| **Security** | Helmet (HTTP headers), sanitized error responses, auth middleware  |
| **Perf**     | Compression (gzip), async font preloading, lazy images, CLS prevention |

## Features

### Customer
- **Product catalog** — responsive grid (2-3-4 columns) with product cards, add-to-cart, and like/wishlist buttons
- **Product detail** — full specs table, quantity selector, add-to-cart, wishlist toggle
- **Shopping cart** — quantity +/- controls, remove items, total price, "Proceed to Checkout"
- **Wishlist** — like/unlike products, add wishlist items to cart
- **Checkout** — shipping form + order summary; submits order via email (Resend); cart auto-clears on success
- **Auth redirect** — unauthenticated add-to-cart / like actions redirect to `/login`

### Admin
- **Dashboard** — product table with horizontal scroll, dynamic add form (key-value specs), delete with confirmation

### Global
- **Dark/light theme** — default dark, persisted to localStorage, applied before React mount (prevents flash)
- **Indigo accent palette** — globally overrides Tailwind's blue utilities via CSS custom properties
- **Glass-morphism navbar** — `backdrop-blur-md`, gradient logo (`from-indigo-500 to-purple-600`), responsive hamburger menu
- **Loading banner** — thin animated gradient bar across the top during any API request
- **Animations** — fade-in pages, scale-in cards, hover transitions on all links/buttons
- **Lighthouse optimized** — async font preload, `width`/`height` on images (CLS prevention), `aria-label` on all inputs, `<meta name="description">`, first card LCP-optimized

## Architecture

```
Browser → React SPA → Axios (with JWT interceptor + loading tracker) → Express REST API → Mongoose → MongoDB
                                                                          ↕
                                                                     JWT Auth Middleware
```

### Routes

| Method | Endpoint                  | Access       | Description                    |
| ------ | ------------------------- | ------------ | ------------------------------ |
| GET    | `/api/products`           | Public       | List all products              |
| GET    | `/api/products/:id`       | Public       | Single product                 |
| POST   | `/api/auth/register`      | Public       | Register user                  |
| POST   | `/api/auth/login`         | Public       | Login                          |
| GET    | `/api/auth/me`            | Authenticated| Current user profile           |
| GET    | `/api/cart`               | Authenticated| Get cart items                 |
| POST   | `/api/cart`               | Authenticated| Add to cart                    |
| PATCH  | `/api/cart/:id`           | Authenticated| Update quantity                |
| DELETE | `/api/cart/:id`           | Authenticated| Remove cart item               |
| GET    | `/api/wishlist`           | Authenticated| Get wishlist items             |
| POST   | `/api/wishlist`           | Authenticated| Toggle wishlist (add/remove)   |
| DELETE | `/api/wishlist/:id`       | Authenticated| Remove wishlist item           |
| POST   | `/api/checkout`           | Authenticated| Submit order (email + clear)   |
| POST   | `/api/products`           | Admin        | Add product                    |
| DELETE | `/api/products/:id`       | Admin        | Delete product                 |

## Project Structure

```
mern/
├── server/
│   ├── index.js                 # Express entry, middleware wiring
│   ├── config/db.js             # Mongoose connection + seed 7 products
│   ├── models/
│   │   ├── User.js              # email, name, passwordHash, isAdmin
│   │   ├── Product.js           # name, slug, description, price, image, category, specs
│   │   ├── CartItem.js          # user, product, quantity
│   │   └── WishlistItem.js      # user, product
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── admin.js             # isAdmin guard
│   └── routes/
│       ├── auth.js              # register, login, me
│       ├── products.js          # CRUD
│       ├── cart.js              # CRUD
│       ├── wishlist.js          # toggle, list, delete
│       └── checkout.js          # POST order → Resend → clear cart
└── client/
    ├── index.html               # Meta, async font preload
    └── src/
        ├── main.jsx             # React root, dark mode pre-apply
        ├── App.jsx              # Providers + routes
        ├── index.css            # Tailwind v4 + dark vars + animations
        ├── lib/
        │   ├── api.js           # Axios instance with JWT + loading interceptors
        │   └── loadingManager.js # Module-level loading counter (no React deps)
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── CartContext.jsx   # Redirects to /login when !user
        │   ├── WishlistContext.jsx
        │   ├── ThemeContext.jsx  # localStorage-persisted, defaults dark
        │   └── LoadingContext.jsx # Bridges loadingManager → React
        ├── components/
        │   ├── Navbar.jsx       # Glass morph, responsive, theme toggle
        │   ├── ProductCard.jsx  # Card with add-to-cart + like + priority prop
        │   └── LoadingBanner.jsx # Fixed gradient bar during API calls
        └── pages/
            ├── Products.jsx     # Catalog grid (2-3-4 cols)
            ├── ProductDetail.jsx # Single view + specs table
            ├── Cart.jsx         # Qty controls, remove, checkout button
            ├── Checkout.jsx     # Form + order summary
            ├── Wishlist.jsx     # Liked products grid
            ├── AdminDashboard.jsx # Product table + add/delete
            ├── Login.jsx
            └── Register.jsx
```

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Resend API key (free at resend.com)

### Installation

```bash
# Clone and install
git clone <repo-url>
cd mern

# Server
cd server
cp .env.example .env   # Edit with your values
npm install

# Client
cd ../client
npm install
```

### Environment Variables (`server/.env`)

```
MONGO_URI=mongodb://localhost:27017/techstore
JWT_SECRET=your-secret-key-here
RESEND_API_KEY=re_xxxxx
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

### Run

```bash
# Terminal 1 — Server
cd server
npm run dev

# Terminal 2 — Client
cd client
npm run dev
```

The server auto-seeds **7 tech products** into the database on first start when the collection is empty.

Open `http://localhost:5173` — you'll see the product catalog with dark theme active.

### First-time Admin Setup

The admin flag (`isAdmin`) must be set manually in MongoDB:

```javascript
// In mongosh
use techstore
db.users.updateOne({ email: "your@email.com" }, { $set: { isAdmin: true } })
```

No admin registration endpoint exists by design.

## User Journeys

1. **Browse** — visit `/` → see product grid with images, prices, add-to-cart and like buttons
2. **Register / Login** → `/register` → `/login` → get JWT token stored in localStorage
3. **Wishlist** — like products from grid or detail → view at `/wishlist` → add to cart or unlike
4. **Cart** — add items → manage quantities at `/cart` → click "Proceed to Checkout"
5. **Checkout** — fill shipping form at `/checkout` → submit → order email sent to admin → cart cleared → redirected to home
6. **Admin** — login as admin → `/admin` → see product table → add new products (with dynamic specs) → delete products
7. **Unauthenticated** — any add-to-cart or like attempt redirects to `/login`

## API Design

All API responses follow a consistent JSON format:

```json
// Success
{ "items": [...], "message": "..." }

// Error
{ "error": "Description" }
```

Server errors (500+) never leak the error message — returns `"Internal server error"` with full detail logged server-side.

## Security

- **Helmet** — sets security-related HTTP headers (X-Content-Type-Options, X-Frame-Options, etc.)
- **JWT auth** — token required for all cart, wishlist, and checkout routes
- **Admin guard** — `isAdmin` check on product create/delete
- **Sanitized errors** — 5xx responses never expose internal details
- **Input validation** — checkout requires all required fields; server validates request body
- **bcrypt** — passwords hashed with salt rounds

## Performance Optimizations

| Optimization | Implementation |
|---|---|
| Gzip compression | `compression()` middleware on all routes |
| Async font loading | `<link rel="preload" as="style" onload="this.rel='stylesheet'">` |
| CLS prevention | `width` + `height` attributes on all product images |
| Lazy loading | `loading="lazy"` on off-screen images |
| LCP priority | First product card: `fetchPriority="high"`, `loading="eager"` |
| Dark mode flash prevention | localStorage read before React mount |

## Limitations & Future

- **No payment processing** — checkout sends email only; no order history stored
- **No image upload** — products use URL strings (no Cloudinary configured)
- **No pagination** — all products returned at once (fine for <500 items)
- **No search/filter** — future enhancement for product catalog
- **No rate limiting** — future enhancement for auth routes
- **Admin registration** — `isAdmin` flag must be set manually in MongoDB
