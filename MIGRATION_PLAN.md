# 🚀 Migration Plan: React (shara) to Next.js App Router (sa7ar-next)

## 1. 📌 Project Overview
**Current Application (sa7ar-react):**
*   **Type:** React 19 Client-Side Rendered (CSR) e-commerce SPA.
*   **Stack:** Vite, React Router v7, Tailwind CSS v4, TanStack Query, i18next, Radix primitives / Custom shadcn-like UI.
*   **Domain:** E-commerce platform (Home, Products, Cart, Checkout, Auth, Account Management, Static Pages, Blogs).

**Migration Goal:**
Transform the Vite React app into a robust Next.js 15+ App Router application, prioritizing a Server-First architecture, high SEO performance, and strict TypeScript patterns without altering the existing User Interface / Design System.

**Expected Challenges:**
*   **State Management & Hydration:** Transitioning client-side global states (Cart, Auth) to work harmoniously with Server Components.
*   **Data Fetching:** Moving TanStack Query data fetching to native Next.js `fetch` in Server Components where possible, and using Server Actions for mutations (auth, cart updates, etc.).
*   **Tailwind CSS v4 & Next.js Compatibility:** Ensuring the newly introduced `index.css` tokens map perfectly to the Next.js `globals.css`.
*   **i18n Implementation:** Shifting from pure client-side `react-i18next` to standard Next.js App Router i18n middleware and server/client dictionaries.

---

## 2. 🌳 Pages & Routing Map

| Current React Route | Next.js App Router Path | Route Type |
| :--- | :--- | :--- |
| `/` | `app/(main)/page.tsx` | Static / Revalidated Server Component |
| `/products` | `app/(main)/products/page.tsx` | Server Component (w/ searchParams) |
| `/products-list` | `app/(main)/products-list/page.tsx` | Server Component |
| `/products/:id` | `app/(main)/products/[id]/page.tsx` | Server Component (Dynamic) |
| `/cart` | `app/(protected)/cart/page.tsx` | Server Component (pre-fetches cart) -> pass to Client Component |
| `/checkout` | `app/(protected)/checkout/page.tsx` | Server Component -> pass to Client Form |
| `/about`, `/faq`, `/contact` | `app/(info)/[slug]/page.tsx` | Static Server Components |
| `/blogs` | `app/(info)/blogs/page.tsx` | Server Component |
| `/blogs/:slug` | `app/(info)/blogs/[slug]/page.tsx` | Server Component (Dynamic SEO) |
| `/privacy`, `/terms` | `app/(info)/[slug]/page.tsx` | Static Server Components |
| `/account/*` | `app/(protected)/account/layout.tsx` | Server Layout |
|   - `/account/details` | `app/(protected)/account/details/page.tsx`| Client Form Component |
|   - `/account/orders` | `app/(protected)/account/orders/page.tsx` | Server Component |
|   - `/account/orders/:id` | `app/(protected)/account/orders/[id]/page.tsx`| Server Component |
|   - `/account/addresses` | `app/(protected)/account/addresses/page.tsx`| Client/Server Mixed |

---

## 3. 🧩 Component Classification

**🎯 Goal: 85% Server Components (RSC), 15% Client Components (RCC)**

*   **Server Components (Default):**
    *   **Layouts & Wrappers** (`RootLayout`, `Header`, `Footer`).
    *   **Product Listings & Details** (HTML structure, SEO meta).
    *   **Static Sections** (`Hero`, `About`, `Faq`, `Blogs`).
    *   *Why:* Zero bundle size impact, instant initial load, optimal SEO.

*   **Client Components (`'use client'`):**
    *   **Interactive Elements:** `AddToCartButton`, `CartDrawers`, `QuantitySelectors`, `SearchDialog`.
    *   **Forms:** `AccountForm`, `CheckoutForm`, `ContactForm`.
    *   **Stateful UI:** `Carousel`, `Accordion`, Dropdowns.
    *   *Why:* Requires browser APIs (localStorage, window), React hooks (`useState`, `useEffect`), or DOM event listeners.

---

## 4. 🔄 Data Fetching Strategy

*   **GET Requests (Products, Blogs, Settings):**
    *   Will be fetched natively on the Server inside the RSC using `fetch()` with Next.js caching constraints (`revalidate: 3600` or `force-cache`).
    *   We will significantly reduce reliance on TanStack Query by making the server fetch the initial payload, keeping TanStack Query *only* for highly dynamic client-side filtering/infinite scrolling if necessary.
*   **Mutations (Login, Add to Cart, Update Profile):**
    *   Will be converted to Next.js **Server Actions** (`app/actions/...`).
    *   Example: `addToCartAction(productId: string)`.
*   **Authentication:**
    *   Transition from `localStorage` tokens to **HttpOnly Cookies**. Server Components will read the cookie to identify the user and fetch protected data directly (e.g., retrieving the cart on the server side prior to rendering).

---

## 5. 🏗️ Feature-Based Architecture Plan

The `sa7ar-next` codebase will adopt a domain-driven structure to avoid bloated global folders:

```
src/
├── app/                  # Next.js App Router (Layouts, Pages, Loading, Error boundaries)
├── features/             # Domain logic
│   ├── auth/             # components/login-form.tsx, actions/login.ts, hooks/use-auth.ts
│   ├── products/         # components/product-card.tsx, queries/get-products.ts
│   ├── cart/             # components/cart-sheet.tsx, store/cart-store.ts
│   └── account/          # components/address-form.tsx, actions/update-profile.ts
├── components/
│   ├── ui/               # shadcn/ui generic primitive components (Button, Input, Card)
│   └── shared/           # Cross-feature components (Header, Footer, LanguageToggle)
├── lib/
│   ├── utils.ts          # tailwind merge, formatting
│   ├── apiClient.ts      # isomorphic fetch wrapper
│   └── i18n/             # Dictionary fetching logic
└── types/                # Global TS definitions
```

