# Page Heading Audit

Audit date: 2026-04-14

Scope: `app/**/page.tsx` files (25 routes)

Rule checked:
- Exactly one `<h1>` per page
- Heading order should not skip levels (`h1` -> `h2` -> `h3`, etc.)

## Results

| Page | `<h1>` in page file | Heading order in page file | Status |
|---|---:|---|---|
| `app/[lang]/about/page.tsx` | 1 | OK | Confirmed |
| `app/[lang]/account/addresses/[id]/page.tsx` | 1 | OK | Confirmed |
| `app/[lang]/account/addresses/new/page.tsx` | 1 | OK | Confirmed |
| `app/[lang]/account/addresses/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |
| `app/[lang]/account/details/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |
| `app/[lang]/account/orders/[id]/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |
| `app/[lang]/account/orders/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |
| `app/[lang]/account/profile/page.tsx` | 0 | N/A | Not confirmed (redirect page) |
| `app/[lang]/best-selling-accessories/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |
| `app/[lang]/best-selling-products/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |
| `app/[lang]/blogs/[slug]/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |
| `app/[lang]/blogs/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |
| `app/[lang]/brands/[slug]/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |
| `app/[lang]/brands/page.tsx` | 1 | OK | Confirmed |
| `app/[lang]/business-partnerships/page.tsx` | 1 | OK | Confirmed |
| `app/[lang]/cart/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |
| `app/[lang]/checkout/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |
| `app/[lang]/contact/page.tsx` | 1 | OK | Confirmed |
| `app/[lang]/faq/page.tsx` | 1 | OK | Confirmed |
| `app/[lang]/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |
| `app/[lang]/privacy/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |
| `app/[lang]/products-list/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |
| `app/[lang]/products/[slug]/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |
| `app/[lang]/products/page.tsx` | 1 | OK | Confirmed |
| `app/[lang]/terms/page.tsx` | 0 | N/A | Not confirmed (content rendered by child component) |

## Totals

- Confirmed (in page files): 8
- Not confirmed (delegated to child components/redirect): 17
- Pages with more than one direct `<h1>` in page file: 0
- Direct heading level-skip issues found in page files: 0

## Notes

- This audit is static at the page-file level.
- For pages that render feature/components (`<SomePageContent />`), final heading correctness must be confirmed in those component files or by checking rendered HTML in browser.
