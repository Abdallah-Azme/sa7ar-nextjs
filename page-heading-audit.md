# Page Heading Audit

Audit date: 2026-04-14

Scope: all app pages, checked on rendered HTML at runtime (`/en/...`).

Rules checked:
- Exactly one `<h1>` per page
- Heading order should not skip levels (`h1` -> `h2` -> `h3`)

## Runtime Results

| Route | Final URL | `<h1>` count | Heading levels | Result |
|---|---|---:|---|---|
| `/en` | `/en` | 1 | `1>2>2>2>2>2>3>3>3` | PASS |
| `/en/about` | `/en/about` | 1 | `1>2>2>2>2>2>2>2>2>2>2>3` | PASS |
| `/en/best-selling-accessories` | `/en/best-selling-accessories` | 1 | `1>3` | FAIL (skips `h2`) |
| `/en/best-selling-products` | `/en/best-selling-products` | 1 | `1>3>3>3` | FAIL (skips `h2`) |
| `/en/blogs` | `/en/blogs` | 1 | `1>2>2>2>3>3` | PASS |
| `/en/brands` | `/en/brands` | 1 | `1` | PASS |
| `/en/business-partnerships` | `/en/business-partnerships` | 1 | `1` | PASS |
| `/en/cart` | `/en?auth_required=1` | - | - | NOT VERIFIED (auth redirect) |
| `/en/checkout` | `/en?auth_required=1` | - | - | NOT VERIFIED (auth redirect) |
| `/en/contact` | `/en/contact` | 1 | `1>2>2>3>2>3` | PASS |
| `/en/faq` | `/en/faq` | 1 | `1>2>2>3>3>3>3>3>2>3` | PASS |
| `/en/privacy` | `/en/privacy` | 1 | `1>3` | FAIL (skips `h2`) |
| `/en/products` | `/en/products` | 1 | `1>2>2>3>3>3>2>2>2>3` | PASS |
| `/en/products-list` | `/en/products-list` | 1 | `1>3>3>3>3` | FAIL (skips `h2`) |
| `/en/terms` | `/en/terms` | 1 | `1>3` | FAIL (skips `h2`) |
| `/en/account/addresses` | `/en?auth_required=1` | - | - | NOT VERIFIED (auth redirect) |
| `/en/account/addresses/new` | `/en?auth_required=1` | - | - | NOT VERIFIED (auth redirect) |
| `/en/account/details` | `/en?auth_required=1` | - | - | NOT VERIFIED (auth redirect) |
| `/en/account/orders` | `/en?auth_required=1` | - | - | NOT VERIFIED (auth redirect) |
| `/en/account/profile` | `/en?auth_required=1` | - | - | NOT VERIFIED (auth redirect) |
| `/en/products/krton-myah` | `/en/products/krton-myah` | 1 | `1>2>3>3>3>3>3>3>3` | PASS |
| `/en/blogs/how-many-liters-of-water-does-your-body-need-daily` | same | 0 | none | FAIL (missing `h1`) |
| `/en/brands/rathath` | `/en/brands/rathath` | 1 | `1>3>3` | FAIL (skips `h2`) |
| `/en/account/orders/{id}` | N/A | - | - | NOT VERIFIED (needs auth + real id) |
| `/en/account/addresses/{id}` | N/A | - | - | NOT VERIFIED (needs auth + real id) |

## Totals

- PASS: 11
- FAIL: 7
- NOT VERIFIED: 7

## Failed Pages

- `/en/best-selling-accessories` (uses `h1` then jumps to `h3`)
- `/en/best-selling-products` (uses `h1` then jumps to `h3`)
- `/en/privacy` (uses `h1` then jumps to `h3`)
- `/en/products-list` (uses `h1` then jumps to `h3`)
- `/en/terms` (uses `h1` then jumps to `h3`)
- `/en/blogs/how-many-liters-of-water-does-your-body-need-daily` (no `h1` found)
- `/en/brands/rathath` (uses `h1` then jumps to `h3`)
