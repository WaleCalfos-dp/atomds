import { type Brand } from '../../data/tokens';

export type StepsOrientation = 'Horizontal' | 'Vertical';

interface StepsLiveProps {
  totalSteps?: number;
  currentStep?: number;
  orientation?: StepsOrientation;
  labels?: string[];
  bodyTexts?: string[];
  brand?: Brand;
}

function CheckmarkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M10 3L4.5 9L2 6.5"
        stroke="var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StepsLive({
  totalSteps = 3,
  currentStep = 1,
  orientation = 'Horizontal',
  labels,
  bodyTexts,
  brand: _brand = 'dragonpass',
}: StepsLiveProps) {
  const clamped = Math.max(2, Math.min(8, totalSteps));
  const active = Math.max(1, Math.min(clamped, currentStep));
  const isHorizontal = orientation === 'Horizontal';

  const defaultLabels = Array.from({ length: clamped }, (_, i) => `Step ${i + 1}`);
  const stepLabels = labels && labels.length >= clamped ? labels : defaultLabels;

  const defaultBodies = Array.from({ length: clamped }, () => '');
  const stepBodies = bodyTexts && bodyTexts.length >= clamped ? bodyTexts : defaultBodies;

  const circleBgActive = 'var(--atom-background-primary-bg-primary-pressed-brand, #0a2333)';
  const circleBgUpcoming = 'var(--atom-background-primary-bg-primary-disabled, #ebe9e8)';
  const numberActive = 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)';
  const numberUpcoming = 'var(--atom-foreground-states-fg-disabled-inverse, #ffffff)';
  const connectorColor = 'var(--atom-border-default-border-divider, #cdcbcb)';
  const labelColor = 'var(--atom-foreground-core-fg-primary, #4b4a4a)';

  const steps = Array.from({ length: clamped }, (_, i) => {
    const stepNum = i + 1;
    const isCompleted = stepNum < active;
    const isActive = stepNum === active;
    return { stepNum, isCompleted, isActive, label: stepLabels[i], body: stepBodies[i] };
  });

  return (
    <div
      role="list"
      aria-label="Progress steps"
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        alignItems: 'flex-start',
        gap: '0px',
        fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
      }}
    >
      {steps.map(({ stepNum, isCompleted, isActive, label, body }, idx) => {
        const showConnector = idx < steps.length - 1;

        return (
          <div
            key={stepNum}
            role="listitem"
            aria-current={isActive ? 'step' : undefined}
            style={{
              display: 'flex',
              flexDirection: isHorizontal ? 'column' : 'row',
              alignItems: isHorizontal ? 'center' : 'flex-start',
              flex: isHorizontal && showConnector ? 1 : undefined,
            }}
          >
            {/* Circle + connector row */}
            <div
              style={{
                display: 'flex',
                flexDirection: isHorizontal ? 'row' : 'column',
                alignItems: 'center',
                width: isHorizontal ? '100%' : undefined,
              }}
            >
              {/* Step circle */}
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  backgroundColor: isCompleted || isActive
                    ? circleBgActive
                    : circleBgUpcoming,
                  transition: 'background-color 0.2s ease',
                }}
              >
                {isCompleted ? (
                  <CheckmarkIcon />
                ) : (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      color: isCompleted || isActive ? numberActive : numberUpcoming,
                      lineHeight: 1,
                    }}
                  >
                    {stepNum}
                  </span>
                )}
              </div>

              {/* Connector line - dashed */}
              {showConnector && (
                <div
                  aria-hidden="true"
                  style={
                    isHorizontal
                      ? {
                          flex: 1,
                          height: '0px',
                          minWidth: '24px',
                          margin: '0 4px',
                          borderTop: `1px dashed ${connectorColor}`,
                          transition: 'border-color 0.2s ease',
                        }
                      : {
                          width: '0px',
                          height: '32px',
                          marginLeft: '9px',
                          borderLeft: `1px dashed ${connectorColor}`,
                          transition: 'border-color 0.2s ease',
                        }
                  }
                />
              )}
            </div>

            {/* Labels: Title + Body */}
            <div
              style={{
                marginTop: isHorizontal ? '6px' : '0',
                marginLeft: isHorizontal ? '0' : '10px',
                paddingTop: isHorizontal ? '0' : '0',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: labelColor,
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease',
                  userSelect: 'none',
                  fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
                }}
              >
                {label}
              </span>
              {body && (
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: labelColor,
                    lineHeight: 1.4,
                    transition: 'color 0.2s ease',
                    userSelect: 'none',
                    fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
                  }}
                >
                  {body}
                </span>
              )}
            </div>

            {/* Vertical layout: bottom divider between steps */}
            {!isHorizontal && showConnector && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  display: 'none',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
