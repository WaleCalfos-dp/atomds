import { type Brand } from '../../data/tokens';

export type TabsStyle = 'Underlined' | 'Plain' | 'Circular on Light' | 'Circular on Dark';
export type TabCount = 2 | 3 | 4 | 5 | 6 | 7;

interface TabsLiveProps {
  tabStyle?: TabsStyle;
  count?: TabCount;
  activeIndex?: number;
  labels?: string[];
  brand?: Brand;
}

const DEFAULT_LABELS = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5', 'Tab 6', 'Tab 7'];

export function TabsLive({
  tabStyle = 'Underlined',
  count = 3,
  activeIndex = 0,
  labels = DEFAULT_LABELS,
  brand: _brand = 'dragonpass',
}: TabsLiveProps) {
  const visibleLabels = labels.slice(0, count);
  const clampedActive = Math.min(activeIndex, count - 1);

  const fontFamily = 'var(--atom-font-body, Poppins, sans-serif)';

  /* ---------- Circular on Dark ---------- */
  if (tabStyle === 'Circular on Dark') {
    return (
      <div
        role="tablist"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '48px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '999px',
          padding: '4px',
          gap: '4px',
          fontFamily,
        }}
      >
        {visibleLabels.map((label, i) => {
          const isActive = i === clampedActive;
          return (
            <div
              key={i}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                borderRadius: '999px',
                padding: '12px 16px',
                backgroundColor: isActive
                  ? 'var(--atom-background-primary-bg-primary-inverse, white)'
                  : 'transparent',
                color: isActive
                  ? 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)'
                  : 'white',
                fontSize: '14px',
                fontWeight: isActive ? 500 : 400,
                fontFamily,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                userSelect: 'none',
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    );
  }

  /* ---------- Circular on Light ---------- */
  if (tabStyle === 'Circular on Light') {
    return (
      <div
        role="tablist"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '48px',
          backgroundColor: 'var(--atom-background-core-bg-muted, rgba(10,35,51,0.04))',
          borderRadius: '999px',
          padding: '4px',
          gap: '4px',
          fontFamily,
        }}
      >
        {visibleLabels.map((label, i) => {
          const isActive = i === clampedActive;
          return (
            <div
              key={i}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                borderRadius: '999px',
                padding: '12px 16px',
                backgroundColor: isActive
                  ? 'var(--atom-background-primary-bg-primary-default, #0a2333)'
                  : 'transparent',
                color: isActive
                  ? 'var(--atom-foreground-primary-fg-brand-primary-inverse, white)'
                  : 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)',
                fontSize: '14px',
                fontWeight: isActive ? 500 : 400,
                fontFamily,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                userSelect: 'none',
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    );
  }

  /* ---------- Plain ---------- */
  if (tabStyle === 'Plain') {
    return (
      <div style={{ position: 'relative', fontFamily }}>
        <div
          role="tablist"
          style={{
            display: 'flex',
            alignItems: 'stretch',
            height: '48px',
            gap: 'var(--atom-space-comfortable, 16px)',
          }}
        >
          {visibleLabels.map((label, i) => {
            const isActive = i === clampedActive;
            return (
              <div
                key={i}
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  color: isActive
                    ? 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)'
                    : 'var(--atom-foreground-core-fg-primary, #4b4a4a)',
                  fontSize: '14px',
                  fontWeight: isActive ? 500 : 400,
                  fontFamily,
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                  userSelect: 'none',
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------- Underlined (default) ---------- */
  return (
    <div style={{ position: 'relative', fontFamily }}>
      <div
        role="tablist"
        style={{
          display: 'flex',
          alignItems: 'stretch',
          height: '48px',
          gap: 'var(--atom-space-comfortable, 16px)',
          borderBottom: '1px solid var(--atom-border-default-border-default, #cdcbcb)',
        }}
      >
        {visibleLabels.map((label, i) => {
          const isActive = i === clampedActive;
          return (
            <div
              key={i}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '0 4px',
                color: isActive
                  ? 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)'
                  : 'var(--atom-foreground-core-fg-primary, #4b4a4a)',
                fontSize: '14px',
                fontWeight: isActive ? 500 : 400,
                fontFamily,
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                userSelect: 'none',
                borderBottom: isActive
                  ? '1px solid var(--atom-border-selection-and-focus-border-selected, #0a2333)'
                  : '1px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
