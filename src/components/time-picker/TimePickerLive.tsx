import { type Brand } from '../../data/tokens';

export type TimePickerStyle = 'Vertical' | 'Grid' | 'Scrollable';

interface TimePickerLiveProps {
  style?: TimePickerStyle;
  showButton?: boolean;
  brand?: Brand;
}

function Column({
  values,
  selected,
  label,
  fg,
  selectedBg,
  selectedFg,
  mutedFg,
  fontFamily,
}: {
  values: string[];
  selected: string;
  label: string;
  fg: string;
  selectedBg: string;
  selectedFg: string;
  mutedFg: string;
  fontFamily: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <span
        style={{
          fontSize: '10px',
          fontWeight: 600,
          color: mutedFg,
          marginBottom: '6px',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <div
        style={{
          height: '120px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          width: '100%',
          alignItems: 'center',
          scrollbarWidth: 'none',
        }}
      >
        {values.map((v) => {
          const isActive = v === selected;
          return (
            <button
              key={v}
              type="button"
              style={{
                width: '44px',
                padding: '6px 0',
                fontFamily,
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? selectedFg : fg,
                backgroundColor: isActive ? selectedBg : 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TimePickerLive({
  style = 'Vertical',
  showButton = true,
  brand: _brand = 'dragonpass',
}: TimePickerLiveProps) {
  const fontFamily = 'var(--atom-font-body, Poppins, sans-serif)';
  const fgColor = 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)';
  const mutedFg = 'var(--atom-foreground-core-fg-secondary, #737272)';
  const borderColor = 'var(--atom-border-default-border-default, #cdcbcb)';
  const bgColor = 'var(--atom-background-primary-bg-primary-inverse, #ffffff)';
  const selectedBg = 'var(--atom-background-primary-bg-primary-pressed-brand, #0a2333)';
  const selectedFg = 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)';
  const btnBg = 'var(--atom-background-primary-bg-brand-primary, #0a2333)';
  const btnFg = 'var(--atom-foreground-primary-fg-brand-primary-inverse, #ffffff)';

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

  if (style === 'Vertical') {
    return (
      <div
        style={{
          fontFamily,
          width: '240px',
          padding: '14px',
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          boxShadow: '0 6px 20px rgba(10,35,51,0.1), 0 2px 6px rgba(10,35,51,0.06)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <Column values={hours} selected="1" label="HR" fg={fgColor} selectedBg={selectedBg} selectedFg={selectedFg} mutedFg={mutedFg} fontFamily={fontFamily} />
          <Column values={minutes} selected="00" label="MIN" fg={fgColor} selectedBg={selectedBg} selectedFg={selectedFg} mutedFg={mutedFg} fontFamily={fontFamily} />
          <Column values={['AM', 'PM']} selected="AM" label="AM/PM" fg={fgColor} selectedBg={selectedBg} selectedFg={selectedFg} mutedFg={mutedFg} fontFamily={fontFamily} />
        </div>
        {showButton && (
          <button
            type="button"
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: btnBg,
              color: btnFg,
              border: 'none',
              borderRadius: '8px',
              fontFamily,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Confirm
          </button>
        )}
      </div>
    );
  }

  if (style === 'Grid') {
    const slots = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];
    return (
      <div
        style={{
          fontFamily,
          width: '260px',
          padding: '14px',
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          boxShadow: '0 6px 20px rgba(10,35,51,0.1), 0 2px 6px rgba(10,35,51,0.06)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {slots.map((slot, idx) => (
            <button
              key={slot}
              type="button"
              style={{
                padding: '8px 12px',
                fontFamily,
                fontSize: '13px',
                fontWeight: idx === 2 ? 600 : 400,
                color: idx === 2 ? selectedFg : fgColor,
                backgroundColor: idx === 2 ? selectedBg : 'transparent',
                border: `1px solid ${idx === 2 ? selectedBg : borderColor}`,
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {slot}
            </button>
          ))}
        </div>
        {showButton && (
          <button
            type="button"
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: btnBg,
              color: btnFg,
              border: 'none',
              borderRadius: '8px',
              fontFamily,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Confirm
          </button>
        )}
      </div>
    );
  }

  // Scrollable style
  const scrollSlots = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30'];
  return (
    <div
      style={{
        fontFamily,
        width: '280px',
        padding: '14px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(10,35,51,0.1), 0 2px 6px rgba(10,35,51,0.06)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
        }}
      >
        {scrollSlots.map((slot, idx) => (
          <button
            key={slot}
            type="button"
            style={{
              padding: '8px 14px',
              fontFamily,
              fontSize: '13px',
              fontWeight: idx === 2 ? 600 : 400,
              color: idx === 2 ? selectedFg : fgColor,
              backgroundColor: idx === 2 ? selectedBg : 'transparent',
              border: `1px solid ${idx === 2 ? selectedBg : borderColor}`,
              borderRadius: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {slot}
          </button>
        ))}
      </div>
      {showButton && (
        <button
          type="button"
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '8px 16px',
            backgroundColor: btnBg,
            color: btnFg,
            border: 'none',
            borderRadius: '8px',
            fontFamily,
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Confirm
        </button>
      )}
    </div>
  );
}
