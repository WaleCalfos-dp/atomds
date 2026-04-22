import { type Brand } from '../../data/tokens';

// ─── Public types ─────────────────────────────────────────────────────────────
// Aligned 1:1 with the Figma component set (30 SVG exports):
//   State (5) × Month (2) × Style (3) × Breakpoint (1: Mobile) = 30.
export type DatePickerState =
  | 'Default'
  | 'Today Selected'
  | 'Day Selected'
  | 'Date Range'
  | 'Selecting Range';
export type DatePickerMonth = 'One' | 'Multiple';
export type DatePickerStyle = 'Filled Background' | 'No Background' | 'No Stroke';

interface DatePickerLiveProps {
  pickerState?: DatePickerState;
  month?: DatePickerMonth;
  pickerStyle?: DatePickerStyle;
  /** Month index (0-11) for the first rendered month (Figma default = 4 / May) */
  calendarMonth?: number;
  /** Year for the first rendered month (Figma default = 2025) */
  calendarYear?: number;
  /** Day of month (1-31) to mark as "today". Figma defaults: 3, except Today Selected → 10. */
  todayDay?: number;
  /** Day of month (1-31) to mark as selected. Figma default for Day Selected = 21. */
  selectedDay?: number;
  /** Range start day. Figma default for Date / Selecting Range = 21. */
  rangeStart?: number;
  /** Range end day. Figma defaults: Date Range = 26, Selecting Range = 24. */
  rangeEnd?: number;
  /** Kept for backward compatibility with the docs page; Figma renders no label. */
  showLabel?: boolean;
  labelText?: string;
  brand?: Brand;
}

// ─── Figma-derived defaults (May 2025) ────────────────────────────────────────
//   Default           → today = 3
//   Today Selected    → today = 10 (today is the selected / circled day)
//   Day Selected      → selected = 21, today = 3 (rendered as underline)
//   Date Range        → start = 21, end = 26, today = 3
//   Selecting Range   → start = 21, end = 24 (end has muted tail, NO filled circle)
const DEFAULT_TODAY = 3;
const DEFAULT_TODAY_WHEN_TODAY_SELECTED = 10;
const DEFAULT_SELECTED = 21;
const DEFAULT_RANGE_START = 21;
const DEFAULT_RANGE_END_COMMITTED = 26;
const DEFAULT_RANGE_END_SELECTING = 24;

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
// Monday-first weekday order (ISO / European convention to match dragonpass UK).
const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

// Convert JS getDay() (0=Sun..6=Sat) → Monday-first offset (0=Mon..6=Sun).
function mondayOffset(jsDay: number): number {
  return (jsDay + 6) % 7;
}

// ─── Per-cell kind model ──────────────────────────────────────────────────────
// Each in-month day resolves to one of these variants. Ranges only apply on the
// first rendered month; secondary months (Multiple) always render as plain days.
type CellKind =
  | 'none'
  | 'rangeMiddle'     // full-width muted fill, no radius
  | 'rangeStart'      // filled 40×40 circle + right-side muted trail
  | 'rangeEnd'        // filled 40×40 circle + left-side muted trail
  | 'rangeSolo'       // filled 40×40 circle only (single-day range)
  | 'rangeTrailEnd'   // muted left trail, NO filled circle (Selecting Range terminus)
  | 'endpoint';       // filled 40×40 circle only (Day / Today Selected)

