# 🚀 sa7ar-next: Next.js Optimization & SEO Parity Plan

> **Status:** AWAITING APPROVAL — No code will be written until this plan is approved.

Based on your updated requirements, here is the detailed, step-by-step strategy to optimize the migrated Next.js application, fully implement bilingual support (en/ar), ensure proper SSR, and resolve all SEO issues.

---

## 1. Pages Inventory & Pre-Audit

**Current State vs Goal:**
- Currently, `sa7ar-next` routes are hardcoded (`app/products/page.tsx`). We need to transition this to a localized structure (`app/[lang]/products/page.tsx`).
- Products use `[id]` for routing. We will refactor this to `[slug]`.

### Missing or Impacted Pages:
- All pages need to be moved under a `[lang]` dynamic segment.
- `app/sitemap.ts` needs to be created.

---

## 2. Execution Strategy (Step-by-Step)

We will execute the migration strictly one phase at a time. I will NOT move to the next phase until the current one is functioning 100% perfectly and validated.

### Phase 1: i18n & Multilingual SEO Infrastructure
1. **Middleware Setup (`middleware.ts`)**:
   - Implement language detection (e.g., from Accept-Language or cookies).
   - Automatically route/redirect users to `/ar/...` or `/en/...` based on their preference without breaking protected routes.
2. **App Router Restructure**:
   - Move all page contents into `app/[lang]/...`.
   - Implement a simple dictionary/translation loader for static strings (or integrate `next-intl` if preferred).
3. **Metadata API (Multilingual SEO)**:
   - Create a helper for `generateMetadata` that automatically injects `canonical` and `alternate` `hreflang` tags (linking the `ar` and `en` versions) on every page.

### Phase 2: Dynamic Routing & Slugs
1. **Refactor Product Routes**:
   - Move `app/[lang]/products/[id]` to `app/[lang]/products/[slug]`.
   - Update `app/[lang]/blogs/[slug]` to ensure it supports the new localized structure.
2. **Implement `generateStaticParams`**:
   - Pre-fetch product slugs and blog slugs from the Laravel backend at build time to enable SSG (Static Site Generation), drastically improving load times and SEO.
3. **Link Updates**:
   - Audit all `<Link>` components and navigation handlers to use the new `slug` paths instead of `id`.

### Phase 3: Performance & Core Web Vitals
1. **Next/Image Migration**:
   - Globally sweep the codebase for standard `<img>` tags and replace them with `<Image>` from `next/image` to ensure automatic WebP conversion and lazy loading.
   - Refactor the existing `ImageFallback` component to wrap `next/image` effectively.
2. **Accessibility (a11y) Sweep**:
   - Add `aria-label` to all buttons, navigation elements, and social links in `Navbar` and `Footer`.
3. **Dynamic Sitemaps (`sitemap.ts`)**:
   - Implement `app/sitemap.ts`.
   - Fetch all dynamic routes (products, categories, blogs) from the API.
   - Output split structured XML (including localized versions for `ar` and `en`).

### Phase 4: SSR Verification & Backend Integration
1. **Laravel Metadata Integration**:
   - Update the API client to fetch dedicated SEO fields (Meta Title, Description, Keywords, OpenGraph images) from the Laravel backend for every specific entity (Products, Brands, Blogs, Home).
   - Feed this data directly into the `generateMetadata` function of each server component.
2. **SSR Full Confidence Check**:
   - Audit `Home`, `Products`, and `Blogs` to guarantee they are strictly `Server Components` (`'use client'` omitted where not needed).
   - Ensure the initial HTML payload contains the full visual content (No "CSR Catastrophe" or blank loading frames on initial paint).

---

## 3. Iteration Loop Strategy

For every feature/page mentioned above:
1. **Analyze**: Review the current implementation.
2. **Refactor**: Apply the Next.js optimized feature (e.g., move to `[slug]`, add `generateMetadata`).
3. **Validate**:
   - Run `tsc` to verify no TypeScript issues.
   - Run the server and check Network/Elements tab to verify the payload is SSR.
   - Verify visually via a browser screenshot.
4. **Report**: I will output a checklist confirming the changes and proving parity before stepping to the next task.

---

## 4. Edge Cases & Risks Assessed

- **Dynamic Slugs vs Existing Links**: Hardcoded or shared links with `id` will 404. We may need to support an `id` lookup fallback if standard slugs aren't known by old clients.
- **Client Components breaking SSR**: Deeply nested client components (like carousels) might skip SSR for children. We must pass data properly via Server Components down to Client components rather than fetching data inside Client components.
- **API Parity**: We assume the Laravel backend currently responds with `slug` data and localized fields (e.g., `name_ar`, `name_en`). If it doesn't, we will need to address API payload limitations.

---

### 🛑 Next Step:
**Do you approve this plan?** 
If yes, I will immediately begin **Phase 1: i18n & Multilingual SEO Infrastructure**.
