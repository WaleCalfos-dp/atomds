import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckboxLive, type CheckboxType, type CheckboxState } from '../components/checkbox/CheckboxLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface CheckboxPageProps {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    typeLabel: 'Type',
    stateLabel: 'State',
    checkedLabel: 'Checked',
    labelLabel: 'Label',
    trueLabel: 'True',
    falseLabel: 'False',
    initialLabel: 'Checkbox label',
    title: 'Checkbox',
    description:
      'Allows users to make one or multiple selections from a list of options. Three variants — multi-select checkbox, single-select checkbox, and radio button — share the same token set.',
    pillFeedback: 'Feedback',
    pillStable: 'Stable',
    anatomyTitle: 'Anatomy',
    anatomyLead: 'Parts of the Checkbox component and their roles.',
    anatomyDemoLabel: 'Label',
    anatomyParts: [
      { num: '1', label: 'Container', desc: '20×20px hit area. Shape changes per type: rounded square (multi), circle (single/radio).' },
      { num: '2', label: 'Check indicator', desc: 'White checkmark (checkbox) or filled inner dot (radio) appears when checked.' },
      { num: '3', label: 'Label', desc: 'Visible text associated with the control via <label>. Required for accessibility.' },
    ],
    variantsTitle: 'Variants',
    colProperty: 'Property',
    colValues: 'Values',
    variantRows: [
      { prop: 'Type', values: 'Multi Checkbox · Single Checkbox · Radio Button' },
      { prop: 'State', values: 'Default · Disabled' },
      { prop: 'Checked', values: 'True · False' },
    ],
    checkedText: 'Checked',
    uncheckedText: 'Unchecked',
    tokensTitle: 'Design Tokens',
    tokensLead:
      'Active tokens for the current selection are highlighted. Use the controls above to inspect other states.',
    colRole: 'Role',
    colToken: 'Token',
    colValue: 'Value',
    colSwatch: 'Swatch',
    tokenRows: [
      {
        key: 'unchecked-border',
        tokenKey: 'atom.border.default.border-default',
        label: 'Unchecked border',
        cssVar: '--atom-border-default-border-default',
      },
      {
        key: 'checked-bg',
        tokenKey: 'atom.background.primary.bg-primary-pressed',
        label: 'Checked bg',
        cssVar: '--atom-background-primary-bg-primary-pressed',
      },
      {
        key: 'checked-icon',
        tokenKey: 'atom.foreground.states.fg-pressed-inverse',
        label: 'Checked icon',
        cssVar: '--atom-foreground-states-fg-pressed-inverse',
      },
      {
        key: 'radio-border',
        tokenKey: 'atom.border.default.border-default-brand',
        label: 'Radio checked border',
        cssVar: '--atom-border-default-border-default-brand',
      },
      {
        key: 'radio-inner',
        tokenKey: 'atom.background.primary.bg-primary-pressed',
        label: 'Radio inner dot',
        cssVar: '--atom-background-primary-bg-primary-pressed',
      },
      {
        key: 'disabled-border',
        tokenKey: 'atom.border.states.border-disabled',
        label: 'Disabled border',
        cssVar: '--atom-border-states-border-disabled',
      },
      {
        key: 'disabled-bg',
        tokenKey: 'atom.background.primary.bg-primary-disabled',
        label: 'Disabled checked bg',
        cssVar: '--atom-background-primary-bg-primary-disabled',
      },
      {
        key: 'disabled-inner',
        tokenKey: 'atom.foreground.states.fg-disabled',
        label: 'Disabled radio inner',
        cssVar: '--atom-foreground-states-fg-disabled',
      },
    ],
    a11yTitle: 'Accessibility',
    a11yLead: 'Guidance for building inclusive experiences with Checkbox and Radio components.',
    a11yRows: [
      {
        icon: '⌨️',
        title: 'Keyboard interaction',
        body: 'Space toggles a checkbox. Tab moves focus between controls. Arrow keys cycle between radio buttons in a group — do not use Tab for radio group navigation.',
      },
      {
        icon: '🔖',
        title: 'ARIA roles',
        body: 'Use native <input type="checkbox"> and <input type="radio"> elements. Never replicate these with <div role="checkbox"> unless you fully implement keyboard, focus, and ARIA state management.',
      },
      {
        icon: '🏷️',
        title: 'Labels',
        body: 'Every control must have a visible label via <label> wrapping or aria-labelledby. Screen readers announce the label and checked state together — unlabelled checkboxes are unusable.',
      },
      {
        icon: '🚫',
        title: 'Disabled state',
        body: 'Use the disabled attribute on the input element — not just opacity. Disabled inputs are announced as "dimmed" or "unavailable" by screen readers and are correctly skipped in Tab order.',
      },
      {
        icon: '📦',
        title: 'Radio groups',
        body: 'Wrap related radio buttons in a <fieldset> with a <legend> describing the group question. This gives screen reader users context about what each option is answering.',
      },
    ],
    usageTitle: 'Usage',
    usageLead: 'When and how to use each Checkbox variant.',
    usageVariantRows: [
      { t: 'Multi Checkbox', when: 'Use when the user can select any number of options independently. Each checkbox is fully independent — selecting one does not affect others.' },
      { t: 'Single Checkbox', when: 'Use for a single binary choice, such as accepting terms or enabling a setting. The circular shape visually distinguishes it as a one-off toggle.' },
      { t: 'Radio Button', when: 'Use when only one option can be selected from a group. Always offer at least two options and pre-select the most common or safe default.' },
    ],
    doTitle: '✓ Do',
    doBody:
      'Always pair a visible label with each control. Group related radio buttons in a fieldset with a legend describing the question.',
    dontTitle: "✗ Don't",
    dontBody:
      "Don't use radio buttons when multiple selections are valid — use checkboxes instead. Don't use a single radio button; that implies an uncheckable selection.",
  },
  zh: {
    typeLabel: '类型',
    stateLabel: '状态',
    checkedLabel: '已勾选',
    labelLabel: '标签',
    trueLabel: '是',
    falseLabel: '否',
    initialLabel: '复选框标签',
    title: '复选框',
    description:
      '允许用户从选项列表中进行单选或多选。三种变体——多选复选框、单选复选框和单选按钮——共享同一套设计令牌。',
    pillFeedback: '反馈',
    pillStable: '稳定版',
    anatomyTitle: '结构剖析',
    anatomyLead: '复选框组件的各个部分及其作用。',
    anatomyDemoLabel: '标签',
    anatomyParts: [
      { num: '1', label: '容器', desc: '20×20px 点击区域。形状随类型变化：圆角方形（多选）、圆形（单选/单选按钮）。' },
      { num: '2', label: '勾选指示器', desc: '勾选时显示白色对勾（复选框）或填充的内部圆点（单选按钮）。' },
      { num: '3', label: '标签', desc: '通过 <label> 与控件关联的可见文本。对可访问性是必需的。' },
    ],
    variantsTitle: '变体',
    colProperty: '属性',
    colValues: '值',
    variantRows: [
      { prop: '类型', values: 'Multi Checkbox · Single Checkbox · Radio Button' },
      { prop: '状态', values: 'Default · Disabled' },
      { prop: '已勾选', values: 'True · False' },
    ],
    checkedText: '已勾选',
    uncheckedText: '未勾选',
    tokensTitle: '设计令牌',
    tokensLead: '当前选择的活跃令牌已突出显示。使用上方的控件可查看其他状态。',
    colRole: '角色',
    colToken: '令牌',
    colValue: '值',
    colSwatch: '色板',
    tokenRows: [
      {
        key: 'unchecked-border',
        tokenKey: 'atom.border.default.border-default',
        label: '未勾选边框',
        cssVar: '--atom-border-default-border-default',
      },
      {
        key: 'checked-bg',
        tokenKey: 'atom.background.primary.bg-primary-pressed',
        label: '已勾选背景',
        cssVar: '--atom-background-primary-bg-primary-pressed',
      },
      {
        key: 'checked-icon',
        tokenKey: 'atom.foreground.states.fg-pressed-inverse',
        label: '已勾选图标',
        cssVar: '--atom-foreground-states-fg-pressed-inverse',
      },
      {
        key: 'radio-border',
        tokenKey: 'atom.border.default.border-default-brand',
        label: '单选按钮已勾选边框',
        cssVar: '--atom-border-default-border-default-brand',
      },
      {
        key: 'radio-inner',
        tokenKey: 'atom.background.primary.bg-primary-pressed',
        label: '单选按钮内部圆点',
        cssVar: '--atom-background-primary-bg-primary-pressed',
      },
      {
        key: 'disabled-border',
        tokenKey: 'atom.border.states.border-disabled',
        label: '禁用边框',
        cssVar: '--atom-border-states-border-disabled',
      },
      {
        key: 'disabled-bg',
        tokenKey: 'atom.background.primary.bg-primary-disabled',
        label: '禁用已勾选背景',
        cssVar: '--atom-background-primary-bg-primary-disabled',
      },
      {
        key: 'disabled-inner',
        tokenKey: 'atom.foreground.states.fg-disabled',
        label: '禁用单选按钮内部',
        cssVar: '--atom-foreground-states-fg-disabled',
      },
    ],
    a11yTitle: '可访问性',
    a11yLead: '使用复选框和单选按钮组件构建包容性体验的指南。',
    a11yRows: [
      {
        icon: '⌨️',
        title: '键盘交互',
        body: '空格键切换复选框。Tab 键在控件之间移动焦点。方向键在一组单选按钮之间循环——不要用 Tab 在单选组内导航。',
      },
      {
        icon: '🔖',
        title: 'ARIA 角色',
        body: '使用原生的 <input type="checkbox"> 和 <input type="radio"> 元素。除非完整实现键盘、焦点和 ARIA 状态管理，否则切勿用 <div role="checkbox"> 复刻它们。',
      },
      {
        icon: '🏷️',
        title: '标签',
        body: '每个控件都必须通过 <label> 包裹或 aria-labelledby 提供可见标签。屏幕阅读器会同时朗读标签和勾选状态——没有标签的复选框无法使用。',
      },
      {
        icon: '🚫',
        title: '禁用状态',
        body: '在输入元素上使用 disabled 属性——而不仅仅是透明度。禁用的输入会被屏幕阅读器朗读为"暗淡"或"不可用"，并会在 Tab 顺序中正确跳过。',
      },
      {
        icon: '📦',
        title: '单选组',
        body: '将相关单选按钮包裹在带 <legend>（描述组的问题）的 <fieldset> 中。这能为屏幕阅读器用户提供每个选项所回答内容的上下文。',
      },
    ],
    usageTitle: '用法',
    usageLead: '何时以及如何使用每种复选框变体。',
    usageVariantRows: [
      { t: 'Multi Checkbox', when: '当用户可以独立选择任意数量的选项时使用。每个复选框完全独立——选择一个不影响其他。' },
      { t: 'Single Checkbox', when: '用于单一的二元选择，例如接受条款或启用某项设置。圆形外观从视觉上将其与一次性切换区分开。' },
      { t: 'Radio Button', when: '当只能从一组中选择一个选项时使用。始终至少提供两个选项，并预选最常见或最安全的默认项。' },
    ],
    doTitle: '✓ 推荐做法',
    doBody: '始终为每个控件配上可见标签。将相关单选按钮组合在 fieldset 中，并使用 legend 描述问题。',
    dontTitle: '✗ 避免做法',
    dontBody:
      '当多选有效时不要使用单选按钮——改用复选框。不要使用单个单选按钮；那暗示一个无法取消的选项。',
  },
} as const;

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const LINE: React.CSSProperties = {
  width: '1px', height: '32px', backgroundColor: '#94a3b8',
};