export function DatePickerLive({
  pickerState = 'Default',
  month = 'One',
  pickerStyle = 'Filled Background',
  calendarMonth = 4,
  calendarYear = 2025,
  todayDay,
  selectedDay,
  rangeStart,
  rangeEnd,
  showLabel = false,
  labelText = 'Date',
  brand: _brand = 'dragonpass',
}: DatePickerLiveProps) {
  void _brand;

  // ── Resolve effective per-state defaults ─────────────────────────────────
  const effectiveToday =
    todayDay ??
    (pickerState === 'Today Selected' ? DEFAULT_TODAY_WHEN_TODAY_SELECTED : DEFAULT_TODAY);
  const effectiveSelected =
    selectedDay ??
    (pickerState === 'Today Selected' ? DEFAULT_TODAY_WHEN_TODAY_SELECTED :
     pickerState === 'Day Selected'   ? DEFAULT_SELECTED :
     null);
  const effectiveRangeStart =
    rangeStart ??
    ((pickerState === 'Date Range' || pickerState === 'Selecting Range') ? DEFAULT_RANGE_START : null);
  const effectiveRangeEnd =
    rangeEnd ??
    (pickerState === 'Date Range'      ? DEFAULT_RANGE_END_COMMITTED :
     pickerState === 'Selecting Range' ? DEFAULT_RANGE_END_SELECTING :
     null);

  // ── Token palette ────────────────────────────────────────────────────────
  const fontFamily   = 'var(--atom-font-body, "Poppins", system-ui, sans-serif)';
  const surface      = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const borderColor  = 'var(--atom-border-default-border-default, #cdcbcb)';
  const fgPrimary    = 'var(--atom-foreground-core-fg-primary, #4b4a4a)';
  const mutedBg      = 'var(--atom-background-core-bg-muted, rgba(10, 35, 51, 0.04))';
  const selectedBg   = 'var(--atom-background-primary-bg-primary-pressed-brand, #0a2333)';
  const selectedFg   = 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)';
  const todayStroke  = '#006B99';

  // ── Style axis (from Figma Style axis) ───────────────────────────────────
  //   Filled Background → white surface + stroke    (the default card)
  //   No Background     → transparent + stroke      (flush on parent, keeps border)
  //   No Stroke         → transparent + no border   (flush on parent, naked)
  const hasFill   = pickerStyle === 'Filled Background';
  const hasStroke = pickerStyle !== 'No Stroke';

  // ── Month list ───────────────────────────────────────────────────────────
  //   One       → 1 month
  //   Multiple  → 3 consecutive months stacked vertically (per Figma 368×1074)
  const monthCount = month === 'Multiple' ? 3 : 1;
  const months: Array<{ mo: number; yr: number; isFirst: boolean }> = [];
  for (let i = 0; i < monthCount; i++) {
    const mo = (calendarMonth + i) % 12;
    const yr = calendarYear + Math.floor((calendarMonth + i) / 12);
    months.push({ mo, yr, isFirst: i === 0 });
  }

  // ── Cell-kind resolver ────────────────────────────────────────────────────
  function resolveCellKind(day: number, isFirst: boolean): CellKind {
    if (!isFirst) return 'none';

    if (pickerState === 'Default') return 'none';

    if (pickerState === 'Today Selected') {
      return day === effectiveToday ? 'endpoint' : 'none';
    }

    if (pickerState === 'Day Selected') {
      return day === effectiveSelected ? 'endpoint' : 'none';
    }

    if (pickerState === 'Date Range' && effectiveRangeStart !== null && effectiveRangeEnd !== null) {
      const s = Math.min(effectiveRangeStart, effectiveRangeEnd);
      const e = Math.max(effectiveRangeStart, effectiveRangeEnd);
      if (day === s && day === e) return 'rangeSolo';
      if (day === s) return 'rangeStart';
      if (day === e) return 'rangeEnd';
      if (day > s && day < e) return 'rangeMiddle';
      return 'none';
    }

    if (pickerState === 'Selecting Range' && effectiveRangeStart !== null && effectiveRangeEnd !== null) {
      const s = effectiveRangeStart;
      const e = effectiveRangeEnd;
      // Hover hasn't moved past start yet → just the start endpoint.
      if (e <= s) return day === s ? 'rangeSolo' : 'none';
      if (day === s) return 'rangeStart';
      if (day === e) return 'rangeTrailEnd';
      if (day > s && day < e) return 'rangeMiddle';
      return 'none';
    }

    return 'none';
  }

  // Today underline only renders when today isn't already filled by a selection.
  function shouldUnderlineToday(day: number, isFirst: boolean, kind: CellKind): boolean {
    if (!isFirst) return false;
    if (day !== effectiveToday) return false;
    if (kind === 'endpoint' || kind === 'rangeStart' || kind === 'rangeEnd' || kind === 'rangeSolo') return false;
    return true;
  }

  // ── Outer container ──────────────────────────────────────────────────────
  const containerStyle: React.CSSProperties = {
    fontFamily,
    width: '368px',
    backgroundColor: hasFill ? surface : 'transparent',
    border: hasStroke ? `1px solid ${borderColor}` : 'none',
    borderRadius: '8px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    color: fgPrimary,
  };

  return (
    <div style={containerStyle}>
      {/* Legacy label prop (kept for backward compatibility; Figma has no label row). */}
      {showLabel && (
        <div
          style={{
            padding: '16px 16px 0',
            fontSize: '12px',
            fontWeight: 500,
            color: fgPrimary,
          }}
        >
          {labelText}
        </div>
      )}

      {months.map(({ mo, yr, isFirst }, idx) => (
        <MonthBlock
          key={`${yr}-${mo}`}
          mo={mo}
          yr={yr}
          isFirst={isFirst}
          showDowRow={idx === 0}
          borderColor={borderColor}
          fgPrimary={fgPrimary}
          mutedBg={mutedBg}
          selectedBg={selectedBg}
          selectedFg={selectedFg}
          todayStroke={todayStroke}
          resolveCellKind={resolveCellKind}
          shouldUnderlineToday={shouldUnderlineToday}
        />
      ))}

      <ButtonGroup selectedBg={selectedBg} selectedFg={selectedFg} />
    </div>
  );
}

