import { useMemo } from 'react';
import { type Brand, type SemanticTokenKey, RESOLVED_SEMANTIC_TOKENS, BRANDS } from '../data/tokens';
import { type Language } from '../data/languages';
import {
  type CorePrimitives,
  type TokenRule,
  DEFAULT_PRIMITIVES,
  PRIMITIVE_DESCRIPTORS,
  TOKEN_DERIVATION,
  deriveTokens,
  describeRule,
} from '../data/deriveTokens';
import { getCustomBrandSnapshot } from '../hooks/useCustomBrand';

interface MappingPageProps {
  brand: Brand;
  lang?: Language;
}

type PrimitiveKey = keyof CorePrimitives;

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    chip: 'Tools · Token Mapping',
    title: 'From 67 tokens to 14 colours you pick',
    leadPart1: 'Brand Switcher\'s "Brands" variable collection ships ',
    leadPart2: '67 colour tokens',
    leadPart3: ' (',
    leadPart4: ', ',
    leadPart5:
      '). The White-label Portal cuts that down to 14 colours you actually pick, then fills in the rest using a few simple rules: (1) when the same hex shows up against a whole group of tokens in every brand, just reuse one input; (2) for things like alert backgrounds and hover states, mix the input with white or black to hit a target shade; (3) the handful of tokens that are always white or always a transparent black are hard-coded.',
    statPrimitives: 'colours you pick',
    statDerived: 'colours we work out for you',
    statFixed: 'always-the-same colours',
    rulesTitle: 'How each derived colour is worked out',
    rulePrimitiveLabel: 'Same colour',
    rulePrimitiveDesc:
      'The token uses one of your input colours exactly, with no change.',
    ruleOklchLabel: 'Light tint',
    ruleOklchDesc:
      'Mix the input with white until it hits a target brightness — keeping the same hue. We use 92% brightness for alert containers and 96% for very subtle row backgrounds, so green/yellow/red/blue tints all look equally light side-by-side.',
    ruleLightenLabel: 'Darker / lighter',
    ruleHslDesc:
      'Blend the input with white (lighter) or black (darker) by a fixed percentage. Used for hover and pressed button states.',
    ruleAlphaLabel: 'Faded (see-through)',
    ruleAlphaDesc:
      'Show the input at reduced opacity so what\'s behind shows through. Used for focus rings, muted hovers, and modal overlays.',
    ruleFixedLabel: 'Always the same',
    ruleFixedDesc:
      'A hard-coded colour (usually pure white, black, or a transparent black). Doesn\'t depend on any input — you can\'t edit it.',
    rulesAppLabel: 'Where each token belongs',
    rulesAppLeadPart1:
      'Most "weird-looking" custom-brand renders trace back to using a token in the wrong place — e.g. a Badge built on ',
    rulesAppLeadPart2: ' instead of ',
    rulesAppLeadPart3:
      ' reads as a faint blob on white. The rules below say where each token is meant to be used.',
    tierTitle: 'Background tiers — pick by how heavy you want it to look',
    tierLead: 'Each of the 4 feedback colours (success/warning/error/info) comes in 3 strengths.',
    colTier: 'Token',
    colUseFor: 'Use for',
    colDontUseFor: "Don't use for",
    tierFullUse:
      'Solid feedback colours — Toast backgrounds, a success Badge with white text, the Destructive button.',
    tierFullAvoid: 'Body text — contrast varies brand-to-brand. Only pair with white.',
    tierLightUse:
      'Alert containers with a title and body text. We tune these to a fixed brightness so body copy always reads.',
    tierLightAvoid: 'Small UI like Badges — too heavy at small sizes.',
    tierLightestUse:
      'Subtle row tinting, callout backgrounds, hover washes over coloured rows. A very faint background wash.',
    tierLightestAvoid: 'Standalone Badge backgrounds — too faint to register as a chip.',
    pairingsTitle: 'Foreground / background combos that always work',
    pairingsLead:
      'Mismatched text-and-background pairs are the #1 cause of unreadable components. These pairings are safe across every brand.',
    pairing1: 'white text on a solid brand surface',
    pairing2: 'body text — or fg-brand-primary when you want extra emphasis',
    pairing3: 'body copy. Only pair with fg-{success/warning/...} for icons or small accents',
    pairing4: 'subtle hover or pressed wash — only on top of white surfaces',
    pairing5: 'modal scrim only — never put body copy directly on the overlay',
    fidelityTitle: '⚠ When the auto-derived values won\'t cut it',
    fidelityLeadPart1:
      'The 14-colour mode is an approximation. For very vibrant brand colours (saturated pinks, purples, oranges), the auto-generated ',
    fidelityLeadPart2:
      ' tints will stay balanced against each other but may not exactly match what a designer would pick by hand. ',
    fidelityLeadPart3: 'Switch to Full mode and edit individual tokens',
    fidelityLeadPart4:
      ' if you need to match a specific brand shade exactly (e.g. Mastercard\'s warning yellow). Full mode skips derivation completely — what you type is what gets used.',
    primitivesSection: 'The 14 colours you pick',
    drivesPrefix: 'controls ',
    tokenSuffix: ' token',
    tokenPlural: 's',
    seenOn: 'Used on: ',
    compressionSafePart1: 'This one input replaces ',
    compressionMidPart1: ' separate Brand Switcher variables',
    compressionSafePart2: ' (same value in every built-in brand — safe to combine)',
    compressionLossyPart2: ' (values differ in some brands — combining them is a small trade-off)',
    fixedTitle: 'Always-the-same colours — you can\'t edit these',
    fixedLeadPart1: '9 tokens don\'t come from any of your inputs. ',
    fixedLeadPart2: '5',
    fixedLeadPart3:
      ' are truly universal — every brand uses the same hex for them. The other ',
    fixedLeadPart4: '4',
    fixedLeadPart5:
      ' are "mostly fixed": the portal uses one sensible default, but the real Atom library ships per-brand overrides for them. If a default doesn\'t match your custom brand, edit the exported CSS by hand.',
    universalTitle: 'Same in every brand (',
    variesTitle: 'Mostly fixed — but does change in some brands (',
    closeParen: ')',
    variesLead:
      'The portal uses the default hex on the left. The 6 swatches below show the actual value each built-in brand uses for this token — swatches with a dashed amber border are the ones that differ from the portal default.',
    portalDefault: 'Portal default',
  },
  zh: {
    chip: '工具 · 令牌映射',
    title: '从 67 个令牌到 14 种你挑选的颜色',
    leadPart1: 'Brand Switcher 的"Brands"变量集合提供了 ',
    leadPart2: '67 个颜色令牌',
    leadPart3: '（',
    leadPart4: '、',
    leadPart5:
      '）。白标门户将其精简为 14 种你实际挑选的颜色，其余的由几条简单规则自动生成：（1）当某些令牌在所有品牌中共用同一个十六进制值时，只用一个输入；（2）alert 背景和悬停状态等，通过把输入和白色或黑色按比例混合来生成；（3）少数始终为白色或始终为透明黑色的令牌则硬编码。',
    statPrimitives: '种你挑选的颜色',
    statDerived: '个自动算出的颜色',
    statFixed: '个始终一致的颜色',
    rulesTitle: '每个派生颜色是怎么算出来的',
    rulePrimitiveLabel: '相同颜色',
    rulePrimitiveDesc: '令牌直接采用你输入的某个颜色，不做任何变化。',
    ruleOklchLabel: '浅色调',
    ruleOklchDesc:
      '把输入和白色按比例混合，直到达到目标亮度，同时保留同样的色相。我们用 92% 亮度做 alert 容器，用 96% 做非常细微的行背景，让绿/黄/红/蓝四种色调看起来同样浅。',
    ruleLightenLabel: '更浅 / 更深',
    ruleHslDesc: '把输入和白色（更浅）或黑色（更深）按固定百分比混合。用于按钮的悬停和按下状态。',
    ruleAlphaLabel: '半透明（可看穿）',
    ruleAlphaDesc:
      '让输入以较低不透明度显示，背后的内容透出来。用于焦点环、柔和的悬停背景和模态遮罩。',
    ruleFixedLabel: '始终一致',
    ruleFixedDesc:
      '硬编码颜色（通常是纯白、黑色或透明黑色）。不依赖任何输入——不可编辑。',
    rulesAppLabel: '每个令牌该用在哪里',
    rulesAppLeadPart1:
      '大多数"看起来奇怪"的自定义品牌渲染，问题都出在把令牌用错了地方——例如用 ',
    rulesAppLeadPart2: ' 替代 ',
    rulesAppLeadPart3:
      ' 来做徽章，结果在白色背景上几乎看不见。下面这些规则说明每个令牌应该用在哪里。',
    tierTitle: '背景层级——根据视觉重量来挑',
    tierLead: '4 种反馈颜色（成功/警告/错误/信息）每种都有 3 个强度。',
    colTier: '令牌',
    colUseFor: '用于',
    colDontUseFor: '不要用于',
    tierFullUse:
      '实色反馈颜色——Toast 背景、带白色文字的成功徽章、破坏性按钮。',
    tierFullAvoid: '正文文本——各品牌对比度差异大，只能搭配白色文字。',
    tierLightUse:
      '带标题和正文的 Alert 容器。我们将其调到固定亮度，确保正文始终可读。',
    tierLightAvoid: '小型 UI 如徽章——在小尺寸下显得过重。',
    tierLightestUse:
      '细微的行着色、提示框背景、彩色行上的悬停叠加。一种非常浅的背景渲染。',
    tierLightestAvoid: '独立徽章背景——太淡而无法识别为 chip。',
    pairingsTitle: '前景与背景的安全组合',
    pairingsLead:
      '前景和背景搭配错误是组件不可读的头号原因。下面这些组合在所有品牌下都安全。',
    pairing1: '在实色品牌表面上的白色文字',
    pairing2: '正文文本——或 fg-brand-primary 用于额外强调',
    pairing3: '正文文本。仅在图标和小型强调元素上搭配 fg-{success/warning/...}',
    pairing4: '细微的悬停或按下渲染——只用在白色表面之上',
    pairing5: '仅用于模态遮罩——切勿在遮罩本身上放置正文文本',
    fidelityTitle: '⚠ 自动派生的值不够用时',
    fidelityLeadPart1:
      '14 色模式只是一个近似。对于非常鲜艳的品牌色（饱和度高的粉色、紫色、橙色），自动生成的 ',
    fidelityLeadPart2:
      ' 色调彼此之间会保持平衡，但可能与设计师手选的值不完全一致。',
    fidelityLeadPart3: '切换到完整模式并按单个令牌编辑',
    fidelityLeadPart4:
      '，如果你需要精确匹配某个品牌的特定色调（例如 Mastercard 的警告黄色）。完整模式完全跳过派生——你输入什么就用什么。',
    primitivesSection: '你挑选的 14 种颜色',
    drivesPrefix: '控制 ',
    tokenSuffix: ' 个令牌',
    tokenPlural: '',
    seenOn: '使用位置：',
    compressionSafePart1: '这一个输入替代了 ',
    compressionMidPart1: ' 个独立的 Brand Switcher 变量',
    compressionSafePart2: '（在每个内置品牌中都是同一个值——可以放心合并）',
    compressionLossyPart2: '（在某些品牌中值有差异——合并是个小取舍）',
    fixedTitle: '始终一致的颜色——不可编辑',
    fixedLeadPart1: '9 个令牌不依赖你的任何输入。',
    fixedLeadPart2: '5',
    fixedLeadPart3: ' 个真正通用——每个品牌的取值都相同。另外 ',
    fixedLeadPart4: '4',
    fixedLeadPart5:
      ' 个属于"基本固定"：门户使用一个合理的默认值，但实际的 Atom 库中各品牌可能有自己的覆盖。如果默认值不适合你的自定义品牌，请在导出的 CSS 中手动调整。',
    universalTitle: '所有品牌中都相同（',
    variesTitle: '基本固定——但在某些品牌中会变化（',
    closeParen: '）',
    variesLead:
      '门户使用左侧的默认十六进制值。下方的 6 个色板显示每个内置品牌为该令牌实际使用的值——带虚线琥珀色边框的色板表示与门户默认值不同的品牌特定值。',
    portalDefault: '门户默认值',
  },
} as const;

