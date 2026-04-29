import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';
import { SwitchLive } from '../components/switch/SwitchLive';

interface SwitchPageProps {
  brand: Brand;
  lang?: Language;
}

/* -------------------------------------------------------------------------- */
/*  Figma property surface                                                    */
/* -------------------------------------------------------------------------- */

type SwitchState = 'Default' | 'Focused' | 'Disabled';
const STATES: SwitchState[] = ['Default', 'Focused', 'Disabled'];

/* -------------------------------------------------------------------------- */
/*  Localised copy                                                            */
/* -------------------------------------------------------------------------- */

const COPY = {
  en: {
    stateLabel: 'State',
    onLabel: 'On',
    actionTextLabel: 'Action Text',
    valueTrue: 'True',
    valueFalse: 'False',
    title: 'Switch',
    description:
      'Enables users to switch between two opposing states. Use for on/off settings, mode changes, or preference controls.',
    feedbackBadge: 'Feedback',
    stableBadge: 'Stable',
    anatomyTitle: 'Anatomy',
    anatomyLead: 'Three visual parts: the track, the thumb, and the optional action text.',
    parts: [
      {
        num: '1',
        label: 'Track',
        desc: '48 × 24 pill (999 radius). Off uses bg-muted; On uses bg-primary-pressed; Disabled uses bg-primary-disabled.',
      },
      {
        num: '2',
        label: 'Thumb',
        desc: '20 × 20 circle inside the track, offset 2px from each edge. Slides between left (Off) and right (On) positions.',
      },
      {
        num: '3',
        label: 'Action text',
        desc: '12px Medium inline label that reads "On" or "Off". Shown when the Action Text boolean is true; colour follows the state-specific foreground token.',
      },
    ],
    variantsTitle: 'Variants',
    variantsLead:
      'Two variant properties combine to 6 concrete variants; an Action Text boolean adds an orthogonal toggle.',
    variantsHeaderProperty: 'Property',
    variantsHeaderValues: 'Values',
    variantsHeaderDefault: 'Default',
    variantRows: [
      { prop: 'state', values: 'Default · Focused · Disabled', def: 'Default' },
      { prop: 'On', values: 'True · False', def: 'False' },
      { prop: 'Action Text', values: 'True · False', def: 'True' },
    ],
    variantCardLabel: (s: string, isOn: boolean) => `${s} · On=${isOn ? 'True' : 'False'}`,
    tokensTitle: 'Design Tokens',
    tokensLead:
      'Tokens used across every Switch variant. Swatches repaint to match the active brand.',
    tokensHeaderRole: 'Role',
    tokensHeaderToken: 'Token',
    tokensHeaderValue: 'Value',
    tokensHeaderSwatch: 'Swatch',
    tokenRoles: {
      'Track — Off (Default / Focused)': 'Track — Off (Default / Focused)',
      'Track — On (Default / Focused)': 'Track — On (Default / Focused)',
      'Track — Disabled': 'Track — Disabled',
      'Thumb — Off': 'Thumb — Off',
      'Thumb — On': 'Thumb — On',
      'Thumb — Disabled': 'Thumb — Disabled',
      'Action text — Off': 'Action text — Off',
      'Action text — On': 'Action text — On',
      'Action text — Disabled': 'Action text — Disabled',
      'Focus ring': 'Focus ring',
    } as Record<string, string>,
    a11yTitle: 'Accessibility',
    a11yLead: 'Guidance for implementing inclusive toggles.',
    a11yRows: [
      {
        icon: '🔀',
        title: 'Use role="switch"',
        body: 'The toggle element must have role="switch" together with aria-checked="true" or "false". A native input type="checkbox" visually styled as a switch is also acceptable.',
      },
      {
        icon: '🏷️',
        title: 'Always provide a setting label',
        body: 'Pair every switch with a visible label that names the setting being controlled (e.g. "Email notifications"). Associate it via aria-labelledby or a wrapping <label>.',
      },
      {
        icon: '⌨️',
        title: 'Keyboard: Space toggles',
        body: 'Space must toggle the switch when focused. Tab moves focus to it. Do not suppress focus; the Focused state renders the brand focus ring which meets the 3:1 non-text contrast rule.',
      },
      {
        icon: '🚫',
        title: 'Disabled semantics',
        body: 'Prefer aria-disabled="true" when the switch should stay in tab order for contextual help, or the native disabled attribute when it should be removed from focus entirely.',
      },
      {
        icon: '🎨',
        title: 'State independent of colour',
        body: 'Thumb position — not just colour — carries the on/off meaning. When Action Text is off, ensure the label nearby already describes the currently active option.',
      },
      {
        icon: '📢',
        title: 'Announce changes',
        body: 'If flipping the switch triggers a visible change elsewhere, consider a polite aria-live region so screen reader users hear the result.',
      },
    ],
    usageTitle: 'Usage',
    usageLead: 'When to reach for each state and when to enable Action Text.',
    usageRows: [
      {
        title: 'Default',
        body: 'Resting state. Flip toggles immediately without a confirm step. Use for settings that apply as soon as they change.',
      },
      {
        title: 'Focused',
        body: 'Keyboard focus or tap focus. A 2px ring in border-selected wraps the track so users always know where focus sits.',
      },
      {
        title: 'Disabled',
        body: 'Use when the setting is temporarily unavailable (e.g. requires a higher plan or depends on another toggle being on).',
      },
      {
        title: 'Action Text',
        body: 'When true, renders the inline "On" / "Off" label beside the track. Turn off when the surrounding row already communicates state, or when horizontal space is tight.',
      },
    ],
    doLabel: 'Do',
    dontLabel: "Don't",
    doItems: [
      'Use Switch for on/off settings that apply immediately',
      'Name the setting in the row label ("Email notifications"), not just "On/Off"',
      'Reflect the state change instantly — no separate Save step',
    ],
    dontItems: [
      "Don't use Switch for choices that require a submit action — use Checkbox instead",
      "Don't use Switch for mutually exclusive options — use Radio Group",
      "Don't rely on the thumb position alone — ensure the label describes what is toggled",
    ],
  },
  zh: {
    stateLabel: '状态',
    onLabel: '开启',
    actionTextLabel: '操作文本',
    valueTrue: '是',
    valueFalse: '否',
    title: '开关',
    description:
      '让用户在两种相反的状态之间切换。用于开/关设置、模式变更或偏好控制。',
    feedbackBadge: '反馈',
    stableBadge: '稳定',
    anatomyTitle: '组成结构',
    anatomyLead: '三个视觉部分：轨道、滑块和可选的操作文本。',
    parts: [
      {
        num: '1',
        label: '轨道',
        desc: '48 × 24 胶囊形(999 圆角)。关闭时使用 bg-muted；开启时使用 bg-primary-pressed；禁用时使用 bg-primary-disabled。',
      },
      {
        num: '2',
        label: '滑块',
        desc: '轨道内 20 × 20 圆形，距离每边偏移 2px。在左(关闭)和右(开启)位置之间滑动。',
      },
      {
        num: '3',
        label: '操作文本',
        desc: '12px Medium 内嵌标签，显示 "On" 或 "Off"。当 Action Text 布尔值为 true 时显示；颜色遵循特定状态的前景令牌。',
      },
    ],
    variantsTitle: '变体',
    variantsLead:
      '两个变体属性组合产生 6 个具体变体；操作文本布尔值添加一个正交切换。',
    variantsHeaderProperty: '属性',
    variantsHeaderValues: '值',
    variantsHeaderDefault: '默认值',
    variantRows: [
      { prop: 'state', values: 'Default · Focused · Disabled', def: 'Default' },
      { prop: 'On', values: 'True · False', def: 'False' },
      { prop: 'Action Text', values: 'True · False', def: 'True' },
    ],
    variantCardLabel: (s: string, isOn: boolean) => `${s} · On=${isOn ? 'True' : 'False'}`,
    tokensTitle: '设计令牌',
    tokensLead:
      '所有 Switch 变体使用的令牌。色板会根据当前品牌重新着色。',
    tokensHeaderRole: '角色',
    tokensHeaderToken: '令牌',
    tokensHeaderValue: '值',
    tokensHeaderSwatch: '色板',
    tokenRoles: {
      'Track — Off (Default / Focused)': '轨道 — 关闭 (默认 / 聚焦)',
      'Track — On (Default / Focused)': '轨道 — 开启 (默认 / 聚焦)',
      'Track — Disabled': '轨道 — 禁用',
      'Thumb — Off': '滑块 — 关闭',
      'Thumb — On': '滑块 — 开启',
      'Thumb — Disabled': '滑块 — 禁用',
      'Action text — Off': '操作文本 — 关闭',
      'Action text — On': '操作文本 — 开启',
      'Action text — Disabled': '操作文本 — 禁用',
      'Focus ring': '聚焦环',
    } as Record<string, string>,
    a11yTitle: '无障碍',
    a11yLead: '实现包容性切换的指南。',
    a11yRows: [
      {
        icon: '🔀',
        title: '使用 role="switch"',
        body: '切换元素必须设置 role="switch" 并配合 aria-checked="true" 或 "false"。视觉上设置为开关样式的原生 input type="checkbox" 也可以接受。',
      },
      {
        icon: '🏷️',
        title: '始终提供设置标签',
        body: '为每个开关搭配可见标签，标明所控制的设置(例如 "邮件通知")。通过 aria-labelledby 或包裹的 <label> 进行关联。',
      },
      {
        icon: '⌨️',
        title: '键盘:空格键切换',
        body: '当聚焦时,空格键必须能切换开关。Tab 键将焦点移动到开关。请勿压制焦点;聚焦状态会渲染品牌聚焦环,满足 3:1 非文本对比度要求。',
      },
      {
        icon: '🚫',
        title: '禁用语义',
        body: '当开关需要保留在 Tab 顺序中以提供上下文帮助时,优先使用 aria-disabled="true";当需要完全从焦点中移除时,使用原生 disabled 属性。',
      },
      {
        icon: '🎨',
        title: '不依赖颜色传达状态',
        body: '滑块位置(而不仅仅是颜色)传达开/关含义。当操作文本关闭时,确保附近的标签已描述当前激活的选项。',
      },
      {
        icon: '📢',
        title: '通报状态变化',
        body: '如果切换开关会触发其他位置的可见变化,可考虑使用礼貌型 aria-live 区域,让屏幕阅读器用户听到结果。',
      },
    ],
    usageTitle: '使用',
    usageLead: '何时使用每个状态以及何时启用操作文本。',
    usageRows: [
      {
        title: '默认',
        body: '静止状态。切换会立即生效,无需确认步骤。用于变更后即时应用的设置。',
      },
      {
        title: '聚焦',
        body: '键盘焦点或点击焦点。border-selected 的 2px 环包围轨道,让用户始终知道焦点位置。',
      },
      {
        title: '禁用',
        body: '当设置暂时不可用时使用(例如需要更高级别的方案或依赖其他开关为开启状态)。',
      },
      {
        title: '操作文本',
        body: '为 true 时,在轨道旁渲染内嵌的 "On" / "Off" 标签。当周围行已传达状态或水平空间紧张时关闭。',
      },
    ],
    doLabel: '推荐',
    dontLabel: '避免',
    doItems: [
      '将 Switch 用于立即生效的开/关设置',
      '在行标签中命名设置("邮件通知"),而非仅 "开/关"',
      '即时反映状态变化 — 无需单独的保存步骤',
    ],
    dontItems: [
      '不要将 Switch 用于需要提交操作的选择 — 改用 Checkbox',
      '不要将 Switch 用于互斥选项 — 改用 Radio Group',
      '不要仅依赖滑块位置 — 确保标签描述切换的内容',
    ],
  },
} as const;

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

