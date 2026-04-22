import { type Brand } from '../../data/tokens';

export type BreadcrumbsDivider = 'Chevron' | 'Forward Slash';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsLiveProps {
  items?: BreadcrumbItem[];
  divider?: BreadcrumbsDivider;
  /** Number of breadcrumb items to display (2-6). When set to 6, ellipsis truncation kicks in. */
  count?: number;
  /** Max items before collapsing to "…" (0 disables collapse). At Count=6 this auto-collapses. */
  maxItems?: number;
  /**
   * Render a trailing divider after the current (last) crumb to match the Figma spec.
   * Purely decorative (aria-hidden).
   */
  trailingDivider?: boolean;
  brand?: Brand;
}

const DEFAULT_ITEMS: BreadcrumbItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Components', href: '#' },
  { label: 'Breadcrumbs' },
];

/** Exact Figma SVG values (extracted from breadcrumb/Count=*, Divider=* */
const DIVIDER_COLOR = 'var(--atom-foreground-core-fg-tertiary, #afaead)';
const LINK_COLOR = 'var(--atom-foreground-core-fg-primary, #4b4a4a)';
const CURRENT_COLOR = 'var(--atom-foreground-states-fg-pressed, #063e56)';
const FONT_SIZE = '12px';
const GAP = '12px';
const LINE_HEIGHT = '18px';

/** Forward-slash glyph matching Figma parallelogram (5.1 × 15.6 in 18-tall frame) */
function SlashDivider() {
  return (
    <svg width="6" height="18" viewBox="0 0 6 18" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path
        d="M5.548 1.216L1.712 16.784H0.452L4.274 1.216H5.548Z"
        fill={DIVIDER_COLOR}
      />
    </svg>
  );
}

/** Chevron glyph matching Figma right-chevron (6.1 × 11.4 in 18-tall frame) */
function ChevronDivider() {
  return (
    <svg width="8" height="18" viewBox="0 0 8 18" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path
        d="M1.489 3.29C1.697 3.082 2.034 3.081 2.243 3.29L7.576 8.623C7.784 8.831 7.784 9.169 7.576 9.378L2.243 14.711C2.034 14.919 1.697 14.919 1.489 14.711C1.28 14.502 1.28 14.165 1.489 13.957L6.445 9L1.489 4.044C1.28 3.835 1.28 3.498 1.489 3.29Z"
        fill={DIVIDER_COLOR}
      />
    </svg>
  );
}

function Divider({ type }: { type: BreadcrumbsDivider }) {
  return type === 'Chevron' ? <ChevronDivider /> : <SlashDivider />;
}

/** Ellipsis matching Figma: 3 circles, r=1, 6px spacing, fill = link color (#4b4a4a) */
function EllipsisDots() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="1" cy="9" r="1" fill={LINK_COLOR} />
      <circle cx="7" cy="9" r="1" fill={LINK_COLOR} />
      <circle cx="13" cy="9" r="1" fill={LINK_COLOR} />
    </svg>
  );
}

export function BreadcrumbsLive({
  items = DEFAULT_ITEMS,
  divider = 'Chevron',
  count,
  maxItems = 0,
  trailingDivider = true,
  brand: _brand = 'dragonpass',
}: BreadcrumbsLiveProps) {
  const fontFamily = 'var(--atom-font-body, Poppins, sans-serif)';

  // If count is provided, trim items to that length
  const countedItems = count && count >= 2 && count <= 6 ? items.slice(0, count) : items;

  // Auto-collapse when Count=6 (Figma shows Count=6 as collapsed: [first, …, secondLast, last])
  const autoCollapse = count === 6;
  const effectiveMax = autoCollapse ? 3 : maxItems;

  let displayItems = countedItems;
  let ellipsisAfterIdx = -1;
  if (effectiveMax > 0 && countedItems.length > effectiveMax) {
    displayItems = [countedItems[0], ...countedItems.slice(countedItems.length - (effectiveMax - 1))];
    ellipsisAfterIdx = 0;
  }

  const textStyle = (active: boolean): React.CSSProperties => ({
    fontFamily,
    fontSize: FONT_SIZE,
    fontWeight: 400,
    lineHeight: LINE_HEIGHT,
    color: active ? CURRENT_COLOR : LINK_COLOR,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  });

  return (
    <nav aria-label="Breadcrumb" style={{ fontFamily }}>
      <ol
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: GAP,
          flexWrap: 'wrap',
        }}
      >
        {displayItems.map((item, idx) => {
          const isLast = idx === displayItems.length - 1;
          return (
            <li
              key={idx}
              style={{ display: 'flex', alignItems: 'center', gap: GAP }}
            >
              {isLast ? (
                <span aria-current="page" style={textStyle(true)}>
                  {item.label}
                </span>
              ) : item.href ? (
                <a href={item.href} style={textStyle(false)}>
                  {item.label}
                </a>
              ) : (
                <span style={textStyle(false)}>{item.label}</span>
              )}

              {/* Divider after non-last crumb */}
              {!isLast && <Divider type={divider} />}

              {/* Ellipsis block (when collapsed) */}
              {idx === ellipsisAfterIdx && (
                <>
                  <EllipsisDots />
                  <Divider type={divider} />
                </>
              )}

              {/* Trailing divider after the current crumb — matches Figma spec */}
              {isLast && trailingDivider && <Divider type={divider} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