// ─── Brand Switcher reconciliation notes ─────────────────────────────────────
// For each primitive, which Brand Switcher variables it subsumes, and whether
// those variables ship identical values across every Foundations library (the
// "safe" case) or diverge (the "lossy" case, flagged so the user knows what
// nuance is given up for the 13-primitive simplification).

type CompressionNote = {
  tokens: SemanticTokenKey[];       // Brand Switcher variables consolidated
  safeInAll: boolean;                // true = identical hex in every foundations lib
  noteEn?: string;                   // explanation when !safeInAll (English)
  noteZh?: string;                   // explanation when !safeInAll (Simplified Chinese)
};

const COMPRESSION_NOTES: Partial<Record<PrimitiveKey, CompressionNote>> = {
  link: {
    tokens: [
      'atom.foreground.core.fg-link',
      'atom.foreground.core.fg-interactive-icon',
      'atom.border.states.border-interactive',
    ],
    safeInAll: false,
    noteEn:
      'In DragonPass / Mastercard / Assurant these three share the same hex. In Visa and Greyscale fg-link collapses to #000 while fg-interactive-icon keeps brand primary. The portal treats them as one; edit the generated CSS by hand for per-token nuance.',
    noteZh:
      '在 DragonPass / Mastercard / Assurant 中，这三个共享相同的十六进制值。在 Visa 和 Greyscale 中，fg-link 折叠为 #000，而 fg-interactive-icon 保持品牌主色。门户将它们视为一个；如需按单个令牌微调，请手动编辑生成的 CSS。',
  },
  borderDefault: {
    tokens: [
      'atom.border.default.border-default',
      'atom.border.default.border-divider',
      'atom.border.states.border-disabled',
    ],
    safeInAll: false,
    noteEn:
      'DragonPass/Greyscale/Assurant keep all three identical. Investec differs border-divider (#e6e5e1) from border-default (#dbdad4) by ~2%. The portal uses the single borderDefault primitive; divider will look slightly heavier than Investec.',
    noteZh:
      'DragonPass/Greyscale/Assurant 三个保持相同。Investec 的 border-divider (#e6e5e1) 与 border-default (#dbdad4) 相差约 2%。门户使用单一的 borderDefault 原语；分割线看起来会比 Investec 稍微厚一些。',
  },
  textTertiary: {
    tokens: [
      'atom.foreground.core.fg-tertiary',
      'atom.foreground.states.fg-disabled',
    ],
    safeInAll: false,
    noteEn:
      'In DragonPass, fg-tertiary (#afaead) is lighter than fg-disabled (#91908f). The portal uses textTertiary for both. If you need disabled text to read darker than placeholders, override in the exported CSS block.',
    noteZh:
      '在 DragonPass 中，fg-tertiary (#afaead) 比 fg-disabled (#91908f) 浅。门户对两者都使用 textTertiary。如果你需要禁用文本比占位符更深，请在导出的 CSS 块中覆盖。',
  },
  backgroundSecondary: {
    tokens: [
      'atom.background.core.bg-secondary',
      'atom.background.primary.bg-primary-pressed-inverse',
      'atom.background.primary.bg-primary-disabled-inverse',
    ],
    safeInAll: true,
  },
  brandPrimary: {
    tokens: [
      'atom.foreground.primary.fg-brand-primary',
      'atom.foreground.primary.fg-brand-hover',
      'atom.background.primary.bg-primary-default',
      'atom.background.primary.bg-primary-focus',
      'atom.background.primary.bg-primary-pressed-brand',
      'atom.background.primary.accent',
      'atom.border.default.border-default-brand',
      'atom.border.selection-and-focus.border-primary-focus',
      'atom.border.selection-and-focus.border-selected',
      'atom.border.selection-and-focus.border-brand-hover',
    ],
    safeInAll: false,
    noteEn:
      'In Assurant, fg-brand-primary (#01194d) differs from bg-primary-default (#103265) — the darker shade is used for text, the mid shade for surfaces. The portal compresses both to brandPrimary. Assurant’s distinction is lost; re-introduce by editing the exported CSS for the two tokens.',
    noteZh:
      '在 Assurant 中，fg-brand-primary (#01194d) 与 bg-primary-default (#103265) 不同——较深的色调用于文本，中等色调用于表面。门户将两者都压缩为 brandPrimary。Assurant 的区分丢失；通过编辑导出的 CSS 中两个令牌来重新引入。',
  },
  accent: {
    tokens: ['atom.background.core.bg-accent'],
    safeInAll: false,
    noteEn:
      'Promoted to its own primitive in v2 — DragonPass uses #d53f34 (red), Investec #c1803d (gold), and Assurant #fcc166 (gold) as decorative accents that are deliberately distinct from brandPrimary. Earlier the portal collapsed bg-accent into brandPrimary, which gave the worst fidelity gap (avg RGB error ~212 across the 6 brands).',
    noteZh:
      '在 v2 中提升为独立原语——DragonPass 使用 #d53f34（红色）、Investec #c1803d（金色）、Assurant #fcc166（金色）作为有意与 brandPrimary 区分开的装饰性强调色。早先门户将 bg-accent 折叠到 brandPrimary 中，这造成了最大的保真度差距（在 6 个品牌中平均 RGB 误差约为 212）。',
  },
};