const LINE: React.CSSProperties = { width: '1px', height: '32px', backgroundColor: '#94a3b8' };

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
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
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
/*  Reference data                                                            */
/* -------------------------------------------------------------------------- */

const TOKEN_TABLE_ROWS = [
  { role: 'Track — Off (Default / Focused)', tokenKey: 'atom.background.core.bg-muted', cssVar: '--atom-background-core-bg-muted' },
  { role: 'Track — On (Default / Focused)', tokenKey: 'atom.background.primary.bg-primary-pressed', cssVar: '--atom-background-primary-bg-primary-pressed' },
  { role: 'Track — Disabled', tokenKey: 'atom.background.primary.bg-primary-disabled', cssVar: '--atom-background-primary-bg-primary-disabled' },
  { role: 'Thumb — Off', tokenKey: 'atom.foreground.primary.fg-brand-primary', cssVar: '--atom-foreground-primary-fg-brand-primary' },
  { role: 'Thumb — On', tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse', cssVar: '--atom-foreground-primary-fg-brand-primary-inverse' },
  { role: 'Thumb — Disabled', tokenKey: 'atom.foreground.states.fg-disabled-inverse', cssVar: '--atom-foreground-states-fg-disabled-inverse' },
  { role: 'Action text — Off', tokenKey: 'atom.foreground.core.fg-primary', cssVar: '--atom-foreground-core-fg-primary' },
  { role: 'Action text — On', tokenKey: 'atom.foreground.primary.fg-brand-primary', cssVar: '--atom-foreground-primary-fg-brand-primary' },
  { role: 'Action text — Disabled', tokenKey: 'atom.foreground.states.fg-disabled', cssVar: '--atom-foreground-states-fg-disabled' },
  { role: 'Focus ring', tokenKey: 'atom.border.selection-and-focus.border-selected', cssVar: '--atom-border-selection-and-focus-border-selected' },
] as const;

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export function SwitchPage({ brand, lang = 'en' }: SwitchPageProps) {
  const t = COPY[lang];
  const [state, setState] = useState<SwitchState>('Default');
  const [on, setOn] = useState(false);
  const [actionText, setActionText] = useState(true);

  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];
  const previewKey = `${state}|${on}|${actionText}`;

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
          <div style={{ display: 'flex', minHeight: '300px' }}>
            <div
              style={{
                flex: 1,
                ...DOTTED_BG,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  <SwitchLive state={state} on={on} actionText={actionText} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div
              style={{
                width: '224px',
                borderLeft: '1px solid #e5e7eb',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                backgroundColor: '#fafafa',
                flexShrink: 0,
              }}
            >
              <div>
                <p style={LABEL_STYLE}>{t.stateLabel}</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {STATES.map((s) => (
                    <SegBtn key={s} active={state === s} onClick={() => setState(s)}>
                      {s}
                    </SegBtn>
                  ))}
                </div>
              </div>

              <div>
                <p style={LABEL_STYLE}>{t.onLabel}</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {([true, false] as const).map((v) => (
                    <SegBtn key={String(v)} active={on === v} onClick={() => setOn(v)}>
                      {v ? t.valueTrue : t.valueFalse}
                    </SegBtn>
                  ))}
                </div>
              </div>

              <div>
                <p style={LABEL_STYLE}>{t.actionTextLabel}</p>
                <div
                  style={{
                    display: 'flex',
                    padding: '2px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    gap: '2px',
                  }}
                >
                  {([true, false] as const).map((v) => (
                    <SegBtn
                      key={String(v)}
                      active={actionText === v}
                      onClick={() => setActionText(v)}
                    >
                      {v ? t.valueTrue : t.valueFalse}
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
          {t.title}
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
          {t.description}
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
            {t.feedbackBadge}
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
            {t.stableBadge}
          </span>
        </div>
      </section>

      {/* -- 3. ANATOMY -------------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>
          {t.anatomyLead}
        </p>

        <div
          style={{
            ...DOTTED_BG,
            borderRadius: '12px',
            padding: '64px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minHeight: '200px',
          }}
        >
          <SwitchLive state="Default" on={true} actionText={true} />

          {/* 1 — Track (bottom) */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: 'calc(50% - 28px)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={LINE} />
            <CalloutDot num="1" />
          </div>
          {/* 2 — Thumb (top) */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: 'calc(50% - 6px)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CalloutDot num="2" />
            <div style={LINE} />
          </div>
          {/* 3 — Action text (right) */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: 'calc(50% + 44px)',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CalloutDot num="3" />
            <div style={LINE} />
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
          {t.parts.map(({ num, label, desc }) => (
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
              <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>
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
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.variantsTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.variantsLead}
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
                  {t.variantsHeaderProperty}
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  {t.variantsHeaderValues}
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
                  {t.variantsHeaderDefault}
                </th>
              </tr>
            </thead>
            <tbody>
              {t.variantRows.map(({ prop, values, def }, i) => (
                <tr key={prop} style={{ borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none' }}>
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

        {/* Visual grid — all 6 state × On combinations, action text on */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}
        >
          {STATES.flatMap((s) =>
            [false, true].map((isOn) => (
              <div
                key={`${s}-${isOn}`}
                style={{
                  padding: '20px 24px',
                  borderRadius: '10px',
                  border: '1px solid #f3f4f6',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  minHeight: '120px',
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
                  {t.variantCardLabel(s, isOn)}
                </p>
                <SwitchLive state={s} on={isOn} actionText={true} />
              </div>
            )),
          )}
        </div>
      </section>

      {/* -- 5. DESIGN TOKENS -------------------------------------------- */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.tokensTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.tokensLead}
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
                    width: '240px',
                  }}
                >
                  {t.tokensHeaderRole}
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  {t.tokensHeaderToken}
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
                  {t.tokensHeaderValue}
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
                  {t.tokensHeaderSwatch}
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
                    <td style={{ padding: '10px 16px', color: '#374151', fontWeight: 600 }}>
                      {t.tokenRoles[row.role] ?? row.role}
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
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.a11yLead}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {t.a11yRows.map(({ icon, title, body }) => (
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
              <span
                style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}
              >
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
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.usageTitle}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>
          {t.usageLead}
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '16px',
          }}
        >
          {t.usageRows.map(({ title, body }) => (
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
              {t.doLabel}
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
              {t.doItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.doItems.length - 1 ? '6px' : 0 }}>
                  {item}
                </li>
              ))}
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
              {t.dontLabel}
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
              {t.dontItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.dontItems.length - 1 ? '6px' : 0 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