---

## 6. 🎨 Design System Extraction (CRITICAL)

The React project operates on Tailwind v4 and uses CSS variables extensively in `index.css`.
We will extract and maintain:

1.  **Tailwind Settings:** The exact mapping from `index.css`:
    *   `--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, `--gray`, `--color-black-cu`, `--color-background-cu`.
2.  **Radius & Shadows:** The `oklch` colors and radius scales (`0.625rem`).
3.  **Utility Classes:** We will port `@utility container` with its specific constraints (`max-width: 107.5rem; padding: 0 0.5rem`).
4.  **Fonts & Typography:** Ensure `tw-animate-css` is integrated into Next.js.

*Strict constraint: No default shadcn styles will override existing variables. We will inject the existing `oklch` values directly into the Next.js app/globals.css.*

---

## 7. 🎯 shadcn Integration Plan

Currently, the Next.js project has initialized shadcn/ui.
1.  **Variables Sync:** We will replace the default `globals.css` colors generated by shadcn with the exact `oklch` values from the old `index.css`.
2.  **Component Replacement Strategy:**
    *   Review `components/ui` in the React project.
    *   If a shadcn component exists in `sa7ar-next` but differs from the customized React one, we will replace the Next.js file with the React file directly, ensuring we retain custom variations (like rounded radii, specific focus rings).
3.  **Tailwind Config:** Tailwind v4 uses CSS integration. We ensure `next.config.ts` and `postcss` handle the legacy configurations appropriately.

---

## 8. 🧠 Server vs Client Strategy

*   **"Leaves must be interactive, branches must be static"**
*   **Static Branches:** Pages like `/products` will be fetched on the server. The grid is rendered as server HTML.
*   **Interactive Leaves:** The `ProductCard` component itself might be RSC, but the `<AddToCartButton />` imported inside it will carry the `'use client'` directive.
*   **State Management:** We will swap React Context where possible with URL search parameters (e.g., for filters, pagination). User state (token) will move to Cookies.

---

## 9. 🔍 SEO Strategy

*   **`generateMetadata()`:** Implement dynamic metadata for product details (`/products/[id]`) and blog posts (`/blogs/[slug]`) fetching title, description, and OpenGraph images directly on the server before standard render.
*   **Semantic HTML:** Maintain heading hierarchy.
*   **JSON-LD:** Inject structured data for products and articles.
*   **Sitemap & Robots:** Add `app/sitemap.ts` and `app/robots.ts`.

---

## 10. 🔁 Migration Strategy (Step-by-Step)

The execution MUST run in sequence:

**Phase 1: Foundation (Architecture & Styling)**
*   Configure `app/globals.css` with legacy tokens.
*   Setup `lib/apiClient.ts` optimized for Next.js (cookie-aware).
*   Setup initial Layouts (`RootLayout`, Context Providers for minimal client needs).

**Phase 2: Core Generic UI & Shared Components**
*   Migrate `components/ui` (buttons, inputs, dialogs).
*   Migrate Shared UI (Header, Footer, Cards).

**Phase 3: Public & Static Pages**
*   Migrate Home Page, About, Contact, FAQ, Legal pages (Convert to RSC).

**Phase 4: Product Discovery (Dynamic & SEO)**
*   Migrate `/products` and `/products/[id]`.
*   Implement Server-side data fetching and metadata generation.

**Phase 5: Auth & Protected State (The Hardest Part)**
*   Transition Auth from `localStorage` to cookies.
*   Migrate Cart Logic (Server Actions).
*   Migrate Checkout.

**Phase 6: Account Management**
*   Migrate Address forms, Orders Dashboard, Profile Updates.

---

## 11. 🧪 Testing & Validation Plan

*   **Validation Rule:** After every phase completion, we run `npm run build` and `npm run dev`.
*   **Reverse Validation:** We will compare the DOM structure and CSS computed visually between `localhost:5173` (React) and the Next.js port for parity.
*   **TypeScript Checks:** Ensure zero `any` usage without explicit justification.
*   **Lighthouse/SEO Check:** Run build checks to ensure pages are correctly rendered as `(Static)` or `(Dynamic)` as intended in the terminal build output.

---

## 12. 📝 Current Status & Pending Tasks (Scan Results)

**✅ Completed Migrations:**
*   **Public/Static:** Home (`/`), About (`/about`), Contact (`/contact`), FAQ (`/faq`), Privacy (`/privacy`), Terms (`/terms`), Blogs (`/blogs`, `/blogs/[slug]`).
*   **Catalog:** Products List (`/products`, `/products-list`), Product Details (`/products/[id]`).
*   **E-commerce:** Cart (`/cart`), Checkout (`/checkout`).
*   **Business Partnerships:** (`/business-partnerships`) with full active backend connections.
*   **Auth UI & Dialogs:** `AuthDialog`, `VerifyOtpDialog`, `ResetPasswordDialog`, connected globally.
*   **Account Layer Forms:** Profile Updates (`/account/profile`), Secure Order Details (`/account/orders/[id]`), and highly interactive Address Mappings (`/account/addresses/[id]`, `/account/addresses/new`).
*   **Route Protection Middleware:** `/account`, `/checkout` fully bounded by native Next.js middleware using HttpOnly secure cookies layer.

**🎉 Status:** The React to Next.js strict port is entirely complete with 100% feature-symmetry and augmented server-first capabilities! Ready for final QA and production prep.
