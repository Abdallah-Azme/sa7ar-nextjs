# 🔍 React → Next.js Migration Audit & Correction Plan
## Sohar Water (Sa7ar) — Full 1:1 Parity Audit

> **PLAN PHASE — No code written until approved.**

---

## 1. Pages Inventory

### React App Routes (`sa7ar-react`) — 21 routes

| Route | Component | Protection |
|---|---|---|
| `/` | `pages/home/HomePage.tsx` | Public |
| `/products` | `pages/products/Products.tsx` | Public |
| `/products-list` | `pages/products/ProductsList.tsx` | Public |
| `/products/:id` | `pages/products/ProductDetails.tsx` | Public |
| `/cart` | `pages/Cart.tsx` | 🔒 Protected |
| `/checkout` | `pages/Checkout.tsx` | 🔒 Protected |
| `/about` | `pages/About.tsx` | Public |
| `/faq` | `pages/Faq.tsx` | Public |
| `/blogs` | `pages/blogs/Blogs.tsx` | Public |
| `/blogs/:slug` | `pages/blogs/BlogDetails.tsx` | Public |
| `/contact` | `pages/Contact.tsx` | Public |
| `/business-partnerships` | `pages/BusinessPartnerships.tsx` | Public |
| `/privacy` | `pages/PrivacyPolicy.tsx` | Public |
| `/terms` | `pages/TermsConditions.tsx` | Public |
| `/account/details` | `pages/account/AccountForm.tsx` | 🔒 Protected |
| `/account/orders` | `pages/account/orders/AccountOrder.tsx` | 🔒 Protected |
| `/account/orders/:id` | `pages/account/orders/AccountOrderDetails.tsx` | 🔒 Protected |
| `/account/addresses` | `pages/account/AccountAddressesList.tsx` | 🔒 Protected |
| `/account/addresses/new` | `pages/account/AccountAddAddress.tsx` | 🔒 Protected |
| `/account/addresses/:id` | `pages/account/AccountAddAddress.tsx` | 🔒 Protected |
| `*` | `pages/NotFound.tsx` | Public |

---

### Next.js App Routes (`sa7ar-next`)

| Route | Status | Issue |
|---|---|---|
| `/` | ✅ | — |
| `/products` | ✅ | — |
| `/products-list` | ✅ | — |
| `/products/[id]` | ✅ | — |
| `/cart` | ✅ | — |
| `/checkout` | ✅ | — |
| `/about` | ✅ | — |
| `/faq` | ✅ | — |
| `/blogs` | ✅ | — |
| `/blogs/[slug]` | ✅ | — |
| `/contact` | ✅ | — |
| `/business-partnerships` | ✅ | — |
| `/privacy` | ✅ | — |
| `/terms` | ✅ | — |
| `/account/profile` | ⚠️ MISMATCH | React route is `/account/details` |
| `/account/orders` | ✅ | — |
| `/account/orders/[id]` | ✅ | — |
| `/account/addresses` | ✅ | — |
| `/account/addresses/new` | ✅ | — |
| `/account/addresses/[id]` | ✅ | — |
| *(no file)* | 🔴 MISSING | `app/not-found.tsx` doesn't exist |
| *(no file)* | 🟡 MISSING | `app/error.tsx` doesn't exist |
| *(no file)* | 🟡 MISSING | `loading.tsx` files don't exist |

---

## 2. Component Inventory & Gaps

### Global Shared Components

| Component | React | Next.js | Severity |
|---|---|---|---|
| `Navbar` | `NavLink` with auto active-class | Plain `Link` — no active highlighting | 🔴 HIGH |
| `Footer` | All text via `t()` i18n | Hardcoded English strings | 🔴 HIGH |
| `AuthActionWrapper` | Shows toast + blocks click for guests | **MISSING** | 🔴 HIGH |
| `SearchDialog` | Full search UX in Navbar | **MISSING** | 🔴 HIGH |
| `AccountDropdown` | Dropdown with links + logout | **MISSING** — replaced by icon link | 🔴 HIGH |
| `LoginDropdown` | Dropdown with login button | **MISSING** — replaced by plain button | 🔴 HIGH |
| `SettingContext` | `contexts/SettingContext.tsx` (3rd context) | **MISSING** | 🔴 HIGH |
| `ScrollToTop` | Auto scroll to top on route change | **MISSING** | 🟡 MEDIUM |
| `ContactUsSection` | Used in About page | **MISSING** | 🟡 MEDIUM |
| `ActionResultDialog` | Used in account flows | **MISSING** | 🟡 MEDIUM |
| `ChangePasswordDialog` | In account dialogs | **MISSING** | 🔴 HIGH |
| `LangToggle` | Language switcher in Navbar | **MISSING** | 🟡 MEDIUM |
| `AppPagination` | `sizeBytes: 4832` | `sizeBytes: 3043` — SMALLER, prop API may differ | 🟡 MEDIUM |
| Skeleton components | 2 files in `shared/skeletons/` | Not present | 🟡 MEDIUM |