// ─── Month block: header + optional DOW row + day grid ──────────────────────
function MonthBlock({
  mo,
  yr,
  isFirst,
  showDowRow,
  borderColor,
  fgPrimary,
  mutedBg,
  selectedBg,
  selectedFg,
  todayStroke,
  resolveCellKind,
  shouldUnderlineToday,
}: {
  mo: number;
  yr: number;
  isFirst: boolean;
  showDowRow: boolean;
  borderColor: string;
  fgPrimary: string;
  mutedBg: string;
  selectedBg: string;
  selectedFg: string;
  todayStroke: string;
  resolveCellKind: (day: number, isFirst: boolean) => CellKind;
  shouldUnderlineToday: (day: number, isFirst: boolean, kind: CellKind) => boolean;
}) {
  const dim = new Date(yr, mo + 1, 0).getDate();
  const firstDow = mondayOffset(new Date(yr, mo, 1).getDay());
  const cells: Array<number | null> = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      {/* Month header — left-aligned "Month, Year", 14px/20 medium */}
      <div
        style={{
          padding: '16px',
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '20px',
          color: fgPrimary,
        }}
      >
        {MONTH_NAMES[mo]}, {yr}
      </div>

      {/* Day-of-week row (only once, above the first month) */}
      {showDowRow && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 48px)',
            justifyContent: 'center',
            height: '48px',
            borderBottom: `1px solid ${borderColor}`,
          }}
          role="row"
        >
          {DOW.map((d, i) => (
            <div
              key={i}
              role="columnheader"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 500,
                color: fgPrimary,
              }}
            >
              {d}
            </div>
          ))}
        </div>
      )}

      {/* Day grid (7 × N rows of 48×48 cells, centered) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 48px)',
          justifyContent: 'center',
        }}
        role="grid"
      >
        {cells.map((day, i) => {
          if (day === null) {
            return (
              <div
                key={i}
                role="gridcell"
                style={{ width: '48px', height: '48px' }}
                aria-hidden="true"
              />
            );
          }
          const kind = resolveCellKind(day, isFirst);
          const underline = shouldUnderlineToday(day, isFirst, kind);
          return (
            <DayCell
              key={i}
              day={day}
              kind={kind}
              underline={underline}
              mutedBg={mutedBg}
              selectedBg={selectedBg}
              selectedFg={selectedFg}
              todayStroke={todayStroke}
              fgPrimary={fgPrimary}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Day cell ───────────────────────────────────────────────────────────────
function DayCell({
  day,
  kind,
  underline,
  mutedBg,
  selectedBg,
  selectedFg,
  todayStroke,
  fgPrimary,
}: {
  day: number;
  kind: CellKind;
  underline: boolean;
  mutedBg: string;
  selectedBg: string;
  selectedFg: string;
  todayStroke: string;
  fgPrimary: string;
}) {
  const isEndpoint =
    kind === 'endpoint' ||
    kind === 'rangeStart' ||
    kind === 'rangeEnd' ||
    kind === 'rangeSolo';
  const textColor = isEndpoint ? selectedFg : fgPrimary;

  return (
    <div
      role="gridcell"
      style={{
        position: 'relative',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-selected={isEndpoint}
      aria-current={underline ? 'date' : undefined}
    >
      {/* 1. Range trail (always behind the endpoint circle). */}
      {kind === 'rangeMiddle' && (
        <div
          style={{
            position: 'absolute',
            top: '4px',
            bottom: '4px',
            left: 0,
            right: 0,
            backgroundColor: mutedBg,
          }}
          aria-hidden="true"
        />
      )}
      {kind === 'rangeStart' && (
        <div
          style={{
            position: 'absolute',
            top: '4px',
            bottom: '4px',
            right: 0,
            width: '24px',
            backgroundColor: mutedBg,
          }}
          aria-hidden="true"
        />
      )}
      {(kind === 'rangeEnd' || kind === 'rangeTrailEnd') && (
        <div
          style={{
            position: 'absolute',
            top: '4px',
            bottom: '4px',
            left: 0,
            width: '24px',
            backgroundColor: mutedBg,
          }}
          aria-hidden="true"
        />
      )}

      {/* 2. Filled endpoint circle (40×40 centered). */}
      {isEndpoint && (
        <div
          style={{
            position: 'absolute',
            top: '4px',
            bottom: '4px',
            left: '4px',
            right: '4px',
            borderRadius: '999px',
            backgroundColor: selectedBg,
          }}
          aria-hidden="true"
        />
      )}

      {/* 3. Day number (button for keyboard activation). */}
      <button
        type="button"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          border: 'none',
          color: textColor,
          fontSize: '14px',
          fontWeight: isEndpoint ? 500 : 400,
          lineHeight: '20px',
          cursor: 'pointer',
          padding: 0,
          fontFamily: 'inherit',
        }}
      >
        {day}
      </button>

      {/* 4. Today underline — 12×2 blue stroke under the day number. */}
      {underline && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            width: '12px',
            height: '2px',
            marginLeft: '-6px',
            backgroundColor: todayStroke,
            borderRadius: '2px',
            zIndex: 2,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// ─── Button group (sticky bottom section with iOS home indicator) ───────────
function ButtonGroup({
  selectedBg,
  selectedFg,
}: {
  selectedBg: string;
  selectedFg: string;
}) {
  return (
    <div
      style={{
        padding: '16px 16px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 -6px 15px rgba(10, 35, 51, 0.08)',
      }}
    >
      {/* Button row — Secondary (outline) + Primary (filled). */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          style={{
            flex: 1,
            padding: '14px 16px',
            borderRadius: '999px',
            border: `1px solid ${selectedBg}`,
            backgroundColor: 'transparent',
            color: selectedBg,
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '20px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          style={{
            flex: 1,
            padding: '14px 16px',
            borderRadius: '999px',
            border: 'none',
            backgroundColor: selectedBg,
            color: selectedFg,
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '20px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Apply
        </button>
      </div>

      {/* iOS home indicator — 144×5 black pill, centered. */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '21px',
        }}
      >
        <div
          style={{
            width: '144px',
            height: '5px',
            borderRadius: '999px',
            backgroundColor: '#000000',
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
