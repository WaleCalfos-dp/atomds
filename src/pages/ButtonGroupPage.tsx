import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ButtonGroupLive,
  type ButtonGroupDirection,
  type ButtonGroupType,
  type ButtonGroupBackground,
} from '../components/button-group/ButtonGroupLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface ButtonGroupPageProps {
  brand: Brand;
  lang?: Language;
}

const COPY = {
  en: {
    directionLabel: 'Direction',
    typeLabel: 'Type',
    backgroundLabel: 'Background Fill',
    headline: 'Button Group',
    tagline:
      'Two related actions rendered as a tightly-coupled pair: one Primary + one Secondary. Use for confirm/cancel patterns, toast footers, and sticky-bottom CTA zones on mobile screens.',
    feedback: 'Feedback',
    stable: 'Stable',
    anatomyHeading: 'Anatomy',
    anatomyTagline:
      'A Button Group is a container plus exactly two actions. Layout, padding, and surface colour are driven by Type + Direction.',
    parts: [
      {
        num: '1',
        name: 'Container',
        desc: 'Surface + padding. Background fill = Yes applies the muted panel token; Sticky-Bottom types add a top hairline and 50px bottom safe-area.',
      },
      {
        num: '2',
        name: 'Primary action',
        desc: 'Filled pill (Full Button Small, 52px). One per group — this is the commit action.',
      },
      {
        num: '3',
        name: 'Gap',
        desc: '16px fixed gap between buttons — never touches, never stretches.',
      },
      {
        num: '4',
        name: 'Secondary action',
        desc: 'Outline pill (stroke = border-default-brand, 52px). Cancel or alternative action.',
      },
    ],
    variantsHeading: 'Variants',
    propertyCol: 'Property',
    valuesCol: 'Values',
    directionProp: 'Direction',
    directionValues: 'Horizontal · Vertical · Button Right',
    typeProp: 'Type',
    typeValues: 'General · Sticky Bottom · Sticky Bottom - eSIM · Toast',
    backgroundProp: 'Background Fill',
    backgroundValues: 'Yes · No',
    booleansProp: 'Booleans (7)',
    booleansValues: 'Button 1 (default on), Button 2 (default on), Button 3 (default off), Buttons (default on), Content Left (default on), Title (default on), Description (default on)',
    textSlotsProp: 'Text slots (2)',
    textSlotsValues: 'Title Text (default "Title"), Description Text (default "Description")',
    designTokensHeading: 'Design Tokens',
    designTokensTagline:
      'Button Group itself owns container-level tokens. The Primary and Secondary pills inherit their state tokens from the Button component.',
    tokenCol: 'Token',
    cssVarCol: 'CSS Variable',
    valueCol: (b: string) => `Value (${b})`,
    tokenRows: [
      { label: 'Primary bg',       key: 'atom.background.primary.bg-primary-default',       cssVar: '--atom-background-primary-bg-primary-default' },
      { label: 'Primary fg',       key: 'atom.foreground.primary.fg-brand-primary-inverse', cssVar: '--atom-foreground-primary-fg-brand-primary-inverse' },
      { label: 'Secondary stroke', key: 'atom.border.default.border-default-brand',         cssVar: '--atom-border-default-border-default-brand' },
      { label: 'Surface',          key: 'atom.background.primary.bg-primary-inverse',       cssVar: '--atom-background-primary-bg-primary-inverse' },
      { label: 'Panel (fill=Yes)', key: 'atom.background.core.bg-muted',                    cssVar: '--atom-background-core-bg-muted' },
    ],
    accessibilityHeading: 'Accessibility',
    accessibilityTagline: 'Guidelines for implementing Button Group in an inclusive way.',
    a11yRows: [
      {
        icon: '👥',
        title: 'Group role',
        body: 'Wrap the cluster in role="group" with an aria-label describing the group\'s purpose (e.g. "Confirm or cancel"). Screen readers then announce the group boundaries.',
      },
      {
        icon: '⌨️',
        title: 'Keyboard order',
        body: 'Buttons are reached with Tab in reading order: Primary first in General / Sticky Bottom, Primary last (right) in Toast. Enter or Space activates the focused button.',
      },
      {
        icon: '🎯',
        title: 'Clear primary action',
        body: 'Exactly one button in the group is rendered as Primary (filled). Secondary actions use the outline style. Never render two filled buttons in the same group.',
      },
      {
        icon: '📱',
        title: 'Safe-area on Sticky Bottom',
        body: 'Sticky Bottom groups include 50px of bottom padding to clear iOS / Android home-indicator zones. Do not remove it or tap targets become unreachable on device.',
      },
      {
        icon: '🎨',
        title: 'Contrast & focus',
        body: 'Primary uses #0A2333/white (16.9:1), Secondary uses stroke + dark text on white (16.9:1). Focus outlines are handled by the underlying Button component.',
      },
    ],
    usageHeading: 'Usage',
    usageTagline: 'When and how to use the Button Group component.',
    whenToUse: '✓ When to use',
    whenNotToUse: '✗ When not to use',
    whenToUseLines: [
      'Confirm or cancel a destructive action (pair Primary + Secondary).',
      'Close a toast or modal with an optional accept + dismiss.',
      'Sticky footer for multi-step flows where the user commits / goes back.',
      'eSIM or plan-purchase screens: summary info + primary CTA.',
    ],
    whenNotToUseLines: [
      'Single selection from 3+ options — use Tabs or Segmented Control instead.',
      'Navigation within a single page — use a link, not two buttons.',
      'Where only one action exists — render a standalone Full Button.',
      'Dense toolbars with 4+ actions — use an Icon Only Button Group or Menu.',
    ],
    fillLabel: (b: string) => `fill=${b}`,
  },
  zh: {
    directionLabel: '方向',
    typeLabel: '类型',
    backgroundLabel: '背景填充',
    headline: '按钮组',
    tagline:
      '两个相关操作以紧密耦合的形式渲染:一个主要 + 一个次要。用于确认/取消模式、提示消息底部、以及移动端粘性底部 CTA 区域。',
    feedback: '反馈',
    stable: '稳定版',
    anatomyHeading: '结构剖析',
    anatomyTagline:
      '按钮组由一个容器加上正好两个操作组成。布局、内边距和表面颜色由类型 + 方向驱动。',
    parts: [
      {
        num: '1',
        name: '容器',
        desc: '表面 + 内边距。背景填充 = 是时应用静音面板令牌;粘性底部类型会添加顶部细线和 50px 底部安全区域。',
      },
      {
        num: '2',
        name: '主要操作',
        desc: '填充胶囊(完整小按钮,52px)。每组一个——这是提交操作。',
      },
      {
        num: '3',
        name: '间距',
        desc: '按钮之间固定 16px 间距——不会相接、也不会拉伸。',
      },
      {
        num: '4',
        name: '次要操作',
        desc: '描边胶囊(描边 = border-default-brand,52px)。取消或替代操作。',
      },
    ],
    variantsHeading: '变体',
    propertyCol: '属性',
    valuesCol: '取值',
    directionProp: '方向',
    directionValues: 'Horizontal · Vertical · Button Right',
    typeProp: '类型',
    typeValues: 'General · Sticky Bottom · Sticky Bottom - eSIM · Toast',
    backgroundProp: '背景填充',
    backgroundValues: 'Yes · No',
    booleansProp: '布尔值 (7)',
    booleansValues: 'Button 1（默认开）、Button 2（默认开）、Button 3（默认关）、Buttons（默认开）、Content Left（默认开）、Title（默认开）、Description（默认开）',
    textSlotsProp: '文本插槽 (2)',
    textSlotsValues: 'Title Text（默认 "Title"）、Description Text（默认 "Description"）',
    designTokensHeading: '设计令牌',
    designTokensTagline:
      '按钮组本身拥有容器级令牌。主要和次要胶囊从按钮组件继承其状态令牌。',
    tokenCol: '令牌',
    cssVarCol: 'CSS 变量',
    valueCol: (b: string) => `值 (${b})`,
    tokenRows: [
      { label: '主背景',          key: 'atom.background.primary.bg-primary-default',       cssVar: '--atom-background-primary-bg-primary-default' },
      { label: '主前景',          key: 'atom.foreground.primary.fg-brand-primary-inverse', cssVar: '--atom-foreground-primary-fg-brand-primary-inverse' },
      { label: '次要描边',        key: 'atom.border.default.border-default-brand',         cssVar: '--atom-border-default-border-default-brand' },
      { label: '表面',            key: 'atom.background.primary.bg-primary-inverse',       cssVar: '--atom-background-primary-bg-primary-inverse' },
      { label: '面板(填充=是)', key: 'atom.background.core.bg-muted',                    cssVar: '--atom-background-core-bg-muted' },
    ],
    accessibilityHeading: '可访问性',
    accessibilityTagline: '以包容方式实现按钮组的指南。',
    a11yRows: [
      {
        icon: '👥',
        title: '组角色',
        body: '将该群组包裹在 role="group" 中,并使用 aria-label 描述该组的用途(例如"确认或取消")。屏幕阅读器会随之播报组的边界。',
      },
      {
        icon: '⌨️',
        title: '键盘顺序',
        body: '按钮按阅读顺序通过 Tab 到达:在 General / Sticky Bottom 中主要按钮在前,在 Toast 中主要按钮在后(右)。Enter 或 Space 激活获得焦点的按钮。',
      },
      {
        icon: '🎯',
        title: '清晰的主要操作',
        body: '组中只有一个按钮渲染为主要(填充)。次要操作使用描边样式。切勿在同一组中渲染两个填充按钮。',
      },
      {
        icon: '📱',
        title: '粘性底部安全区域',
        body: '粘性底部组包含 50px 底部内边距,以避开 iOS / Android 主屏幕指示条区域。不要移除它,否则设备上的点击目标将无法触及。',
      },
      {
        icon: '🎨',
        title: '对比度与焦点',
        body: '主要使用 #0A2333/白色(16.9:1),次要使用白色背景上的描边 + 深色文本(16.9:1)。焦点轮廓由底层按钮组件处理。',
      },
    ],
    usageHeading: '用法',
    usageTagline: '何时以及如何使用按钮组组件。',
    whenToUse: '✓ 适用场景',
    whenNotToUse: '✗ 不适用场景',
    whenToUseLines: [
      '确认或取消破坏性操作(配对主要 + 次要)。',
      '关闭提示消息或模态框,可选接受 + 取消。',
      '多步骤流程的粘性页脚,用户提交 / 返回。',
      'eSIM 或套餐购买页面:摘要信息 + 主要 CTA。',
    ],
    whenNotToUseLines: [
      '从 3+ 个选项中单选——改用选项卡或分段控件。',
      '单页内导航——使用链接,而非两个按钮。',
      '只存在一个操作时——渲染独立的完整按钮。',
      '具有 4+ 个操作的密集工具栏——使用纯图标按钮组或菜单。',
    ],
    fillLabel: (b: string) => `填充=${b}`,
  },
} as const;

