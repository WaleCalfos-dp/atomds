# Portal

Customer-facing brand theming portal. Each authenticated user owns one brand row (six seed colours + name + logo + font). Their saved brand drives a live preview of five Atom components on the right.

## Setup

1. **Create a Supabase project** at https://supabase.com/dashboard. Note the project URL and the anon public key.
2. **Apply the schema** — open the project's SQL editor, paste the contents of `supabase/schema.sql`, run it.
3. **Disable email confirmation** — in **Authentication → Providers → Email**, set "Confirm email" to OFF. Without this, sign-up doesn't auto-sign-in and the verification flow blocks.
4. **Env vars** — copy `.env.example` to `.env.local` and fill in the URL + anon key.

## Running

From the workspace root:

```bash
npm install
npm run dev:portal       # http://localhost:5174
```

## How theming works

- The 6 seeds are passed to `generateBrandTokens()` from `@atom-core` — the OKLCH-based generator derives 90 primitive colour stops + 67 semantic atom tokens.
- `buildStudioCss(brand, '[data-brand-portal="on"]')` returns a CSS string with all 67 `--atom-*` variables under that selector.
- The preview pane wraps the 5 components in `<div data-brand-portal="on">` so the variables resolve. Components themselves consume `var(--atom-…)` — no React re-render is needed for the cascade.

## Data model

Single `brands` table, primary keyed on `user_id`. RLS pins every row to `auth.uid()`, so the public anon key safely runs all CRUD from the browser.

```sql
create table public.brands (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  name           text not null,
  logo_url       text,
  font           text not null,
  seed_primary   text not null,
  seed_secondary text not null,
  seed_neutral   text not null,
  seed_success   text not null,
  seed_warning   text not null,
  seed_error     text not null,
  updated_at     timestamptz not null default now()
);
```

Edits debounce-upsert at 300ms. Refresh restores from Supabase.
