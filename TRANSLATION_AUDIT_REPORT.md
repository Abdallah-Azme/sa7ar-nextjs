# 🌐 Translation & Direction Audit Report
*sa7ar-next — Full app scan*

---

## Executive Summary

| Category | Count |
|---|---|
| Missing translation keys (used in code, absent in JSON) | **11** |
| Hardcoded English strings (not using translation system) | **7** |
| AR-only content / quality issues | **5** |
| EN-only content / quality issues | **4** |
| Direction (RTL/LTR) CSS issues | **4** |
| Missing font support for Arabic | **1** |

---

## 🔴 CRITICAL: Missing Translation Keys
*Keys called in code but do not exist in either `en.json` or `ar.json`*

### 1. `orders.cancelSuccess`
- **File:** `features/orders/components/OrderDetailsView.tsx:41`
- **Code:** `toast.success(tOrders("cancelSuccess"))`
- **Status:** ❌ Missing in BOTH `en.json` and `ar.json` under `orders`.
- **Fix:**
  - `en.json → orders`: `"cancelSuccess": "Order cancelled successfully"`
  - `ar.json → orders`: `"cancelSuccess": "تم إلغاء الطلب بنجاح"`

---

### 2. `common.errorOccurred`
- **File:** `features/orders/components/OrderDetailsView.tsx:46`
- **Code:** `tCommon("errorOccurred")`
- **Status:** ❌ Missing in BOTH files. `common` has no `errorOccurred` key.
- **Fix:**
  - `en.json → common`: `"errorOccurred": "An error occurred, please try again"`
  - `ar.json → common`: `"errorOccurred": "حدث خطأ، يرجى المحاولة مرة أخرى"`

---

### 3. `actions.cancelOrder` / `.cancelling` / `.confirmCancel` / `.keepOrder`
- **File:** `features/orders/components/OrderDetailsView.tsx:117, 140, 144`
- **Status:** ❌ The `actions` namespace exists but is missing these 4 keys. `actions` currently only has: `addToCart`, `buyNow`, `orderNow`, `showMore`, `readMore`, `contactUs`, `increase`, `decrease`, `remove`.
- **Fix — add to `en.json → actions`:**
  ```json
  "cancelOrder": "Cancel Order",
  "cancelling": "Cancelling...",
  "confirmCancel": "Yes, Cancel",
  "keepOrder": "No, Go Back"
  ```
- **Fix — add to `ar.json → actions`:**
  ```json
  "cancelOrder": "إلغاء الطلب",
  "cancelling": "جارٍ الإلغاء...",
  "confirmCancel": "نعم، إلغاء الطلب",
  "keepOrder": "لا، العودة"
  ```

---

### 4. `orders.cancelConfirmTitle` / `orders.cancelConfirmDescription` — KEY PATH MISMATCH
- **File:** `features/orders/components/OrderDetailsView.tsx:127, 130`
- **Status:** ❌ Missing AND wrong path. The JSON has equivalent content at `orders.details.cancel.dialog.heading` / `.description`, but the code calls `tOrders("cancelConfirmTitle")` at the root of `orders` — which doesn't exist.
- **Fix option A (preferred — align code to existing JSON):**
  ```tsx
  // Change in OrderDetailsView.tsx:
  {tOrders("details.cancel.dialog.heading")}
  {tOrders("details.cancel.dialog.description")}
  ```
- **Fix option B (align JSON to code):** Add `orders.cancelConfirmTitle` / `orders.cancelConfirmDescription` to both files.

---

### 5. `products.label` / `.description` / `.bard` / `.rathath`
- **File:** `features/products/components/ProductsPageContent.tsx:45, 46, 54, 65, 74`
- **Status:** ❌ `label` and `description` are completely absent from `products`. `bard` and `rathath` exist at `products.sections.bard/rathath` but are called without the `sections.` prefix.
- **Fix — add to `en.json → products`:**
  ```json
  "label": "Our Products",
  "description": "Browse our full range of water products",
  "bard": "Bard Products",
  "rathath": "Rathath Products"
  ```