// ─── Visual helpers ───────────────────────────────────────────────────────────
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
      }}
    >
      {children}
    </button>
  );
}

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

const DIRECTIONS: ButtonGroupDirection[] = ['Horizontal', 'Vertical', 'Button Right'];
const TYPES: ButtonGroupType[] = ['General', 'Sticky Bottom', 'Sticky Bottom - eSIM', 'Toast'];
const BACKGROUNDS: ButtonGroupBackground[] = ['No', 'Yes'];

// Variants grid — every combination that exists in the Figma set.
const VARIANT_GRID: { direction: ButtonGroupDirection; type: ButtonGroupType; background: ButtonGroupBackground }[] = [
  { direction: 'Horizontal',    type: 'General',              background: 'No'  },
  { direction: 'Vertical',      type: 'General',              background: 'No'  },
  { direction: 'Horizontal',    type: 'Sticky Bottom',        background: 'No'  },
  { direction: 'Horizontal',    type: 'Sticky Bottom',        background: 'Yes' },
  { direction: 'Vertical',      type: 'Sticky Bottom',        background: 'No'  },
  { direction: 'Vertical',      type: 'Sticky Bottom',        background: 'Yes' },
  { direction: 'Horizontal',    type: 'Sticky Bottom - eSIM', background: 'No'  },
  { direction: 'Horizontal',    type: 'Sticky Bottom - eSIM', background: 'Yes' },
  { direction: 'Vertical',      type: 'Sticky Bottom - eSIM', background: 'No'  },
  { direction: 'Vertical',      type: 'Sticky Bottom - eSIM', background: 'Yes' },
  { direction: 'Horizontal',    type: 'Toast',                background: 'No'  },
  { direction: 'Horizontal',    type: 'Toast',                background: 'Yes' },
  { direction: 'Vertical',      type: 'Toast',                background: 'No'  },
  { direction: 'Vertical',      type: 'Toast',                background: 'Yes' },
  { direction: 'Button Right',  type: 'Sticky Bottom',        background: 'Yes' },
];

