import { useState } from 'react';

export function HowItWorks() {
  const [open, setOpen] = useState(true);

  return (
    <div className="mt-8 border border-slate-200 rounded-lg bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-slate-50 transition-colors rounded-t-lg"
      >
        <span className="text-sm font-semibold text-slate-900">How does this work?</span>
        <Caret open={open} />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 space-y-4 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            A dev gives 6 hex codes; the design system rethemes every component. Here is what
            happens in between.
          </p>

          <div className="space-y-4">
            <Step
              num={1}
              title="You give 6 hex codes"
              body={
                <>
                  One per colour family: <strong>Primary</strong>, <strong>Secondary</strong>,{' '}
                  <strong>Neutral</strong>, <strong>Success</strong>, <strong>Warning</strong>,{' '}
                  <strong>Error</strong>. Pick the brand's <em>main</em> version of each — not the
                  lightest or darkest. Primary is the brand's signature interactive colour (the
                  one your primary button is); Neutral is a mid grey for text and chrome; the rest
                  are feedback colours.
                </>
              }
            />

            <Step
              num={2}
              title="Each seed becomes a 10-shade ramp"
              body={
                <>
                  The system generates 10 shades for each seed, from <code>50</code> (very light)
                  to <code>900</code> (very dark). Lightness is fixed across brands — a Primary{' '}
                  <code>100</code> is always equally light, whether your seed is dragonpass blue
                  or your new brand's violet. Only the hue changes.
                </>
              }
            />

            <Step
              num={3}
              title="Info and Tertiary come free"
              body={
                <>
                  <code>Info</code> reuses your Primary ramp; <code>Tertiary</code> reuses
                  Secondary — no extra seeds needed. The system also builds 8 semi-transparent
                  overlays (for hover tints, focus rings, modal scrims) from your darkest Primary
                  shade.
                </>
              }
            />

            <Step
              num={4}
              title="67 design tokens fill in automatically"
              body={
                <>
                  Every component reads from a fixed set of 67 tokens (
                  <code>bg-primary-default</code>, <code>fg-success</code>,{' '}
                  <code>border-divider</code>, etc.). The mapping is the same for every brand —
                  Button always reads <code>Primary.900</code> as its primary background; Alert
                  Success always reads <code>Success.100</code> as its light surface. You don't
                  choose which colour drives which token; the system does.
                </>
              }
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-sm text-slate-700">
            <strong>Net result:</strong> 6 hex codes in → 67 themed CSS variables out → every
            component rethemes via the cascade. No per-component code changes.
          </div>
        </div>
      )}
    </div>
  );
}

function Step({ num, title, body }: { num: number; title: string; body: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-semibold flex items-center justify-center">
        {num}
      </span>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 mb-1">{title}</h4>
        <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className="text-slate-400 flex-shrink-0"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}
    >
      <path
        d="M3 1.5l4 3.5-4 3.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