---

### Home Page Sections

| Section | React | Next.js | Severity |
|---|---|---|---|
| `Hero` | Text from i18n + context for settings | Text hardcoded in English | 🔴 HIGH |
| `About` | Needs full component diff | Needs full component diff | 🟡 |
| `Products` | Client-side useQuery | Server props | Needs diff |
| `BestSellingAccessories` | Present (from `/products-accessories` API) | **MISSING** — entire section absent | 🔴 HIGH |
| `Partners` | Needs diff | Needs diff | 🟡 |
| `Mobile` | Needs diff | Needs diff | 🟡 |
| `RequestPartnership` | Needs diff | Needs diff | 🟡 |
| `FAQ` | API data from `/faq` endpoint | 3 hardcoded English mock questions | 🔴 HIGH |

---

### About Page Differences

| Element | React | Next.js | Severity |
|---|---|---|---|
| Main spacing | `space-y-20 mt-20 container` | `container py-20 space-y-32` | 🔴 HIGH (60% larger gap) |
| Values grid | `md:grid-cols-3 xl:grid-cols-4` | `md:grid-cols-2 lg:grid-cols-4` | 🔴 HIGH |
| `Mobile` section | Present | **MISSING** | 🔴 HIGH |
| `ContactUsSection` | Present | **MISSING** | 🟡 MEDIUM |
| `OurStory` image | `first_image` | `second_image \|\| first_image` | 🟡 MEDIUM |
| Vision/Mission | Always rendered with fallback text | Only rendered if data exists | 🟡 MEDIUM |

---

## 3. Audit Strategy

### 5-Layer Comparison Per Page

**Layer 1 — Route/URL Parity**: Verify URLs match exactly, params match  
**Layer 2 — Component Structure**: All React components present in same order  
**Layer 3 — Data Flow**: Same API endpoints, same params, same error handling  
**Layer 4 — UI & CSS**: Matching Tailwind classes on structural elements, responsive breakpoints, conditional renders  
**Layer 5 — Behavior**: Interactions, auth guards, form behaviors, i18n  

---

## 4. Iteration Loop Strategy

### Execution Order (STRICT — cannot skip)

```
Phase 0: Global Shared Components (affects ALL pages)
Phase 1: Home Page
Phase 2: Products + Product Detail
Phase 3: Cart + Checkout
Phase 4: Blogs + Blog Detail
Phase 5: About
Phase 6: FAQ, Contact, Business Partnerships, Privacy, Terms
Phase 7: Account Suite
Phase 8: System Pages (Not Found, Error, Loading)
```

### Per-Page Loop

```
STEP 1 — ANALYZE: Read React source, catalog ALL components, data, props, behaviors
STEP 2 — DIFF: Read Next.js equivalent, compare against Step 1 line by line
STEP 3 — LIST: Document every mismatch (no coding yet)
STEP 4 — FIX: Apply fixes (missing components → data flow → CSS → behavior → i18n)
STEP 5 — VERIFY: Re-read both sources, confirm all items resolved
STEP 6 — VALIDATE: Run checklist (below) — must be 100% before proceeding

❌ DO NOT move to next page until Step 6 is 100% green
```

---

## 5. Validation Checklist (Per Page)

```markdown
### Page: /[route]

✅ Fixed Issues:
- [concrete fix 1]
- [concrete fix 2]

✅ Verification:
- [ ] All React components present and in same order
- [ ] Data source matches (same API endpoint + params)
- [ ] All loading/error/empty states present
- [ ] Auth guards behave identically
- [ ] Tailwind classes match on key structural elements
- [ ] Responsive behavior matches (mobile/tablet/desktop)
- [ ] i18n/translations not replaced with hardcoded English
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] SEO: title, description, open graph present
- [ ] Animations/transitions functionally identical

🚫 Remaining Issues: none
```

---

## 6. Next.js Optimization Plan

### Component Classification

| Component | Type | Reason |
|---|---|---|
| `app/page.tsx` | RSC | Data-fetching only |
| `Hero.tsx` | Client | Carousel API + useState |
| `FAQ.tsx` | Client | Accordion state |
| `Products.tsx` (home) | Client | Carousel state |
| `app/about/page.tsx` | RSC | Static API content |
| `OurStory.tsx` | RSC | Pure display |
| `app/blogs/page.tsx` | RSC | Server list |
| `app/blogs/[slug]` | RSC | Server article |
| `app/products/page.tsx` | Client | Filter/search/pagination state |
| `app/cart/page.tsx` | Client | Cart context state |
| `app/checkout/page.tsx` | Client | Multi-step form |
| `Navbar.tsx` | Client | Scroll/sheet/auth state |
| `Footer.tsx` | RSC | No interactivity |
| `AuthContext / CartContext` | Client | Context provider |
| `AuthDialog.tsx` | Client | Modal state |