- **Fix — add to `ar.json → products`:**
  ```json
  "label": "منتجاتنا",
  "description": "تصفح مجموعتنا الكاملة من منتجات المياه",
  "bard": "منتجـــات برد",
  "rathath": "منتجـــات رذاذ"
  ```

---

### 6. `common.all`
- **File:** `features/products/components/ProductsPageContent.tsx:30`
- **Code:** `tCommon("all")`
- **Status:** ❌ Missing in BOTH files.
- **Fix:**
  - `en.json → common`: `"all": "All"`
  - `ar.json → common`: `"all": "الكل"`
  - *Note: `productsPage.filters.all` already has this value — consider reusing that key or extracting it to `common`.*

---

### 7. `orders.status` / `orders.itemsTitle` / `orders.processing`
- **File:** `features/orders/components/OrderDetailsView.tsx:97, 98, 102`
- **Status:** ❌ Missing in BOTH files. The `orders` namespace has none of these top-level keys.
- **Fix — add to `en.json → orders`:**
  ```json
  "status": "Delivery Status",
  "itemsTitle": "Order Items",
  "processing": "Processing"
  ```
- **Fix — add to `ar.json → orders`:**
  ```json
  "status": "حالة التوصيل",
  "itemsTitle": "عناصر الطلب",
  "processing": "قيد المعالجة"
  ```

---

## 🟡 Hardcoded Strings (Not Using Translation System)

| # | File | Line | Hardcoded Value | Fix |
|---|---|---|---|---|
| 1 | `components/shared/buttons/ShowMore.tsx` | 16 | `"Show More"` (no i18n at all) | Use `tCommon("showMore")` — key exists |
| 2 | `components/shared/buttons/ShowMore.tsx` | 12 | `aria-label="Show More Products"` | Add key to JSON and translate |
| 3 | `features/home/components/Mobile.tsx` | 71 | `alt="Mobile App Preview"` | Use `t("imageAlt")` — key `mobile.imageAlt` exists |
| 4 | `features/home/components/Hero.tsx` | 177/185 | `aria-label="Previous slide"` / `"Next slide"` | Add keys and translate |
| 5 | `features/home/components/Hero.tsx` | 211/220 | `aria-label="Apple Store"` / `"Google Play Store"` | Add keys and translate |
| 6 | `features/orders/components/OrderDetailsView.tsx` | 65 | `title="Delivery Map"` | Use `tOrders("details.mapTitle")` — key already exists in JSON! |
| 7 | `features/home/components/Partners.tsx` | 11 | `title: "Barad"` in hardcoded array | Fetch from API or use translation key |

---

## 🟡 Translation Quality Issues

### Arabic (ar.json) Issues

| # | Path | Current | Issue | Fix |
|---|---|---|---|---|
| 1 | `form.labels.uploadAvatar` | `"لارفع الصورة الشخصية"` | Typo: extra ا before رفع | `"لرفع الصورة الشخصية"` |
| 2 | `form.labels.saveChanges` | `"حفظ المتغيرات"` | Wrong word: متغيرات means "variables" | `"حفظ التغييرات"` |
| 3 | `businessPartnerships.organizationTypes` | e.g. `"Company - شركة"` | Values are bilingual (English - Arabic). EN file has clean English. AR should be Arabic-only | `"شركة"`, `"مصنع"`, etc. |
| 4 | `cart.empty.cta` | `"ابدا طلبك الان"` | Missing hamza on ابدأ; missing madda on الآن | `"ابدأ طلبك الآن"` |
| 5 | `reviews.sample` | "...جربتها في الرياض" | References Riyadh (Saudi Arabia) — brand is Sohar (Oman) | Replace with Omani city reference |

### English (en.json) Issues

