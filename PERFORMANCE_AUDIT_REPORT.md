# Performance Audit & Next.js Mobile Optimization Report

## Phase 1: Automated Audit Results (Mobile)

Based on the Headless Lighthouse Mobile audit (`simulated throttling`), here are the issues scoring below 90 affecting Performance, Accessibility, and CLS:

### Identified Issues Table

| Issue | Category | Component/Element | Impact | File Path / Location |
| :--- | :--- | :--- | :--- | :--- |
| **Largest Contentful Paint (LCP)** | Performance | Hero Image / Banner | LCP latency causes poorer web-vitals score on Mobile | `components/shared/ImageFallback.tsx` usage in Hero |
| **Button Accessible Name** | Accessibility | Buttons lacking discernible text | Screen readers on mobile cannot announce the button's action | Found on multiple Carousels & icon buttons without `aria-label` |
| **Cumulative Layout Shift (CLS: 0.043)** | Performance | Client-side hydration/font loading | Shift of elements as components render | Images lacking constraints or `Client Component` flashes |

---

## Phase 2: Next.js 15+ & Mobile Optimization Findings

### 1. Bundle Bloat (`use client` Overuse)
Several high-level pages and layouts in `/app` are using the `'use client'` directive, breaking the Server Components architecture:
- `app/[lang]/contact/page.tsx`
- `app/[lang]/checkout/page.tsx`
- `app/[lang]/cart/page.tsx`

**Fix:** Remove `'use client'` from these page routes. Move interactivity to leaf Node components (e.g., `<ContactForm />`, `<CartItems />`) to ensure the page frame is rendered on the server, drastically reducing the JS bundle size on mobile.

### 2. Font/Image Optimization (`next/font` & `next/image`)
- **Font:** `next/font/google` (`Inter`) is properly implemented in `app/[lang]/layout.tsx`.
- **Image:** Images are routed through `components/shared/ImageFallback.tsx`. While it automatically sets `fill` if no `width/height` is supplied, parent containers of these images might be lacking `position: relative` or strict height constraints, causing CLS when the image loads. We also need to add `priority` to the LCP hero image.

### 3. Data Fetching (Waterfall Bottlenecks)
- Data constraints and context wrappers (e.g., Auth, Cart) wrap the main layout. Ensuring Server Components fetch their required data natively instead of relying on `useEffect` or client-side fetch flows will enhance First Contentful Paint (FCP).

---

## Phase 3: Prioritized Execution Roadmap

### Step 1: Low-Hanging Fruit (Images/Fonts & Accessibility)
- **1.1:** Add `priority` attribute to the Hero section's Image (LCP improvement).
- **1.2:** Ensure parent wrappers of `ImageFallback` have `relative` positioning and explicit aspect ratios.
- **1.3:** Add `aria-label` to slider/icon buttons across the application to fix accessibility issues.

### Step 2: Architectural Fixes (Client vs. Server Components)
- **2.1:** Refactor `app/[lang]/cart/page.tsx` to Server Component, moving cart state logic into `<CartContainer />`.
- **2.2:** Refactor `app/[lang]/checkout/page.tsx` and `contact/page.tsx` similarly, pushing `'use client'` down the tree.

### Step 3: Bundle Optimization & Final Verification
- **3.1:** Verify hydration and ensure there's no layout shift.
- **3.2:** Re-run Lighthouse Mobile audit to guarantee scores > 90 across all categories.

---
**Please review and approve this roadmap. Once approved, I will automatically begin applying the refactors starting with Step 1.**