export function ButtonGroupPage({ brand, lang = 'en' }: ButtonGroupPageProps) {
  const t = COPY[lang];
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  const [direction, setDirection] = useState<ButtonGroupDirection>('Horizontal');
  const [groupType, setGroupType] = useState<ButtonGroupType>('General');
  const [background, setBackground] = useState<ButtonGroupBackground>('No');

  const previewKey = `${direction}-${groupType}-${background}`;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">
            {/* Left canvas */}
            <div
              className="flex-1 flex items-center justify-center p-12 min-h-52"
              style={DOTTED_BG}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <ButtonGroupLive
                    direction={direction}
                    groupType={groupType}
                    background={background}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right controls */}
            <div
              style={{
                width: '224px',
                flexShrink: 0,
                borderLeft: '1px solid #e5e7eb',
                backgroundColor: '#fff',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div>
                <p style={LABEL_STYLE}>{t.directionLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {DIRECTIONS.map((d) => (
                    <SegBtn key={d} active={direction === d} onClick={() => setDirection(d)}>{d}</SegBtn>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>{t.typeLabel}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                  {TYPES.map((typeOpt) => (
                    <SegBtn key={typeOpt} active={groupType === typeOpt} onClick={() => setGroupType(typeOpt)}>{typeOpt}</SegBtn>
                  ))}
                </div>
              </div>
              <div>
                <p style={LABEL_STYLE}>{t.backgroundLabel}</p>
                <div style={{ display: 'flex', padding: '2px', backgroundColor: '#f3f4f6', borderRadius: '8px', gap: '2px' }}>
                  {BACKGROUNDS.map((b) => (
                    <SegBtn key={b} active={background === b} onClick={() => setBackground(b)}>{b}</SegBtn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{t.headline}</h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 16px', maxWidth: '640px' }}>
          {t.tagline}
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '6px',
            border: '1px solid #bfdbfe', fontSize: '13px', color: '#1d4ed8',
            backgroundColor: '#eff6ff', fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            {t.feedback}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '6px',
            border: '1px solid #bbf7d0', fontSize: '13px', color: '#166534',
            backgroundColor: '#f0fdf4', fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            {t.stable}
          </span>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyHeading}</h2>
        <p className="text-sm text-slate-500 mb-5">{t.anatomyTagline}</p>

        <div className="relative flex items-center justify-center py-16 px-8 rounded-xl" style={DOTTED_BG}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <ButtonGroupLive direction="Horizontal" groupType="Sticky Bottom" background="Yes" brand={brand} />

            {/* 1 Container — pointer from below, centered */}
            <div className="absolute pointer-events-none" style={{ bottom: '-42px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="w-px bg-slate-400" style={{ height: '32px' }} />
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">1</span>
            </div>
            {/* 2 Primary button — pointer from above, left third */}
            <div className="absolute pointer-events-none" style={{ top: '-42px', left: '28%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">2</span>
              <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            </div>
            {/* 3 Gap — pointer from above, center */}
            <div className="absolute pointer-events-none" style={{ top: '-42px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">3</span>
              <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            </div>
            {/* 4 Secondary button — pointer from above, right third */}
            <div className="absolute pointer-events-none" style={{ top: '-42px', left: '72%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">4</span>
              <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {t.parts.map((row) => (
            <div key={row.num} style={{ display: 'flex', gap: '10px', padding: '12px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827', flexShrink: 0, marginTop: '1px', minWidth: '12px' }}>{row.num}</span>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>{row.name}</p>
                <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>{row.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-4">{t.variantsHeading}</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.propertyCol}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.valuesCol}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.directionProp}</td>
                <td className="px-5 py-3.5 text-slate-500 text-sm">{t.directionValues}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.typeProp}</td>
                <td className="px-5 py-3.5 text-slate-500 text-sm">{t.typeValues}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm">{t.backgroundProp}</td>
                <td className="px-5 py-3.5 text-slate-500 text-sm">{t.backgroundValues}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm align-top">{t.booleansProp}</td>
                <td className="px-5 py-3.5 text-slate-500 text-xs leading-relaxed">{t.booleansValues}</td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 font-medium text-slate-700 text-sm align-top">{t.textSlotsProp}</td>
                <td className="px-5 py-3.5 text-slate-500 text-xs leading-relaxed">{t.textSlotsValues}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Visual variants grid — every Figma permutation */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {VARIANT_GRID.map((v) => {
            const title = `${v.direction} · ${v.type} · ${t.fillLabel(v.background)}`;
            return (
              <div key={title} style={{ padding: '16px', borderRadius: '10px', border: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: 600, color: '#6b7280' }}>{title}</p>
                <div style={{ ...DOTTED_BG, padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px', overflow: 'hidden' }}>
                  <div style={{ transform: 'scale(0.7)', transformOrigin: 'center' }}>
                    <ButtonGroupLive direction={v.direction} groupType={v.type} background={v.background} brand={brand} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.designTokensHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.designTokensTagline}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.tokenCol}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.cssVarCol}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.valueCol(brand)}</th>
              </tr>
            </thead>
            <tbody>
              {t.tokenRows.map((row, i) => {
                const rawValue = (tokens[row.key as keyof typeof tokens] as string) ?? '—';
                const swatchHex = rawValue.length > 7 ? rawValue.slice(0, 7) : rawValue;
                const light = isLightColor(swatchHex);
                return (
                  <tr key={row.cssVar} className={i < t.tokenRows.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{row.label}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {row.cssVar}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded flex-shrink-0 border border-black/10"
                          style={{ backgroundColor: swatchHex }}
                        />
                        <span
                          className="font-mono text-xs px-1.5 py-0.5 rounded border"
                          style={{
                            backgroundColor: swatchHex,
                            color: light ? '#1e293b' : '#f8fafc',
                            borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)',
                          }}
                        >
                          {swatchHex.toUpperCase()}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 6. ACCESSIBILITY ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.accessibilityHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.accessibilityTagline}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm divide-y divide-slate-100">
          {t.a11yRows.map((row, i) => (
            <div
              key={row.title}
              className={['flex items-start gap-4 px-5 py-4', i % 2 === 1 ? 'bg-slate-50/50' : ''].join(' ')}
            >
              <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{row.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{row.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{row.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. USAGE ─────────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageHeading}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.usageTagline}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>{t.whenToUse}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.whenToUseLines.map((line) => <li key={line} style={{ marginBottom: '6px' }}>• {line}</li>)}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>{t.whenNotToUse}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.whenNotToUseLines.map((line) => <li key={line} style={{ marginBottom: '6px' }}>• {line}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
