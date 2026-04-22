import { type Brand } from '../../data/tokens';

export type StepperDirection = 'Horizontal' | 'Vertical';
export type StepperType = 'Number' | 'Icon';

export interface StepperItem {
  title: string;
  description?: string;
}

interface StepperLiveProps {
  direction?: StepperDirection;
  stepperType?: StepperType;
  items?: StepperItem[];
  /** 1-indexed current step */
  current?: number;
  brand?: Brand;
}

const DEFAULT_ITEMS: StepperItem[] = [
  { title: 'Account details', description: 'Enter your information' },
  { title: 'Payment method', description: 'Add a card or bank' },
  { title: 'Review order', description: 'Confirm and pay' },
];

function CheckIcon({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.2l3 3 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StepperLive({
  direction = 'Horizontal',
  stepperType = 'Number',
  items = DEFAULT_ITEMS,
  current = 2,
  brand: _brand = 'dragonpass',
}: StepperLiveProps) {
  const fontFamily = 'var(--atom-font-body, Poppins, sans-serif)';
  const titleColor = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const subtitleColor = 'var(--atom-foreground-core-fg-secondary, #737272)';
  const mutedBg = 'var(--atom-background-core-bg-muted, #f5f5f4)';
  const mutedBorder = 'var(--atom-border-default-border-default, #cdcbcb)';
  const activeBg = 'var(--atom-background-primary-bg-primary-pressed-brand, #0a2333)';
  const activeFg = 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)';
  const connectorActive = 'var(--atom-background-primary-bg-primary-pressed-brand, #0a2333)';
  const connectorInactive = 'var(--atom-border-default-border-default, #cdcbcb)';

  const indicator = (idx: number, done: boolean, active: boolean) => {
    const dotSize = stepperType === 'Icon' ? '28px' : '28px';
    return (
      <div
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '999px',
          backgroundColor: done || active ? activeBg : mutedBg,
          border: `1.5px solid ${done || active ? activeBg : mutedBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: activeFg,
          fontFamily,
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        {stepperType === 'Number' ? (
          done ? <CheckIcon color={activeFg} /> : <span>{idx + 1}</span>
        ) : (
          done ? <CheckIcon color={activeFg} /> : <CheckIcon color={done || active ? activeFg : mutedBorder} />
        )}
      </div>
    );
  };

  if (direction === 'Horizontal') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          fontFamily,
          width: '100%',
          maxWidth: '560px',
        }}
      >
        {items.map((item, idx) => {
          const stepNum = idx + 1;
          const done = stepNum < current;
          const active = stepNum === current;
          const isLast = idx === items.length - 1;
          return (
            <div
              key={idx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {idx > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: '50%',
                      top: '50%',
                      height: '2px',
                      backgroundColor: done || active ? connectorActive : connectorInactive,
                      transform: 'translateY(-50%)',
                      marginRight: '16px',
                    }}
                  />
                )}
                {!isLast && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      right: 0,
                      top: '50%',
                      height: '2px',
                      backgroundColor: done ? connectorActive : connectorInactive,
                      transform: 'translateY(-50%)',
                      marginLeft: '16px',
                    }}
                  />
                )}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {indicator(idx, done, active)}
                </div>
              </div>
              <div style={{ marginTop: '8px', textAlign: 'center', padding: '0 4px' }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: done || active ? titleColor : subtitleColor,
                  }}
                >
                  {item.title}
                </div>
                {item.description && (
                  <div style={{ fontSize: '11px', color: subtitleColor, marginTop: '2px' }}>
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical
  return (
    <div style={{ fontFamily, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '320px' }}>
      {items.map((item, idx) => {
        const stepNum = idx + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} style={{ display: 'flex', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              {indicator(idx, done, active)}
              {!isLast && (
                <div
                  style={{
                    width: '2px',
                    flex: 1,
                    minHeight: '28px',
                    backgroundColor: done ? connectorActive : connectorInactive,
                    marginTop: '4px',
                    marginBottom: '4px',
                  }}
                />
              )}
            </div>
            <div style={{ paddingBottom: isLast ? 0 : '16px', flex: 1 }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: done || active ? titleColor : subtitleColor,
                  lineHeight: 1.4,
                }}
              >
                {item.title}
              </div>
              {item.description && (
                <div style={{ fontSize: '12px', color: subtitleColor, marginTop: '2px', lineHeight: 1.5 }}>
                  {item.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
