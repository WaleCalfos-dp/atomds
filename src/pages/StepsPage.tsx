import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';

interface StepsPageProps {
  brand: Brand;
}

/* -------------------------------------------------------------------------- */
/*  Constants — from Figma property surface                                   */
/* -------------------------------------------------------------------------- */

type StepsDirection = 'Horizontal' | 'Vertical';
type StepsCount = 2 | 3 | 4 | 5 | 6 | 7 | 8;
type StepsType = 'Number' | 'Icon';

const DIRECTIONS: StepsDirection[] = ['Horizontal', 'Vertical'];
const COUNTS: StepsCount[] = [2, 3, 4, 5, 6, 7, 8];
const FILLS = ['Off', 'On'] as const;
const TYPES: StepsType[] = ['Number', 'Icon'];

/* -------------------------------------------------------------------------- */
/*  Shared styles / helpers                                                   */
/* -------------------------------------------------------------------------- */

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const LABEL_STYLE: React.CSSProperties = {
  margin: '0 0 8px',
  fontSize: '11px',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const LINE: React.CSSProperties = { width: '1px', height: '28px', backgroundColor: '#94a3b8' };

function CalloutDot({ num }: { num: string }) {
  return (
    <span
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#1e293b',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 700,
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        flexShrink: 0,
      }}
    >
      {num}
    </span>
  );
}

