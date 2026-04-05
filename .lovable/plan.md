

# Ezo POS — Mega Upgrade Plan

This is a comprehensive upgrade covering every major area of the app. Due to the massive scope, it is organized into **6 phases** to be built sequentially, each delivering working features.

---

## Phase 1: Database & Core Infrastructure

**Database migrations needed:**

1. **Upgrade `business_offers` table** — add `expires_at`, `max_claims`, `per_user_limit`, `claimed_count` columns for coupon system
2. **Create `expenses` table** — for tracking business expenses (kharche)
3. **Create `credit_ledger` table** — for udhar/credit tracking per customer
4. **Add social fields to `businesses`** — `instagram_handle`, `youtube_handle`, `whatsapp_number`, `email`, `pincode`, `google_map_url`
5. **Add `language` column to `profiles`** — `'en'` or `'hi'` default `'en'`
6. **Add `last_sign_in_at` to `profiles`** — for admin user tracking
7. **Create `notifications` table** — `id, business_id, user_id, title, message, type, is_read, created_at`
8. All tables get proper RLS policies

---

## Phase 2: Onboarding & Auth Upgrades

**Onboarding setup enhancements:**
- Add steps for: Language selection (Hindi/English), Instagram handle, YouTube handle, WhatsApp number
- Language choice persists to `profiles.language`

**Hindi/English i18n system:**
- Create `src/lib/i18n.ts` with translation map for all UI strings
- Create `useLanguage()` hook that reads from profile
- Apply translations across all pages (conditional rendering based on language)

---

## Phase 3: Store Page & Store Manager Mega Upgrade

### StorePage (`/store/:slug`)

- **Banner slideshow** — auto-rotating owner-uploaded banners from `store_media` with fade/slide animations
- **Video section** — embedded YouTube or uploaded video with play overlay
- **Active offers section** — animated cards showing business_offers with coupon codes, expiry, claim count
- **Full footer** — owner name, email, address, pincode, Google Map embed (iframe), social links (Instagram, YouTube, WhatsApp)
- **Lottie animations** — 7-8 free Lottie animations (loading, empty state, success, scroll indicators, floating elements)
- **4 complete store themes** — each is a full landing page design:
  1. **Starter** — minimal single-column, soft shadows, Inter font
  2. **Modern** — gradient hero, card grid, Space Grotesk headings, glassmorphism cards
  3. **Bold** — large typography, full-width sections, vibrant colors, parallax scroll
  4. **Luxury** — dark background, gold accents, serif headings, elegant animations
  - Each theme has distinct: fonts, color palette, card styles, button shapes, nav style, footer design, transition patterns
  - Themes are selectable from Store Manager

### StoreManager (`/store-manager`)

Convert into a proper multi-page dashboard with tabs:
- **Overview** — stats, quick links, live preview button
- **Appearance** — theme picker with live preview (4 themes), color customization
- **Media** — drag-and-drop upload, reorder, toggle active/inactive, video URL input
- **Content** — edit About Us, Services, custom sections with rich text
- **Products** — toggle visibility, reorder display order
- **Reviews** — approve/reject with bulk actions
- **SEO** — title, description, social media links
- **Offers** — create/manage offers with expiry, max claims, per-user limits
- **Theme Editor** — visual editor to customize selected theme (colors, fonts, spacing) similar to Wix/Dora/Framer style

---

## Phase 4: Business Features Upgrade

### Coupon Code System (Offers Page)
- Add expiry date picker, max claims limit, per-user limit fields
- Show claim count, active/expired status badges
- Validation in billing when applying coupons

### Customer Management Upgrade
- Customer profile detail page with purchase history timeline
- Credit/Udhar ledger — add credit, track payments, show balance
- Expense tracking per customer
- Export customer list as CSV
- Bulk SMS/WhatsApp message (UI ready)
- Customer tags/categories
- Birthday/anniversary reminders section

### Bill History Upgrade
- Date range filter (from-to calendar picker)
- Payment method filter
- Export invoices as CSV/PDF
- Daily/weekly/monthly summary cards
- Charts showing revenue trends

### Expense & Udhar Tracking (New)
- Expense categories (rent, salary, supplies, etc.)
- Add/edit/delete expenses with date, amount, category, notes
- Credit ledger: add udhar per customer, record payments, show outstanding balance
- Dashboard widget showing total expenses and outstanding credit