const TYPES: CheckboxType[] = ['Multi Checkbox', 'Single Checkbox', 'Radio Button'];
const STATES: CheckboxState[] = ['Default', 'Disabled'];

const LABEL_STYLE: React.CSSProperties = {
  margin: '0 0 8px', fontSize: '11px', fontWeight: 600,
  color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em',
};

function SegBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '5px 4px', borderRadius: '6px', border: 'none',
        backgroundColor: active ? '#fff' : 'transparent',
        color: active ? '#111827' : '#6b7280',
        fontSize: '11px', fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.15s ease',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

function CalloutDot({ num }: { num: string }) {
  return (
    <span style={{
      width: '20px', height: '20px', borderRadius: '50%',
      backgroundColor: '#1e293b', color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '11px', fontWeight: 700,
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)', flexShrink: 0,
    }}>
      {num}
    </span>
  );
}

// ─── Token-active matcher (kept here so it can read live state) ────────────
function tokenIsActive(key: string, t: CheckboxType, s: CheckboxState, c: boolean): boolean {
  switch (key) {
    case 'unchecked-border': return !c && s === 'Default';
    case 'checked-bg':       return c && s === 'Default' && t !== 'Radio Button';
    case 'checked-icon':     return c && s === 'Default' && t !== 'Radio Button';
    case 'radio-border':     return c && s === 'Default' && t === 'Radio Button';
    case 'radio-inner':      return c && s === 'Default' && t === 'Radio Button';
    case 'disabled-border':  return s === 'Disabled';
    case 'disabled-bg':      return c && s === 'Disabled' && t !== 'Radio Button';
    case 'disabled-inner':   return c && s === 'Disabled' && t === 'Radio Button';
    default: return false;
  }
}