function SegBtn({
  active,
  onClick,
  children,
  flex = 1,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  flex?: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex,
        padding: '5px 4px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: active ? '#fff' : 'transparent',
        color: active ? '#111827' : '#6b7280',
        fontSize: '11px',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.15s ease',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Steps preview — mirrors Figma geometry 1:1                                */
/* -------------------------------------------------------------------------- */

const CIRCLE_BG = 'var(--atom-background-primary-bg-primary-pressed-brand, #0a2333)';
const CIRCLE_FG = 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)';
const CONNECTOR = 'var(--atom-border-default-border-divider, #cdcbcb)';
const TEXT_COLOR = 'var(--atom-foreground-core-fg-primary, #4b4a4a)';
const CARD_BG = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
const FONT = 'var(--atom-font-body, Poppins, sans-serif)';

function CheckmarkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M10 3L4.5 9L2 6.5"
        stroke={CIRCLE_FG}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepCircle({ index, type }: { index: number; type: StepsType }) {
  return (
    <div
      style={{
        width: '18px',
        height: '18px',
        borderRadius: '999px',
        backgroundColor: CIRCLE_BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {type === 'Icon' ? (
        <CheckmarkIcon />
      ) : (
        <span
          style={{
            fontSize: '10px',
            lineHeight: '12px',
            fontWeight: 500,
            color: CIRCLE_FG,
            fontFamily: FONT,
          }}
        >
          {index + 1}
        </span>
      )}
    </div>
  );
}

function StepsPreview({
  direction,
  count,
  backgroundFill,
  type,
  mini = false,
}: {
  direction: StepsDirection;
  count: StepsCount;
  backgroundFill: boolean;
  type: StepsType;
  /** compact rendering for the variants grid — hides body text + shrinks fonts */
  mini?: boolean;
}) {
  const items = Array.from({ length: count }, () => ({
    title: `Title`,
    body: mini ? '' : 'Body',
  }));

  const titleStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: mini ? '12px' : '14px',
    fontWeight: 500,
    lineHeight: mini ? '16px' : '20px',
    color: TEXT_COLOR,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: mini ? '10px' : '12px',
    fontWeight: 400,
    lineHeight: mini ? '14px' : '18px',
    color: TEXT_COLOR,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const wrapperStyle: React.CSSProperties = backgroundFill
    ? {
        backgroundColor: CARD_BG,
        padding: '16px',
        borderRadius: direction === 'Horizontal' ? '16px' : '8px',
        boxShadow: '0 1px 2px rgba(10, 35, 51, 0.06)',
        width: direction === 'Horizontal' ? '100%' : 'auto',
        boxSizing: 'border-box',
      }
    : {};

  if (direction === 'Horizontal') {
    return (
      <div style={wrapperStyle}>
        <div
          style={{
            display: 'flex',
            width: '100%',
            fontFamily: FONT,
          }}
        >
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minWidth: 0,
                }}
              >
                {/* content-top: circle + dashed connector */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '18px',
                  }}
                >
                  <StepCircle index={i} type={type} />
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      style={{
                        flex: 1,
                        borderTop: `1px dashed ${CONNECTOR}`,
                      }}
                    />
                  )}
                </div>
                {/* content-bottom: title + body */}
                <div
                  style={{
                    paddingRight: isLast ? 0 : '12px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span style={titleStyle}>{item.title}</span>
                  {item.body && <span style={bodyStyle}>{item.body}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical
  return (
    <div style={wrapperStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', fontFamily: FONT }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <div key={i} style={{ display: 'flex', gap: '8px' }}>
              {/* content-left: circle + vertical connector */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0,
                }}
              >
                <StepCircle index={i} type={type} />
                {!isLast && (
                  <div
                    aria-hidden="true"
                    style={{
                      width: 0,
                      flex: 1,
                      minHeight: mini ? '18px' : '28px',
                      borderLeft: `1px dashed ${CONNECTOR}`,
                    }}
                  />
                )}
              </div>
              {/* content-right: title + body */}
              <div
                style={{
                  paddingBottom: isLast ? 0 : '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <span style={titleStyle}>{item.title}</span>
                {item.body && <span style={bodyStyle}>{item.body}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reference data                                                            */
/* -------------------------------------------------------------------------- */

const TOKEN_TABLE_ROWS = [
  { role: 'Step circle background', tokenKey: 'atom.background.primary.bg-primary-pressed-brand', cssVar: '--atom-background-primary-bg-primary-pressed-brand' },
  { role: 'Step number / icon fill', tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse', cssVar: '--atom-foreground-primary-fg-brand-primary-inverse' },
  { role: 'Connector divider (1px dashed)', tokenKey: 'atom.border.default.border-divider', cssVar: '--atom-border-default-border-divider' },
  { role: 'Title / Body text', tokenKey: 'atom.foreground.core.fg-primary', cssVar: '--atom-foreground-core-fg-primary' },
  { role: 'Card surface (Backgroung Fill = On)', tokenKey: 'atom.background.primary.bg-primary-inverse', cssVar: '--atom-background-primary-bg-primary-inverse' },
] as const;

const A11Y_ROWS = [
  {
    icon: '📍',
    title: 'Mark the current step',
    body: 'Apply aria-current="step" to the active step so assistive technologies can announce which step the user is on.',
  },
  {
    icon: '📋',
    title: 'Use ordered list semantics',
    body: 'Wrap the step sequence in role="list" with role="listitem" children so screen readers understand the sequential order.',
  },
  {
    icon: '🏷️',
    title: 'Label every step circle',
    body: 'Each step circle must carry a text alternative — a visible label beside it or an aria-label on the circle itself.',
  },
  {
    icon: '📢',
    title: 'Announce progress changes',
    body: 'When the current step advances, use an aria-live="polite" region so progress updates are spoken without hijacking focus.',
  },
  {
    icon: '🎨',
    title: 'Meet contrast targets',
    body: 'Step circle fill against its background, and number/icon fill against the circle, must both clear the 4.5:1 contrast ratio across every brand.',
  },
  {
    icon: '⌨️',
    title: 'Keep focus operable when interactive',
    body: 'If step labels link back to completed stages, each must be reachable by Tab and activate on Enter / Space.',
  },
];

const USAGE_ROWS = [
  {
    title: 'Horizontal',
    body: 'Use across the top of a page for multi-step flows with 2–5 stages — onboarding, checkout, setup wizards — where there is enough horizontal space for the labels.',
  },
  {
    title: 'Vertical',
    body: 'Use inside a narrow column or sidebar. Ideal for longer processes (up to 8 steps), timeline-style displays, or when each step needs a descriptive body text.',
  },
  {
    title: 'Backgroung Fill = On',
    body: 'Adds a white card around the step sequence with 16px padding (16px radius horizontal, 8px radius vertical). Use when the surrounding surface is tinted or visually busy.',
  },
  {
    title: 'Type = Icon',
    body: 'Replaces numeric labels with a 12×12 checkmark. Use when the sequence reads more as a checklist than a numbered progression.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export function StepsPage({ brand }: StepsPageProps) {
  const [direction, setDirection] = useState<StepsDirection>('Horizontal');
  const [count, setCount] = useState<StepsCount>(5);
  const [backgroundFill, setBackgroundFill] = useState(false);
  const [type, setType] = useState<StepsType>('Number');

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const previewKey = `${direction}|${count}|${backgroundFill ? 'On' : 'Off'}|${type}`;

  return (
    <div className="space-y-10">

      {/* -- 1. INTERACTIVE PREVIEW -------------------------------------- */}
      <section>
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          <div style={{ display: 'flex', minHeight: '360px' }}>
            {/* Canvas */}
            <div
              style={{
                flex: 1,
                ...DOTTED_BG,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 40px',
                overflow: 'auto',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    width: direction === 'Horizontal' ? '100%' : 'auto',
                    maxWidth: direction === 'Horizontal' ? '640px' : '360px',
                    minWidth: direction === 'Vertical' ? '320px' : undefined,
                  }}
                >
                  <StepsPreview
                    direction={direction}
                    count={count}
                    backgroundFill={backgroundFill}
                    type={type}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div
              style={{
                width: '240px',
                flexShrink: 0,
                borderLeft: '1px solid #e5e7eb',
                backgroundColor: '#fff',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              <div>
                <p style={LABEL_STYLE}>Direction</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {DIRECTIONS.map((d) => (
                    <SegBtn key={d} active={direction === d} onClick={() => setDirection(d)}>
                      {d}
                    </SegBtn>
                  ))}
                </div>
              </div>

              <div>
                <p style={LABEL_STYLE}>Count</p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {COUNTS.map((n) => (
                    <SegBtn key={n} active={count === n} onClick={() => setCount(n)}>
                      {n}
                    </SegBtn>
                  ))}
                </div>
              </div>

              <div>
                <p style={LABEL_STYLE}>Backgroung Fill</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {FILLS.map((f) => (
                    <SegBtn
                      key={f}
                      active={backgroundFill === (f === 'On')}
                      onClick={() => setBackgroundFill(f === 'On')}
                    >
                      {f}
                    </SegBtn>
                  ))}
                </div>
              </div>

              <div>
                <p style={LABEL_STYLE}>Type</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {TYPES.map((t) => (
                    <SegBtn key={t} active={type === t} onClick={() => setType(t)}>
                      {t}
                    </SegBtn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- 2. COMPONENT INFO ------------------------------------------- */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
          Steps
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: '#6b7280',
            lineHeight: 1.6,
            margin: '0 0 16px',
            maxWidth: '640px',
          }}
        >
          Represents a series of sequential stages in a process. Use for onboarding,
          checkout, or setup workflows where progress tracking is useful.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <a
            href="#"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              fontSize: '13px',
              color: '#374151',
              textDecoration: 'none',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              backgroundColor: '#fff',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Feedback
          </a>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #bbf7d0',
              fontSize: '13px',
              color: '#166534',
              backgroundColor: '#f0fdf4',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                display: 'inline-block',
              }}
            />
            Stable
          </span>
        </div>
      </section>

      {/* -- 3. ANATOMY -------------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Anatomy</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>
          Each step exposes three visual parts, plus an optional surrounding card.
        </p>

        <div
          style={{
            ...DOTTED_BG,
            borderRadius: '12px',
            padding: '56px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minHeight: '220px',
          }}
        >
          <div style={{ width: '320px' }}>
            <StepsPreview direction="Horizontal" count={3} backgroundFill={false} type="Number" />
          </div>

          {/* 1 — Step circle (above step-1) */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: 'calc(50% - 104px)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CalloutDot num="1" />
            <div style={LINE} />
          </div>
          {/* 2 — Connector */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CalloutDot num="2" />
            <div style={LINE} />
          </div>
          {/* 3 — Label pair (bottom) */}
          <div
            style={{
              position: 'absolute',
              bottom: '18px',
              left: 'calc(50% + 48px)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={LINE} />
            <CalloutDot num="3" />
          </div>
        </div>

        <div
          style={{
            marginTop: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
          }}
        >
          {[
            {
              num: '1',
              label: 'Step circle',
              desc: '18 × 18 circle (999 radius). Fills with brand-primary-pressed-brand. Contains either a 10px Medium numeric label (Type = Number) or a 12 × 12 checkmark (Type = Icon).',
            },
            {
              num: '2',
              label: 'Connector',
              desc: '1px dashed line between adjacent circles using the divider border token. 4px gap on the circle side; stretches to fill available space.',
            },
            {
              num: '3',
              label: 'Label pair',
              desc: 'Title at 14px Medium (20px line-height) and optional Body at 12px Regular (18px line-height), both in fg-primary. 12px trailing padding keeps labels clear of the next step.',
            },
          ].map(({ num, label, desc }) => (
            <div
              key={num}
              style={{
                display: 'flex',
                gap: '10px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                border: '1px solid #f3f4f6',
              }}
            >
              <span
                style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}
              >
                {num}
              </span>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                  {label}
                </p>
                <p
                  style={{
                    margin: '3px 0 0',
                    fontSize: '12px',
                    color: '#6b7280',
                    lineHeight: 1.4,
                  }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -- 4. VARIANTS ------------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Variants</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Four variant properties combine to 36 concrete variants in Figma.
        </p>

        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    width: '160px',
                  }}
                >
                  Property
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  Values
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    width: '120px',
                  }}
                >
                  Default
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { prop: 'Direction', values: 'Horizontal · Vertical', def: 'Horizontal' },
                { prop: 'Count', values: '2 · 3 · 4 · 5 · 6 · 7 · 8', def: '5' },
                { prop: 'Backgroung Fill', values: 'Off · On', def: 'Off' },
                { prop: 'Type', values: 'Number · Icon', def: 'Number' },
              ].map(({ prop, values, def }, i) => (
                <tr
                  key={prop}
                  style={{ borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}
                >
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>
                    {prop}
                  </td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{values}</td>
                  <td style={{ padding: '10px 16px', color: '#374151' }}>
                    <code
                      style={{
                        fontSize: '11px',
                        backgroundColor: '#f3f4f6',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: '#6b7280',
                      }}
                    >
                      {def}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview grid — 6 representative variants */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}
        >
          {[
            { d: 'Horizontal' as const, c: 3 as StepsCount, f: false, t: 'Number' as const, label: 'Horizontal · 3 · Off · Number' },
            { d: 'Horizontal' as const, c: 3 as StepsCount, f: false, t: 'Icon' as const, label: 'Horizontal · 3 · Off · Icon' },
            { d: 'Horizontal' as const, c: 5 as StepsCount, f: true, t: 'Number' as const, label: 'Horizontal · 5 · On · Number' },
            { d: 'Vertical' as const, c: 3 as StepsCount, f: false, t: 'Number' as const, label: 'Vertical · 3 · Off · Number' },
            { d: 'Vertical' as const, c: 4 as StepsCount, f: true, t: 'Icon' as const, label: 'Vertical · 4 · On · Icon' },
            { d: 'Vertical' as const, c: 5 as StepsCount, f: false, t: 'Number' as const, label: 'Vertical · 5 · Off · Number' },
          ].map(({ d, c, f, t, label }, i) => (
            <div
              key={i}
              style={{
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minHeight: '160px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#6b7280',
                  letterSpacing: '0.02em',
                }}
              >
                {label}
              </p>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <StepsPreview direction={d} count={c} backgroundFill={f} type={t} mini />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -- 5. DESIGN TOKENS -------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Design Tokens</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Tokens used by the Steps component. Swatches repaint to match the active brand.
        </p>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    width: '220px',
                  }}
                >
                  Role
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  Token
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    width: '100px',
                  }}
                >
                  Value
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    width: '52px',
                  }}
                >
                  Swatch
                </th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const resolvedValue =
                  tokens[row.tokenKey as keyof typeof tokens] ?? '\u2014';
                return (
                  <tr
                    key={row.role}
                    style={{
                      borderBottom:
                        i < TOKEN_TABLE_ROWS.length - 1 ? '1px solid #f3f4f6' : 'none',
                      borderLeft: '3px solid #3b82f6',
                    }}
                  >
                    <td
                      style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}
                    >
                      {row.role}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <code
                        style={{
                          fontSize: '11px',
                          backgroundColor: '#f3f4f6',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          color: '#6b7280',
                        }}
                      >
                        {row.cssVar}
                      </code>
                    </td>
                    <td
                      style={{
                        padding: '10px 16px',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#6b7280',
                      }}
                    >
                      {resolvedValue.slice(0, 9)}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      {(resolvedValue.startsWith('#') || resolvedValue.startsWith('rgb')) && (
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            backgroundColor: resolvedValue,
                            border: '1px solid rgba(0,0,0,0.08)',
                          }}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* -- 6. ACCESSIBILITY ------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Accessibility</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          Guidance for implementing inclusive progress sequences.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {A11Y_ROWS.map(({ icon, title, body }) => (
            <div
              key={title}
              style={{
                display: 'flex',
                gap: '14px',
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>
                {icon}
              </span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                  {title}
                </p>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '13px',
                    color: '#6b7280',
                    lineHeight: 1.5,
                  }}
                >
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -- 7. USAGE ---------------------------------------------------- */}
      <section style={{ paddingBottom: '40px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Usage</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          When to reach for each variant property.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '16px',
          }}
        >
          {USAGE_ROWS.map(({ title, body }) => (
            <div
              key={title}
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: '#fafafa',
              }}
            >
              <p
                style={{
                  margin: '0 0 4px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                {title}
              </p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7280', lineHeight: 1.5 }}>
                {body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid #bbf7d0',
              backgroundColor: '#f0fdf4',
            }}
          >
            <p
              style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}
            >
              Do
            </p>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                fontSize: '12.5px',
                color: '#15803d',
                lineHeight: 1.5,
              }}
            >
              <li style={{ marginBottom: '6px' }}>
                Use Steps to show clear progress through a defined, sequential workflow
              </li>
              <li style={{ marginBottom: '6px' }}>
                Keep Titles short (one or two words) so horizontal layouts don't wrap
              </li>
              <li>
                Switch to Vertical direction on narrow viewports rather than truncating labels
              </li>
            </ul>
          </div>
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid #fecaca',
              backgroundColor: '#fef2f2',
            }}
          >
            <p
              style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}
            >
              Don't
            </p>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                fontSize: '12.5px',
                color: '#b91c1c',
                lineHeight: 1.5,
              }}
            >
              <li style={{ marginBottom: '6px' }}>
                Don't use Steps for non-sequential navigation — use Tabs instead
              </li>
              <li style={{ marginBottom: '6px' }}>
                Don't exceed 8 steps — break longer processes into grouped stages
              </li>
              <li>
                Don't rely on the circle fill alone to indicate progress — pair it with a Title
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
