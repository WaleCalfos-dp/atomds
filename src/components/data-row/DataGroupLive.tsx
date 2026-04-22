import { type Brand } from '../../data/tokens';
import {
  DataRowLive,
  type DataRowType,
  type DataRowFlightData,
} from './DataRowLive';

// ─── Public types ─────────────────────────────────────────────────────────────
// Mapped 1:1 to the Figma component set: Data Group.
// Heights taken from the SVG exports:
//   Single     (Flight)  → 320 × 106
//   Multiple   (Flight)  → 320 × 212
//   Group 1    (Default) → 320 × 292
//   Group 2    (Default) → 321 × 256
export type DataGroupType = 'Single' | 'Multiple' | 'Group 1' | 'Group 2';
export type DataGroupProductModule = 'Default' | 'Flight';

export interface DataGroupRow {
  type?: DataRowType;
  label: string;
  dataCount?: 1 | 2 | 3;
  data1?: string;
  data2?: string;
  data3?: string;
  flightData?: DataRowFlightData;
  showChevron?: boolean;
  showBadge?: boolean;
  showIcon?: boolean;
  showButton?: boolean;
  badgeText?: string;
  buttonLabel?: string;
}

interface DataGroupLiveProps {
  type?: DataGroupType;
  productModule?: DataGroupProductModule;
  rows?: DataGroupRow[];
  brand?: Brand;
}

// ─── Preset content (matches the Figma exports row-for-row) ──────────────────
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

const PRESETS: Record<DataGroupType, Record<DataGroupProductModule, DataGroupRow[]>> = {
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

export function DataGroupLive({
  type = 'Group 1',
  productModule = 'Default',
  rows,
  brand = 'dragonpass',
}: DataGroupLiveProps) {
  // ── Token palette ────────────────────────────────────────────────────────
  const surface      = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const borderColor  = 'var(--atom-border-default-border-default, #CDCBCB)';
  const fontFamily   = 'var(--atom-font-body, "Poppins", system-ui, sans-serif)';

  // Figma "Single" is a flush, flat row — no rounded container, no padding.
  const isSingle = type === 'Single';
  const effectiveRows = rows ?? PRESETS[type][productModule];
  const count = effectiveRows.length;

  // ── Flush (Single) render ────────────────────────────────────────────────
  if (isSingle) {
    return (
      <div style={{ width: '320px', fontFamily, boxSizing: 'border-box' }}>
        {effectiveRows.map((row, i) => (
          <DataRowLive
            key={i}
            type={row.type ?? 'Multi-line'}
            position="Last"
            productModule={productModule === 'Flight' ? 'Transport' : 'All'}
            dataCount={row.dataCount}
            labelText={row.label}
            data1Text={row.data1}
            data2Text={row.data2}
            data3Text={row.data3}
            flightData={row.flightData}
            showBadge={row.showBadge}
            showChevronRight={row.showChevron}
            showIcon={row.showIcon}
            showButton={row.showButton}
            badgeText={row.badgeText}
            buttonLabel={row.buttonLabel}
            brand={brand}
          />
        ))}
      </div>
    );
  }

  // ── Grouped (rounded container) render ───────────────────────────────────
  return (
    <div
      style={{
        width: type === 'Group 2' ? '321px' : '320px',
        padding: '0 16px',
        backgroundColor: surface,
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontFamily,
      }}
    >
      {effectiveRows.map((row, i) => {
        const isLast = i === count - 1;
        return (
          <DataRowLive
            key={i}
            type={row.type ?? 'Multi-line'}
            position={isLast ? 'Last' : 'First and Middle'}
            productModule={productModule === 'Flight' ? 'Transport' : 'All'}
            dataCount={row.dataCount}
            labelText={row.label}
            data1Text={row.data1}
            data2Text={row.data2}
            data3Text={row.data3}
            flightData={row.flightData}
            showBadge={row.showBadge}
            showChevronRight={row.showChevron}
            showIcon={row.showIcon}
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