export function CheckboxPage({ brand, lang = 'en' }: CheckboxPageProps) {
  const t = COPY[lang];
  const [type, setType] = useState<CheckboxType>('Multi Checkbox');
  const [state, setState] = useState<CheckboxState>('Default');
  const [checked, setChecked] = useState(false);
  const [label, setLabel] = useState<string>(t.initialLabel);
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  const previewKey = `${type}-${state}-${checked}-${label}`;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ─────────────────────────────────────────── */}
      <section>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
          <div style={{ display: 'flex', minHeight: '280px' }}>

            {/* Canvas */}
            <div style={{ flex: 1, ...DOTTED_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  <CheckboxLive type={type} state={state} checked={checked} label={label} brand={brand} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div style={{
              width: '224px', flexShrink: 0,
              borderLeft: '1px solid #e5e7eb',
              backgroundColor: '#fff',
              padding: '20px 16px',
              display: 'flex', flexDirection: 'column', gap: '18px',
            }}>
              {/* Type */}
              <div>
                <p style={LABEL_STYLE}>{t.typeLabel}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {TYPES.map(tp => (
                    <button
                      key={tp}
                      onClick={() => setType(tp)}
                      style={{
                        padding: '5px 8px', borderRadius: '6px', textAlign: 'left',
                        border: type === tp ? '1px solid #cbd5e1' : '1px solid transparent',
                        backgroundColor: type === tp ? '#f8fafc' : 'transparent',
                        color: type === tp ? '#111827' : '#6b7280',
                        fontSize: '12.5px', fontWeight: type === tp ? 600 : 400,
                        cursor: 'pointer', transition: 'all 0.1s ease',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    >
                      {tp}
                    </button>
                  ))}
                </div>
              </div>

              {/* State */}
              <div>
                <p style={LABEL_STYLE}>{t.stateLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {STATES.map(s => (
                    <SegBtn key={s} active={state === s} onClick={() => setState(s)}>{s}</SegBtn>
                  ))}
                </div>
              </div>

              {/* Checked */}
              <div>
                <p style={LABEL_STYLE}>{t.checkedLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  <SegBtn active={checked} onClick={() => setChecked(true)}>{t.trueLabel}</SegBtn>
                  <SegBtn active={!checked} onClick={() => setChecked(false)}>{t.falseLabel}</SegBtn>
                </div>
              </div>

              {/* Label */}
              <div>
                <p style={{ ...LABEL_STYLE, margin: '0 0 6px' }}>{t.labelLabel}</p>
                <input
                  type="text"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  style={{
                    width: '100%', padding: '6px 8px', fontSize: '12.5px',
                    border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none',
                    boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif',
                    color: '#374151',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ──────────────────────────────────────────────── */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
          {t.title}
        </h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '640px' }}>
          {t.description}
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <a href="#" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '6px', border: '1px solid #e5e7eb',
            fontSize: '13px', color: '#374151', textDecoration: 'none',
            fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#fff',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.pillFeedback}
          </a>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '6px',
            border: '1px solid #bbf7d0', fontSize: '13px', color: '#166534',
            backgroundColor: '#f0fdf4', fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            {t.pillStable}
          </span>
        </div>
      </section>

      {/* ── 3. ANATOMY ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>{t.anatomyLead}</p>

        <div style={{
          ...DOTTED_BG, borderRadius: '12px', padding: '64px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <div>
            <CheckboxLive type="Multi Checkbox" state="Default" checked={true} label={t.anatomyDemoLabel} brand={brand} />
          </div>

          {/* Callout 1 — Container (bottom, slightly left of checkbox center) */}
          <div style={{ position: 'absolute', bottom: '16px', left: '45%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={LINE} />
            <CalloutDot num="1" />
          </div>

          {/* Callout 2 — Check indicator (top, slightly right of checkbox center) */}
          <div style={{ position: 'absolute', top: '16px', left: '46%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="2" />
            <div style={LINE} />
          </div>

          {/* Callout 3 — Label (top, centered on label text) */}
          <div style={{ position: 'absolute', top: '16px', left: '53%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalloutDot num="3" />
            <div style={LINE} />
          </div>
        </div>

        {/* Legend */}
        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {t.anatomyParts.map(({ num, label: l, desc }) => (
            <div key={num} style={{
              display: 'flex', gap: '10px', padding: '12px',
              borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6',
            }}>
              <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>{num}</span>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>{l}</p>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. VARIANTS TABLE ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">{t.variantsTitle}</h2>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>{t.colProperty}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.colValues}</th>
              </tr>
            </thead>
            <tbody>
              {t.variantRows.map(({ prop, values }, i, arr) => (
                <tr key={prop} style={{ borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>{prop}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview of all type × state × checked combinations */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {TYPES.map(tp =>
            STATES.map(s =>
              [false, true].map(c => (
                <div key={`${tp}-${s}-${c}`} style={{ padding: '16px 20px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#6b7280' }}>
                    {tp} · {s} · {c ? t.checkedText : t.uncheckedText}
                  </p>
                  <CheckboxLive type={tp} state={s} checked={c} label={t.anatomyDemoLabel} brand={brand} />
                </div>
              ))
            )
          )}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.tokensTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.tokensLead}
        </p>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '160px' }}>{t.colRole}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>{t.colToken}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '140px' }}>{t.colValue}</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', width: '52px' }}>{t.colSwatch}</th>
              </tr>
            </thead>
            <tbody>
              {t.tokenRows.map((row, i) => {
                const isActive = tokenIsActive(row.key, type, state, checked);
                const resolvedValue = tokens[row.tokenKey as keyof typeof tokens] ?? '—';
                return (
                  <tr
                    key={row.key}
                    style={{
                      borderBottom: i < t.tokenRows.length - 1 ? '1px solid #f3f4f6' : 'none',
                      opacity: isActive ? 1 : 0.35,
                      transition: 'opacity 0.2s ease',
                      borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                    }}
                  >
                    <td style={{ padding: '10px 16px', color: '#374151', fontWeight: isActive ? 600 : 400 }}>{row.label}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <code style={{ fontSize: '11px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>
                        {row.cssVar}
                      </code>
                    </td>
                    <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                      {resolvedValue}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      {(resolvedValue.startsWith('rgb') || resolvedValue.startsWith('#')) && (
                        <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: resolvedValue, border: '1px solid rgba(0,0,0,0.08)' }} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 6. ACCESSIBILITY ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.a11yLead}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {t.a11yRows.map(({ icon, title, body }) => (
            <div key={title} style={{
              display: 'flex', gap: '14px', padding: '16px',
              borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
            }}>
              <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>{icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#111827' }}>{title}</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. USAGE ───────────────────────────────────────────────────────── */}
      <section style={{ paddingBottom: '40px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>{t.usageLead}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {t.usageVariantRows.map(({ t: tp, when }) => (
            <div key={tp} style={{
              padding: '14px 16px', borderRadius: '10px',
              border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
            }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#111827' }}>{tp}</p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7280', lineHeight: 1.4 }}>{when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.doTitle}</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.doBody}
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.dontTitle}</p>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.dontBody}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