// ─── Fixed values ────────────────────────────────────────────────────────────
type FixedNote = { token: SemanticTokenKey; value: string; note: string };

const FIXED_VALUES: FixedNote[] = (Object.keys(TOKEN_DERIVATION) as SemanticTokenKey[])
  .filter((k) => TOKEN_DERIVATION[k].kind === 'fixed')
  .map((token) => {
    const rule = TOKEN_DERIVATION[token] as Extract<TokenRule, { kind: 'fixed' }>;
    return { token, value: rule.value, note: rule.note };
  });

// Tokens that genuinely resolve to the same hex in every built-in brand.
const UNIVERSAL_FIXED: SemanticTokenKey[] = [
  'atom.foreground.primary.fg-brand-primary-inverse',
  'atom.foreground.states.fg-disabled-inverse',
  'atom.foreground.states.fg-pressed-inverse',
  'atom.background.primary.bg-primary-inverse',
  'atom.progress-indicator.active-color',
];

// Tokens the portal treats as fixed, but Brand Switcher actually varies per mode.
const VARIES_PER_BRAND: SemanticTokenKey[] = [
  'atom.background.primary.bg-primary-hover-inverse',
  'atom.background.core.bg-overlay',
  'atom.border.default.border-muted',
  'atom.border.states.no-interaction',
];

