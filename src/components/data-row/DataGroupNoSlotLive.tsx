import { type Brand } from '../../data/tokens';
import {
  DataRowLive,
  type DataRowType,
  type DataRowFlightData,
} from './DataRowLive';

// ─── Public types ─────────────────────────────────────────────────────────────
// Mapped 1:1 to the Figma component set: Data Group (No slot).
// Heights taken from the SVG exports:
//   Single    (Flight)  Border=On  → 320 × 106   (flush, no border axis effect)
//   Multiple  (Flight)  Border=On  → 320 × 212
//   Group 1   (Default) Border=Off → 320 × 260   (no rounded wrapper / border / padding)
//   Group 1   (Default) Border=On  → 320 × 292   (+32 for the 16×16 padding around the rounded container)
//   Group 2   (Default) Border=Off → 321 × 224
//   Group 2   (Default) Border=On  → 321 × 256
//
// "No slot" means the rows inside never render a leading icon — the leading
// slot is omitted entirely, regardless of row type.
export type DataGroupNoSlotType = 'Single' | 'Multiple' | 'Group 1' | 'Group 2';
export type DataGroupNoSlotProductModule = 'Default' | 'Flight';
export type DataGroupNoSlotBorder = 'On' | 'Off';

export interface DataGroupNoSlotRow {
  type?: DataRowType;
  label: string;
  dataCount?: 1 | 2 | 3;
  data1?: string;
  data2?: string;
  data3?: string;
  flightData?: DataRowFlightData;
  showChevron?: boolean;
  showBadge?: boolean;
  showButton?: boolean;
  badgeText?: string;
  buttonLabel?: string;
}

interface DataGroupNoSlotLiveProps {
  type?: DataGroupNoSlotType;
  productModule?: DataGroupNoSlotProductModule;
  border?: DataGroupNoSlotBorder;
  rows?: DataGroupNoSlotRow[];
  brand?: Brand;
}

// ─── Preset content (no-slot variants mirror the Data Group presets, but with
// row type pinned to "Multi-line" / "Single-line" — never "Multi-line + Icon",
// and showIcon is always false). ─────────────────────────────────────────────
const FLIGHT_OUTBOUND: DataRowFlightData = {
  originCode: 'LHR',
  originTime: '12:30',
  destCode: 'JFK',
  destTime: '15:45',
  duration: '8h 15m',
};
const FLIGHT_RETURN: DataRowFlightData = {
  originCode: 'JFK',
  originTime: '18:00',
  destCode: 'LHR',
  destTime: '06:15',
  duration: '7h 15m',
};

const PRESETS: Record<DataGroupNoSlotType, Record<DataGroupNoSlotProductModule, DataGroupNoSlotRow[]>> = {
  Single: {
    Default: [
      { type: 'Multi-line', label: 'Label', data1: 'Data' },
    ],
    Flight: [
      { type: 'Multi-line', label: 'Outbound', flightData: FLIGHT_OUTBOUND },
    ],
  },
  Multiple: {
    Default: [
      { type: 'Multi-line', label: 'Label 1', data1: 'Data' },
      { type: 'Multi-line', label: 'Label 2', data1: 'Data' },
    ],
    Flight: [
      { type: 'Multi-line', label: 'Outbound', flightData: FLIGHT_OUTBOUND },
      { type: 'Multi-line', label: 'Return',   flightData: FLIGHT_RETURN },
    ],
  },
  'Group 1': {
    Default: [
      { type: 'Multi-line', label: 'Name',         data1: 'Jane Doe' },
      { type: 'Multi-line', label: 'Email',        data1: 'jane.doe@example.com' },
      { type: 'Multi-line', label: 'Membership',   data1: 'Gold',             showBadge: true, badgeText: 'Active' },
      { type: 'Multi-line', label: 'Member since', data1: 'January 2024' },
    ],
    Flight: [
      { type: 'Multi-line', label: 'Outbound',   flightData: FLIGHT_OUTBOUND },
      { type: 'Multi-line', label: 'Return',     flightData: FLIGHT_RETURN },
      { type: 'Multi-line', label: 'Passengers', data1: '2 adults, 1 child' },
      { type: 'Multi-line', label: 'Class',      data1: 'Economy' },
    ],
  },
  'Group 2': {
    Default: [
      { type: 'Multi-line', label: 'Label 1', data1: 'Data' },
      { type: 'Multi-line', label: 'Label 2', data1: 'Data' },
      { type: 'Multi-line', label: 'Label 3', data1: 'Data' },
    ],
    Flight: [
      { type: 'Multi-line', label: 'Outbound',   flightData: FLIGHT_OUTBOUND },
      { type: 'Multi-line', label: 'Return',     flightData: FLIGHT_RETURN },
      { type: 'Multi-line', label: 'Passengers', data1: '2 adults' },
    ],
  },
};

export function DataGroupNoSlotLive({
  type = 'Group 1',
  productModule = 'Default',
  border = 'On',
  rows,
  brand = 'dragonpass',
}: DataGroupNoSlotLiveProps) {
  // ── Token palette ────────────────────────────────────────────────────────
  const surface      = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const borderColor  = 'var(--atom-border-default-border-default, #CDCBCB)';
  const fontFamily   = 'var(--atom-font-body, "Poppins", system-ui, sans-serif)';

  const isSingle = type === 'Single';
  const effectiveRows = rows ?? PRESETS[type][productModule];
  const count = effectiveRows.length;

  // Single ignores the Border axis in Figma — it's always flush.
  const showRoundedWrapper = !isSingle && border === 'On';

  const wrapperStyle: React.CSSProperties = showRoundedWrapper
    ? {
        width: type === 'Group 2' ? '321px' : '320px',
        padding: '0 16px',
        backgroundColor: surface,
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontFamily,
      }
    : {
        width: type === 'Group 2' ? '321px' : '320px',
        boxSizing: 'border-box',
        fontFamily,
      };

  return (
    <div style={wrapperStyle}>
      {effectiveRows.map((row, i) => {
        const isLast = i === count - 1;
        return (
          <DataRowLive
            key={i}
            type={row.type ?? 'Multi-line'}
            position={isSingle || isLast ? 'Last' : 'First and Middle'}
            productModule={productModule === 'Flight' ? 'Transport' : 'All'}
            dataCount={row.dataCount}
            labelText={row.label}
            data1Text={row.data1}
            data2Text={row.data2}
            data3Text={row.data3}
            flightData={row.flightData}
            showBadge={row.showBadge}
            showChevronRight={row.showChevron}
            showIcon={false} /* No-slot rows never render a leading icon */
            showButton={row.showButton}
            badgeText={row.badgeText}
            buttonLabel={row.buttonLabel}
            brand={brand}
          />
        );
      })}
    </div>
  );
}
