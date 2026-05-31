# PROJECT_MAP — Tech E-Commerce Store

## [TECH_STACK]
- **Frontend:** React 19 + Vite 8 + Tailwind CSS 4 + React Router 7 + Inter font
- **Backend:** Express 5 + Mongoose 9 + JWT (jsonwebtoken 9) + bcryptjs 3
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT Bearer tokens (7d expiry), bcrypt password hashing
- **HTTP Client:** Axios 1 (with interceptors for auto-auth)
- **Notifications:** react-hot-toast 2
- **Email:** Resend (via resend npm package)
- **Security:** helmet (HTTP headers), sanitized error responses, JWT auth on protected routes
- **Default theme:** Dark mode (light stored in localStorage)

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
1. **Customer (public):** Browse product grid → Click product → View detail page
2. **Admin (authenticated):** Login → Click "Admin" in nav → Add/delete products
3. **Authenticated user:** Like products → View wishlist → Add to cart → Edit cart quantities → Checkout → Order email sent to admin
4. **Unauthenticated user:** Try to add to cart / like → Redirected to /login
5. **Any user:** Register → Login → Browse products
5. **First run:** 7 mock products auto-seeded into empty database on server start

## [ARCHITECTURE]
```
mern/
├── PROJECT_MAP.md
├── server/
│   ├── index.js              # Express entry + middleware wiring
│   ├── .env / .env.example
│   ├── package.json
│   ├── config/
│   │   └── db.js             # Mongoose connection
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
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx          # React entry + browser router + auth provider
        ├── App.jsx           # Routes + CartProvider + WishlistProvider
        ├── index.css         # Tailwind v4 + Inter font + dark mode CSS vars + indigo accent overrides + animations
        ├── lib/
        │   └── api.js        # Axios instance with JWT interceptor
        ├── context/
        │   ├── AuthContext.jsx    # Auth state provider (login, register, logout, user)
│ ├── CartContext.jsx    # Cart state: items, addItem, updateQuantity, removeItem, fetchCart
        │   ├── WishlistContext.jsx # Wishlist state: items, isLiked, toggleLike
        │   └── ThemeContext.jsx   # Dark/light theme toggle, persisted in localStorage
        ├── components/
        │   ├── Navbar.jsx     # Top nav (glass morph), gradient brand, theme toggle, mobile hamburger menu
        │   └── ProductCard.jsx # Product card with add-to-cart + like button
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Products.jsx       # Public catalog grid
            ├── ProductDetail.jsx  # Single product view + add-to-cart + like
            ├── Cart.jsx           # Cart with qty controls, remove, Checkout button
            ├── Checkout.jsx       # Order form + summary + email submission via Resend
            ├── Wishlist.jsx       # Liked products grid
            └── AdminDashboard.jsx # Admin product CRUD table + add form
```

## [ORPHANS & PENDING]
- Admin flag must be set manually via MongoDB shell or seed script (no admin registration endpoint)
- No image upload — products use URL strings
- No pagination — returns all products (acceptable for <500 items)
- No search/filter — future enhancement
- No rate limiting on auth routes (future enhancement)
- 7 mock products auto-seeded on first run when DB is empty (MacBook Pro, iPhone 17 Pro Max, iPad Air, Galaxy Tab, Sony WH-1000XM6, Logitech MX Keyboard, Dell UltraSharp Monitor)
- Checkout sends email via Resend only (no payment processing, no order history stored)