| # | Path | Current | Issue | Fix |
|---|---|---|---|---|
| 1 | `cart.features.fast.title` | `"Fas-t Delivery"` | Hyphen typo | `"Fast Delivery"` |
| 2 | `about.title.line1` | `"Rathath.. pure water"` | Brand name inconsistency: hero uses "Sohar", about uses "Rathath" | Align to consistent brand name (e.g. Sohar) |
| 3 | `aboutStory.paragraphs.first` & `.second` | Both identical | Duplicate placeholder text never differentiated | Write unique second paragraph |
| 4 | `blogDetails.createdAt` | `"January 16, 2025"` | Hardcoded static date in both locales | Should be dynamic from actual article data |

---

## 🔵 Direction (RTL/LTR) Issues

### ✅ What's Correctly Implemented
- `layout.tsx` sets `dir={lang === "ar" ? "rtl" : "ltr"}` on `<html>` ✅
- Most spacing uses logical properties (`ps-`, `pe-`, `ms-`, `me-`) ✅
- Icon rotation uses `rtl:rotate-180` ✅
- Arrow icons use `ltr:rotate-90 rtl:rotate-0` ✅
- Carousel navigation uses `*:rtl:rotate-180` ✅

---

### ❌ Issue 1: `Hero.tsx` — `divide-x` without RTL reverse
- **File:** `features/home/components/Hero.tsx:130`
- **Code:** `className="grid sm:grid-cols-3 divide-x gap-3"`
- **Problem:** `divide-x` applies `border-left` on child dividers. In RTL this looks wrong — dividers appear on the wrong side of cells.
- **Fix:** Change to `divide-x rtl:divide-x-reverse`

---

### ❌ Issue 2: `ShowMore.tsx` — `ArrowLeft` icon without logical flip
- **File:** `components/shared/buttons/ShowMore.tsx:17`
- **Code:** `<ArrowLeft className="rtl:rotate-180" />`
- **Assessment:** Functionally OK — the `rtl:rotate-180` flip makes it point right in RTL. But for correctness, usually you use a right arrow in LTR for "Show More" and flip it for RTL (or use Lucide `ArrowRight` + `rtl:rotate-180`). Currently it points left in English and right in Arabic, which is exactly backwards for a "Next/More" action. It should point right in EN and left in AR.
- **Fix:** Change to `<ArrowRight className="rtl:rotate-180" />`

---

### ❌ Issue 3 (CRITICAL): No Arabic Font Loaded
- **File:** `app/[lang]/layout.tsx:22-25`
- **Problem:** Only `Inter` is loaded with `latin` and `latin-ext` subsets. **Inter has no Arabic glyphs**. When `lang="ar"`, the browser silently falls back to a system Arabic font (often Microsoft's Calibri or Times-like serifs), causing visual inconsistency.
- **Fix:** Add a Google Font that supports Arabic (e.g. Cairo or Tajawal):
  ```tsx
  // In layout.tsx, add:
  import { Cairo } from "next/font/google";
  const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

  // In RootLayout, apply conditionally:
  className={`${lang === "ar" ? cairo.variable : inter.variable} h-full antialiased`}
  ```

---

### ❌ Issue 4: `Mobile.tsx` — `text-start` in button
- **File:** `features/home/components/Mobile.tsx:48, 57`
- **Code:** `<div className="text-start">`
- **Assessment:** `text-start` is a logical property (maps to `text-left` in LTR, `text-right` in RTL). However, the button layout (`<GoogleStore icon>` + `<text-start div>`) might look wrong if the flex order doesn't match the text alignment in RTL.

---

## 📋 Complete Fix Checklist Summary

1. `en.json` & `ar.json`: Add all 11 missing keys mentioned in Section 1.
2. `en.json` & `ar.json`: Correct the 9 quality translation issues in Section 3.
3. `OrderDetailsView.tsx`: Use existing keys for dialog headings and iframe title.
4. `ShowMore.tsx`: Add translation for "Show More" and fix arrow direction component.
5. `Hero.tsx`: Add `rtl:divide-x-reverse`.
6. `layout.tsx`: Add and configure Arabic font like `Cairo`.
