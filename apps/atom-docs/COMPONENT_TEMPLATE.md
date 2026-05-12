# Atom Component Page Template

Every component documentation page follows this exact 7-section structure.
Use `DividerPage.tsx` as the gold standard reference implementation.

---

## File Structure

Each component requires three files:

```
src/components/{name}/{Name}Live.tsx   – Stateless render of the live component
src/pages/{Name}Page.tsx               – Documentation page (7 sections)
```

Plus wiring in:
- `src/data/navigation.ts` – Add route to NAV_SECTIONS components array
- `src/App.tsx` – Import page + add <Route>
- `src/components/Sidebar.tsx` – Add icon to itemIcons record

---

## {Name}Live.tsx Pattern

```tsx
import { type Brand } from '../../data/tokens';

export type {Name}Variant = 'A' | 'B';

interface {Name}LiveProps {
  variant?: {Name}Variant;
  brand?: Brand;
}

export function {Name}Live({ variant = 'A', brand: _brand = 'dragonpass' }: {Name}LiveProps) {
  // Render using CSS custom properties: var(--atom-..., fallback)
  // Never read from RESOLVED_SEMANTIC_TOKENS — that's for the page only
  return ( /* ... */ );
}
```

---

## {Name}Page.tsx — 7 Sections

### Shared Constants (top of file)

```tsx
const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const LINE: React.CSSProperties = { width: '1px', height: '32px', backgroundColor: '#94a3b8' };

const LABEL_STYLE: React.CSSProperties = {
  margin: '0 0 8px', fontSize: '11px', fontWeight: 600,
  color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em',
};
```

### SegBtn Control Component

```tsx
function SegBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '5px 4px', borderRadius: '6px', border: 'none',
      backgroundColor: active ? '#fff' : 'transparent',
      color: active ? '#111827' : '#6b7280',
      fontSize: '11px', fontWeight: active ? 600 : 400, cursor: 'pointer',
      boxShadow: active ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
      transition: 'all 0.15s ease',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>{children}</button>
  );
}
```

### CalloutDot Component (for anatomy)

```tsx
function CalloutDot({ num }: { num: string }) {
  return (
    <span style={{
      width: '20px', height: '20px', borderRadius: '50%',
      backgroundColor: '#1e293b', color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '11px', fontWeight: 700,
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)', flexShrink: 0,
    }}>{num}</span>
  );
}
```

---

### Section 1: Interactive Preview

- Canvas (left): dotted background, component at 2-3x scale, AnimatePresence crossfade
- Controls (right): 224px sidebar, SegBtn pill toggles in `{ padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px' }` containers
- Text inputs for editable props

### Section 2: Component Info

- `<h1>` title (28px bold)
- Description paragraph (15px, #6b7280)
- Feedback + Stable badges

### Section 3: Anatomy

- Dotted bg diagram with component at 2.5-3x scale
- Numbered CalloutDot callouts with LINE connectors
- Legend grid: `gridTemplateColumns: 'repeat(N, 1fr)'` with num/label/desc cards

### Section 4: Variants

- Property table (Property | Values) in rounded bordered table
- Visual preview grid below: cards with `{ padding: '20px 24px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }` showing each variant rendered

### Section 5: Design Tokens

- Table with Role | Token (CSS var in `<code>`) | Value | Swatch columns
- Active row: `borderLeft: '3px solid #3b82f6'`, full opacity
- Inactive row: `opacity: 0.35`, transparent left border
- Swatch: 24x24 rounded div with resolved color

### Section 6: Accessibility

- Array of `{ icon, title, body }` rows
- Each in a card: `{ padding: '16px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }`

### Section 7: Usage

- Do / Don't two-column grid
- Do: green border/bg (`#bbf7d0` / `#f0fdf4`), ✓ header
- Don't: red border/bg (`#fecaca` / `#fef2f2`), ✗ header
- Optional: per-variant usage cards above the Do/Don't