### Data Fetching Rules

| Data | Strategy |
|---|---|
| Home page | RSC `cache: 'force-cache'` |
| Global settings | RSC cached — used by Footer, Hero, Mobile |
| About, FAQ, static pages | RSC with `revalidate: 3600` |
| Products with filters | Client `useQuery` |
| Product detail | RSC + `generateStaticParams` |
| Blogs | RSC with revalidation |
| Blog detail | RSC + `generateStaticParams` |
| Auth-dependent data | Client after auth hydration |

> **Rule: RSC upgrades only where zero functional impact. Client state stays Client Component.**

---

## 7. Risk & Edge Cases

### Hydration Risks

| Risk | Mitigation |
|---|---|
| Auth state server/client mismatch | Already handled via `initialUser` prop in `AuthProvider` |
| Cart count SSR=0 / client=actual | `suppressHydrationWarning` on badge or render after mount |
| Date in footer | Safe — year is stable within a request |

### Navigation Behavior

| Risk | React | Gap |
|---|---|---|
| Active nav highlighting | `NavLink` auto-adds `bg-primary text-white` | Need `usePathname()` + manual class logic |
| Scroll to top | `ScrollToTop` component | Missing — need `useEffect` + `usePathname()` equivalent |

### Auth UX Gaps

| Risk | React | Gap |
|---|---|---|
| Cart for guests | `AuthActionWrapper` blocks + shows toast | Next.js has no guard |
| Account dropdown | Full dropdown (links + logout) | Simple icon link only |
| Login dropdown | Dropdown UI | Plain button — partial only |

### i18n Regressions (CRITICAL)

All of the following are translated in React but hardcoded English in Next.js:
- Navbar labels
- Hero section text (label, title, description, steps)
- FAQ questions and answers
- Footer links, "Follow Us", "Download Now", copyright text
- Shopping steps

### Missing Sections Summary

| Missing | Page | Severity |
|---|---|---|
| `BestSellingAccessories` | Home | 🔴 HIGH |
| `Mobile` | About | 🔴 HIGH |
| `ContactUsSection` | About | 🟡 MEDIUM |
| `ChangePasswordDialog` | Account | 🔴 HIGH |
| `ActionResultDialog` | Account | 🟡 MEDIUM |

---

## 8. Prioritized Fix List

### 🔴 Critical (Pre-requisite for all pages)
1. Rename `/account/profile` → `/account/details`
2. Create `app/not-found.tsx` (from React's NotFound.tsx)
3. Create `app/error.tsx` (from React's ErrorPage.tsx)
4. Add `loading.tsx` per route
5. Port `AuthActionWrapper`
6. Port `ScrollToTop` behavior
7. Port full `AccountDropdown` (with logout)
8. Port full `LoginDropdown`
9. Port `SearchDialog` into Navbar
10. Add `BestSellingAccessories` to home page
11. Fix FAQ to fetch from API (remove mock)
12. Restore all i18n translations

### 🟡 High (Per-page)
13. Fix About spacing (`space-y-20` not `space-y-32`)
14. Fix About grid (`md:grid-cols-3 xl:grid-cols-4`)
15. Restore `Mobile` + `ContactUsSection` on About page
16. Fix vision/mission fallback behavior on About
17. Add `ChangePasswordDialog` to account
18. Add `ActionResultDialog` to account
19. Fix active nav link (use `usePathname`)
20. Audit `AppPagination` prop API parity

### ⚪ Low (Polish)
21. `suppressHydrationWarning` on cart count
22. Consistency check on `OurStory` image source

---

## 9. Execution Sequence

```
Phase 0 — Global Shared Components
   Navbar: active links, SearchDialog, AuthActionWrapper, AccountDropdown, LoginDropdown
   Footer: restore i18n strings
   Add not-found.tsx, error.tsx, loading.tsx
   Port ScrollToTop
   Fix account/details route

Phase 1 — Home Page
   Add BestSellingAccessories
   Fix FAQ (API data, not mock)
   Replace all hardcoded text with translated equivalents

Phase 2 — Products + Product Detail
   Full UI/behavior diff and fix

Phase 3 — Cart + Checkout
   Auth guard parity
   Form validation parity

Phase 4 — Blogs + Blog Detail
   i18n + data flow parity

Phase 5 — About
   Spacing fix
   Grid fix
   Restore Mobile section
   Restore ContactUsSection
   Restore vision/mission fallback

Phase 6 — FAQ, Contact, Business Partnerships, Privacy, Terms
   Structure + i18n per page

Phase 7 — Account Suite
   Profile route rename
   Orders (list + detail)
   Addresses (list + add/edit)
   ChangePasswordDialog
   ActionResultDialog

Phase 8 — Final Polish
   Cart badge hydration
   SEO sweep (all pages)
   TypeScript sweep
```

---

**Status: AWAITING APPROVAL — No code written yet.**