### Notifications System
- In-app notification bell with badge count
- Notification types: low stock, new review, payment received, offer expiring
- Mark as read, clear all
- Admin can broadcast notifications to all users

---

## Phase 5: Admin Dashboard Overhaul

### Layout Fix
- Sidebar navigation (already exists via AdminLayout) — fix buttons to be sidebar items, not top tabs
- Add sub-menu items under major sections (e.g., Users > All Users, Users > Roles)
- Proper routing: `/admin`, `/admin/gallery`, `/admin/users`, `/admin/stores`, etc.

### Admin Pages
- **Overview** — charts (revenue, signups, active users), animated stat cards
- **Gallery** — seed 100+ products via schema, bulk add, category filter, image upload
- **Users** — show last login time, role, business count, created date; search/filter
- **Stores** — all businesses with category filter, feature toggle, store preview link
- **SMTP** — keep Lovable Cloud auth (Google/Apple) option, allow custom SMTP config alongside, test email button
- **Email Alerts** — configure alert templates, send test emails via both Lovable and custom SMTP
- **Features** — category feature matrix toggle
- **Analytics** — revenue charts, user growth, store activity
- **Plans/Subscriptions** — manage Free/Pro/Enterprise tiers

### Admin Gallery Seeding
- Insert 100+ products across all 13 categories using the database insert tool

---

## Phase 6: UI/UX & Branding Polish

### Branding
- App name "Ezo" throughout — Ezo POS (billing), Ezo Admin (admin panel)
- Update logo, favicon, meta tags
- Receipt/invoice footer: "Powered by Ezo"
- Primary color update to match Ezo brand

### Lottie Animations (7-8 mandatory)
1. Page loading spinner
2. Empty state (no products, no invoices)
3. Success (payment complete, save success)
4. Onboarding welcome
5. Store page scroll decoration
6. Dashboard stat card hover
7. Notification bell ring
8. Confetti on first sale

### Responsive Polish
- All pages fully responsive (mobile bottom nav, desktop sidebar)
- Store page themes responsive down to 320px
- Admin dashboard responsive with collapsible sidebar

### Additional Creativity
- Dark/light mode toggle in settings
- Quick action floating button on dashboard
- WhatsApp share button on invoices
- QR code generator for store link
- Animated page transitions between routes
- Skeleton loading states on all data-heavy pages
- Pull-to-refresh on mobile lists

---

## Technical Approach

### Files to Create (~15 new files)
- `src/lib/i18n.ts` — Hindi/English translations
- `src/hooks/useLanguage.tsx` — language hook
- `src/hooks/useNotifications.tsx` — notification system hook
- `src/components/store/themes/StarterTheme.tsx`
- `src/components/store/themes/ModernTheme.tsx`
- `src/components/store/themes/BoldTheme.tsx`
- `src/components/store/themes/LuxuryTheme.tsx`
- `src/components/store/ThemeEditor.tsx`
- `src/components/store/StoreFooter.tsx`
- `src/components/common/LottieAnimation.tsx`
- `src/pages/ExpenseTracker.tsx`
- `src/pages/CreditLedger.tsx`
- `src/components/notifications/NotificationBell.tsx`
- `src/components/billing/CouponApply.tsx`

### Files to Modify (~20 files)
- All page files (Dashboard, Billing, BillHistory, CustomerManagement, OffersPage, etc.)
- App.tsx (new routes)
- AdminDashboard.tsx (sidebar sub-nav, new tabs)
- Onboarding.tsx (new steps)
- StorePage.tsx (themes, footer, slideshow, offers, videos)
- StoreManager.tsx (theme editor, more tabs)
- SettingsPage.tsx (language toggle)

### Database Migrations (6 migrations)
1. Alter `business_offers` — add expiry/claim columns
2. Create `expenses` table
3. Create `credit_ledger` table
4. Alter `businesses` — add social/location fields
5. Alter `profiles` — add language, last_sign_in_at
6. Create `notifications` table

### Dependencies to Add
- `lottie-react` — for Lottie animations
- `react-beautiful-dnd` or `@dnd-kit/core` — for drag-and-drop in store manager