const UNIVERSAL_FIXED_VALUES = FIXED_VALUES.filter((f) => UNIVERSAL_FIXED.includes(f.token));
const VARIES_PER_BRAND_VALUES = FIXED_VALUES.filter((f) => VARIES_PER_BRAND.includes(f.token));

// Only built-in brands — 'custom' shadows DragonPass, so skip it.
const BUILTIN_BRANDS = BRANDS.filter((b) => b.id !== 'custom');

// ─── MappingPage ─────────────────────────────────────────────────────────────
export function MappingPage({ brand, lang = 'en' }: MappingPageProps) {
  const t = COPY[lang];
  // Use current brand's effective tokens for the "computed value" column — so
  // designers on different brand pills see what tokens actually resolve to for
  // that brand. For the 'custom' brand, pull the user's primitives; otherwise
  // reverse-engineer them from the resolved dragonpass-style table.
  const { primitives, computed } = useMemo(() => {
    if (brand === 'custom') {
      const snap = getCustomBrandSnapshot();
      const p = snap?.primitives ?? DEFAULT_PRIMITIVES;
      return { primitives: p, computed: deriveTokens(p) };
    }
    return {
      primitives: DEFAULT_PRIMITIVES,
      computed: RESOLVED_SEMANTIC_TOKENS[brand],
    };
  }, [brand]);

  // Build inverted index: primitive → list of tokens that depend on it
  const tokensByPrimitive = useMemo(() => {
    const map: Record<PrimitiveKey, SemanticTokenKey[]> = {
      brandPrimary: [], brandHover: [], brandPressed: [], accent: [],
      textPrimary: [], textSecondary: [], textTertiary: [],
      link: [], backgroundSecondary: [], borderDefault: [],
      feedbackSuccess: [], feedbackWarning: [], feedbackError: [], feedbackInfo: [],
    };
    (Object.keys(TOKEN_DERIVATION) as SemanticTokenKey[]).forEach((key) => {
      const rule = TOKEN_DERIVATION[key];
      if (rule.kind !== 'fixed') {
        map[rule.from].push(key);
      }
    });
    return map;
  }, []);

  const primitiveOrder: PrimitiveKey[] = [
    'brandPrimary', 'brandHover', 'brandPressed', 'accent',
    'textPrimary', 'textSecondary', 'textTertiary',
    'link', 'backgroundSecondary', 'borderDefault',
    'feedbackSuccess', 'feedbackWarning', 'feedbackError', 'feedbackInfo',
  ];

  // Summary stats
  const totalTokens = Object.keys(TOKEN_DERIVATION).length;
  const fixedCount = FIXED_VALUES.length;
  const derivedCount = totalTokens - fixedCount;

  return (
    <div className="pb-16 space-y-10">
      {/* Header */}
      <header>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          {t.chip}
        </div>
        <h1 className="text-[32px] leading-[1.15] font-bold text-slate-900 tracking-tight mb-3">
          {t.title}
        </h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          {t.leadPart1}<strong>{t.leadPart2}</strong>{t.leadPart3}
          <code className="text-xs font-mono">atom/foreground/*</code>{t.leadPart4}
          <code className="text-xs font-mono">atom/background/*</code>{t.leadPart4}
          <code className="text-xs font-mono">atom/border/*</code>{t.leadPart4}
          <code className="text-xs font-mono">atom/progress-indicator/*</code>
          {t.leadPart5}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3 max-w-xl">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-2xl font-bold text-slate-900">14</div>
            <div className="text-xs text-slate-500 mt-1">{t.statPrimitives}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-2xl font-bold text-slate-900">{derivedCount}</div>
            <div className="text-xs text-slate-500 mt-1">{t.statDerived}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-2xl font-bold text-slate-900">{fixedCount}</div>
            <div className="text-xs text-slate-500 mt-1">{t.statFixed}</div>
          </div>
        </div>
      </header>

      {/* Legend */}
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">{t.rulesTitle}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <div className="text-slate-800 font-semibold">{t.rulePrimitiveLabel}</div>
            <p className="text-slate-500 mt-1">{t.rulePrimitiveDesc}</p>
          </div>
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <div className="text-slate-800 font-semibold">{t.ruleOklchLabel}</div>
            <p className="text-slate-500 mt-1">{t.ruleOklchDesc}</p>
          </div>
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <div className="text-slate-800 font-semibold">{t.ruleLightenLabel}</div>
            <p className="text-slate-500 mt-1">{t.ruleHslDesc}</p>
          </div>
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <div className="text-slate-800 font-semibold">{t.ruleAlphaLabel}</div>
            <p className="text-slate-500 mt-1">{t.ruleAlphaDesc}</p>
          </div>
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <div className="text-slate-800 font-semibold">{t.ruleFixedLabel}</div>
            <p className="text-slate-500 mt-1">{t.ruleFixedDesc}</p>
          </div>
        </div>
      </section>

      {/* Rules of application */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          {t.rulesAppLabel}
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl">
          {t.rulesAppLeadPart1}<code className="text-xs font-mono">bg-success-lightest</code>{t.rulesAppLeadPart2}
          <code className="text-xs font-mono">bg-success-light</code>{t.rulesAppLeadPart3}
        </p>

        {/* Tier guidance */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">{t.tierTitle}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{t.tierLead}</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-[20%]">{t.colTier}</th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-[40%]">{t.colUseFor}</th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-[40%]">{t.colDontUseFor}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3"><code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">bg-*-full</code></td>
                <td className="px-4 py-3 text-slate-700">{t.tierFullUse}</td>
                <td className="px-4 py-3 text-slate-500">{t.tierFullAvoid}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3"><code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">bg-*-light / bg-*-default</code></td>
                <td className="px-4 py-3 text-slate-700">{t.tierLightUse}</td>
                <td className="px-4 py-3 text-slate-500">{t.tierLightAvoid}</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">bg-*-lightest</code></td>
                <td className="px-4 py-3 text-slate-700">{t.tierLightestUse}</td>
                <td className="px-4 py-3 text-slate-500">{t.tierLightestAvoid}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Surface pairings */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">{t.pairingsTitle}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{t.pairingsLead}</p>
          </div>
          <ul className="divide-y divide-slate-100 text-sm">
            <li className="px-5 py-2.5 flex items-baseline gap-3">
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">bg-primary-default</code>
              <span className="text-slate-400">⇄</span>
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">fg-brand-primary-inverse</code>
              <span className="text-slate-500 text-xs">{t.pairing1}</span>
            </li>
            <li className="px-5 py-2.5 flex items-baseline gap-3">
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">bg-primary-inverse</code>
              <span className="text-slate-400">⇄</span>
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">fg-primary</code>
              <span className="text-slate-500 text-xs">{t.pairing2}</span>
            </li>
            <li className="px-5 py-2.5 flex items-baseline gap-3 flex-wrap">
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">bg-{'{success,warning,error,info}'}-{'{light,lightest}'}</code>
              <span className="text-slate-400">⇄</span>
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">fg-primary</code>
              <span className="text-slate-500 text-xs">{t.pairing3}</span>
            </li>
            <li className="px-5 py-2.5 flex items-baseline gap-3">
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">bg-muted</code>
              <span className="text-slate-400">⇄</span>
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">fg-primary</code>
              <span className="text-slate-500 text-xs">{t.pairing4}</span>
            </li>
            <li className="px-5 py-2.5 flex items-baseline gap-3">
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">bg-overlay</code>
              <span className="text-slate-400">⇄</span>
              <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">fg-brand-primary-inverse</code>
              <span className="text-slate-500 text-xs">{t.pairing5}</span>
            </li>
          </ul>
        </div>

        {/* Fidelity warning */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 leading-relaxed">
          <strong className="block text-sm mb-1">{t.fidelityTitle}</strong>
          {t.fidelityLeadPart1}<code className="font-mono">bg-*-lightest</code>
          {t.fidelityLeadPart2}<strong>{t.fidelityLeadPart3}</strong>{t.fidelityLeadPart4}
        </div>
      </section>

      {/* The 14 primitives, each with their driven tokens */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          {t.primitivesSection}
        </h2>
        {primitiveOrder.map((pk) => {
          const descriptor = PRIMITIVE_DESCRIPTORS[pk];
          const tokens = tokensByPrimitive[pk];
          const compression = COMPRESSION_NOTES[pk];
          const primitiveHex = primitives[pk];

          return (
            <div key={pk} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              {/* Primitive header */}
              <div className="p-5 border-b border-slate-100 flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg border border-slate-200 flex-shrink-0"
                  style={{ backgroundColor: primitiveHex }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900">{descriptor.label}</h3>
                    <code className="text-xs font-mono text-slate-500">{pk}</code>
                    <code className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {primitiveHex}
                    </code>
                    <span className="text-xs text-slate-500">
                      {t.drivesPrefix}<strong>{tokens.length}</strong>{t.tokenSuffix}{tokens.length === 1 ? '' : t.tokenPlural}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    <span className="font-medium text-slate-700">{t.seenOn}</span>
                    {descriptor.seenOn}
                  </p>
                </div>
              </div>

              {/* Compression note */}
              {compression && (
                <div
                  className={[
                    'px-5 py-3 border-b border-slate-100 text-xs flex gap-2',
                    compression.safeInAll
                      ? 'bg-green-50 text-green-800 border-green-100'
                      : 'bg-amber-50 text-amber-900 border-amber-100',
                  ].join(' ')}
                >
                  <span className="flex-shrink-0 mt-0.5">
                    {compression.safeInAll ? '✓' : '⚠'}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium mb-0.5">
                      {t.compressionSafePart1}{compression.tokens.length}{t.compressionMidPart1}
                      {compression.safeInAll ? t.compressionSafePart2 : t.compressionLossyPart2}
                    </div>
                    <div className="font-mono text-[11px] leading-relaxed opacity-90 mb-1">
                      {compression.tokens.join(' · ')}
                    </div>
                    {(lang === 'zh' ? compression.noteZh : compression.noteEn) && (
                      <div className="leading-relaxed">
                        {lang === 'zh' ? compression.noteZh : compression.noteEn}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tokens driven */}
              <div className="divide-y divide-slate-100">
                {tokens.map((tk) => {
                  const rule = TOKEN_DERIVATION[tk];
                  const computedHex = computed[tk];
                  return (
                    <div key={tk} className="px-5 py-2.5 flex items-center gap-3 text-sm hover:bg-slate-50">
                      <div
                        className="w-5 h-5 rounded border border-slate-200 flex-shrink-0"
                        style={{ backgroundColor: computedHex }}
                      />
                      <code className="text-xs font-mono text-slate-800 flex-shrink-0 w-[260px] truncate" title={tk}>
                        {tk.replace('atom.', '')}
                      </code>
                      <code className="text-[11px] font-mono text-indigo-600 flex-shrink-0 w-[180px] truncate">
                        {describeRule(rule)}
                      </code>
                      <code className="text-[11px] font-mono text-slate-500 flex-shrink-0">
                        {computedHex}
                      </code>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Fixed values */}
      <section className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
            {t.fixedTitle}
          </h2>
          <p className="text-sm text-slate-600 mb-4 max-w-3xl">
            {t.fixedLeadPart1}<strong>{t.fixedLeadPart2}</strong>{t.fixedLeadPart3}
            <strong>{t.fixedLeadPart4}</strong>{t.fixedLeadPart5}
          </p>
        </div>

        {/* Universally fixed */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
            {t.universalTitle}{UNIVERSAL_FIXED_VALUES.length}{t.closeParen}
          </h3>
          <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
            {UNIVERSAL_FIXED_VALUES.map((f) => (
              <div key={f.token} className="px-5 py-3 flex items-center gap-3 text-sm">
                <div
                  className="w-5 h-5 rounded border border-slate-200 flex-shrink-0"
                  style={{ backgroundColor: f.value }}
                />
                <code className="text-xs font-mono text-slate-800 flex-shrink-0 w-[320px] truncate">
                  {f.token.replace('atom.', '')}
                </code>
                <code className="text-[11px] font-mono text-slate-500 flex-shrink-0 w-[84px]">
                  {f.value}
                </code>
                <span className="text-xs text-slate-600 flex-1 min-w-0">{f.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mostly fixed — varies per brand */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
            {t.variesTitle}{VARIES_PER_BRAND_VALUES.length}{t.closeParen}
          </h3>
          <p className="text-xs text-slate-500 mb-3 max-w-3xl">
            {t.variesLead}
          </p>
          <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
            {VARIES_PER_BRAND_VALUES.map((f) => (
              <div key={f.token} className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div
                    className="w-5 h-5 rounded border border-slate-200 flex-shrink-0"
                    style={{ backgroundColor: f.value }}
                  />
                  <code className="text-xs font-mono text-slate-800 flex-shrink-0 w-[320px] truncate">
                    {f.token.replace('atom.', '')}
                  </code>
                  <code className="text-[11px] font-mono text-slate-500 flex-shrink-0 w-[84px]">
                    {f.value}
                  </code>
                  <span className="text-xs text-slate-600 flex-1 min-w-0">{t.portalDefault}</span>
                </div>
                <div className="pl-8 grid grid-cols-6 gap-2">
                  {BUILTIN_BRANDS.map((b) => {
                    const resolved = RESOLVED_SEMANTIC_TOKENS[b.id][f.token];
                    const differs = resolved.toLowerCase() !== f.value.toLowerCase();
                    return (
                      <div key={b.id} className="flex flex-col gap-1">
                        <div
                          className={[
                            'h-8 rounded flex-shrink-0',
                            differs
                              ? 'border-2 border-dashed border-amber-400'
                              : 'border border-slate-200',
                          ].join(' ')}
                          style={{ backgroundColor: resolved }}
                          title={`${b.label}: ${resolved}`}
                        />
                        <div className="text-[10px] text-slate-500 truncate">{b.label}</div>
                        <code className="text-[10px] font-mono text-slate-400 truncate">
                          {resolved}
                        </code>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
