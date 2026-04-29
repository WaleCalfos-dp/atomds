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
    title: 'From 67 tokens to 14 primitives',
    leadPart1: 'Brand Switcher\'s "Brands" variable collection publishes ',
    leadPart2: '67 semantic tokens',
    leadPart3: ' (',
    leadPart4: ', ',
    leadPart5:
      '). For the White-label Portal we compressed that surface to 14 inputs by applying three rules, in order: (1) keep one primitive where Brand Switcher already assigns the same hex to a group of variables, (2) derive lightened/darkened variants algorithmically, (3) hard-code the handful of values that are universally white, black, or alpha-black across every Foundations library.',
    statPrimitives: 'primitive inputs',
    statDerived: 'derived tokens',
    statFixed: 'fixed values',
    rulesTitle: 'Derivation rules',
    rulePrimitiveLabel: '= primitive',
    rulePrimitiveDesc: 'Direct use — token value equals the primitive.',
    ruleOklchDesc:
      'Set perceptual lightness to N (0..1) preserving hue + chroma. Used for alert tints so all 4 feedback families look balanced.',
    ruleHslDesc: 'HSL mix toward white / black. Used for hover & pressed states.',
    ruleAlphaDesc: 'Apply alpha at X%. Used for focus rings + muted surfaces.',
    ruleFixedLabel: 'fixed',
    ruleFixedDesc: 'Hard-coded (white / black-alpha). Not user-editable.',
    rulesAppLabel: 'Rules of application',
    rulesAppLeadPart1:
      'Most "weird-looking" custom-brand renders trace back to a token used in the wrong tier — e.g. a Badge built on ',
    rulesAppLeadPart2: ' instead of ',
    rulesAppLeadPart3:
      ' reads as a faint blob on white surfaces. These rules document where each token belongs.',
    tierTitle: 'Tier guidance — when to use which background',
    tierLead: 'The 4 feedback families each ship 3 tiers. Pick by visual weight, not by hue.',
    colTier: 'Tier',
    colUseFor: 'Use for',
    colDontUseFor: "Don't use for",
    tierFullUse:
      'Solid feedback fills — Toast solid bg, success Badge with white text, Destructive button.',
    tierFullAvoid: 'Body text — contrast varies across brands; pair with white only.',
    tierLightUse:
      'Alert containers with title + body text. Calibrated to OKLCH L=0.92 — always readable for body copy.',
    tierLightAvoid: 'Compact UI like Badge — too prominent at small sizes.',
    tierLightestUse:
      'Subtle row tinting, callout backgrounds, hover overlays on coloured rows. OKLCH L=0.96 — very subtle wash.',
    tierLightestAvoid: 'Standalone Badge backgrounds — too faint to read as a chip.',
    pairingsTitle: 'Surface pairings — which fg goes with which bg',
    pairingsLead:
      'Mismatched fg/bg pairs are the #1 cause of low-contrast rendering. Use these defaults.',
    pairing1: 'white text on solid brand surface',
    pairing2: 'body text — or fg-brand-primary for emphasis',
    pairing3: 'body copy — pair with fg-{success/warning/...} only for icons + accents',
    pairing4: 'subtle hover/pressed wash — only over white surfaces',
    pairing5: 'modal scrim only — never put body copy on the overlay itself',
    fidelityTitle: '⚠ Fidelity warning',
    fidelityLeadPart1:
      'Simple-mode derivation approximates Brand Switcher\'s hand-curated tints. For brand primaries with very high chroma (vibrant pinks, purples, oranges > ~70% saturation), the OKLCH-derived ',
    fidelityLeadPart2:
      ' tints stay perceptually balanced but may not exactly match the values a designer would pick. ',
    fidelityLeadPart3: 'Switch to Full mode and override per-token',
    fidelityLeadPart4:
      ' if you need exact alignment with a real Foundations library (e.g. matching Mastercard\'s specific shade of warning yellow). Full mode bypasses derivation entirely — what you type is what ships.',
    primitivesSection: 'The 14 primitives',
    drivesPrefix: 'drives ',
    tokenSuffix: ' token',
    tokenPlural: 's',
    seenOn: 'Seen on: ',
    compressionSafePart1: 'Brand Switcher compresses ',
    compressionMidPart1: ' distinct variables',
    compressionSafePart2: ' (identical in every brand — safe)',
    compressionLossyPart2: ' (values diverge in some brands — lossy)',
    fixedTitle: 'Fixed values — not user-editable',
    fixedLeadPart1: '9 tokens aren\'t driven by any primitive. ',
    fixedLeadPart2: '5',
    fixedLeadPart3: ' are genuinely universal — every brand resolves them to the same hex. The other ',
    fixedLeadPart4: '4',
    fixedLeadPart5:
      ' are "mostly fixed": the portal uses a single sensible default, but Brand Switcher ships per-mode overrides you\'ll see in the live Atom library. If the defaults don\'t match a custom brand, override them in the exported CSS.',
    universalTitle: 'Universal across all 6 brands (',
    variesTitle: 'Mostly fixed — varies per brand (',
    closeParen: ')',
    variesLead:
      'The portal ships the default hex shown on the left. The 6 swatches below each row show what Brand Switcher actually resolves the token to for each built-in brand — swatches with a dashed amber border are brand-specific overrides that differ from the portal default.',
    portalDefault: 'Portal default',
  },
  zh: {
    chip: '工具 · 令牌映射',
    title: '从 67 个设计令牌到 14 个原语',
    leadPart1: 'Brand Switcher 的"Brands"变量集合发布了',
    leadPart2: '67 个语义化设计令牌',
    leadPart3: '（',
    leadPart4: '、',
    leadPart5:
      '）。在白标门户中，我们按以下三条规则依次将该表面压缩为 14 个输入：（1）当 Brand Switcher 已将同一十六进制值分配给一组变量时，保留一个原语；（2）用算法派生出变浅/变深的变体；（3）对于在每个基础库中都为白色、黑色或 alpha 黑色的少数值进行硬编码。',
    statPrimitives: '个原语输入',
    statDerived: '个派生令牌',
    statFixed: '个固定值',
    rulesTitle: '派生规则',
    rulePrimitiveLabel: '= 原语',
    rulePrimitiveDesc: '直接使用——令牌值等于原语。',
    ruleOklchDesc:
      '将感知亮度设置为 N（0..1），同时保留色相和色度。用于 alert 色调，使 4 个反馈家族看起来平衡。',
    ruleHslDesc: 'HSL 向白色/黑色混合。用于悬停和按下状态。',
    ruleAlphaDesc: '应用 X% 透明度。用于焦点环和柔和表面。',
    ruleFixedLabel: '固定',
    ruleFixedDesc: '硬编码（白色/黑色透明）。不可由用户编辑。',
    rulesAppLabel: '应用规则',
    rulesAppLeadPart1:
      '大多数"看起来奇怪"的自定义品牌渲染都可以追溯到令牌被用在错误的层级——例如使用 ',
    rulesAppLeadPart2: ' 而非 ',
    rulesAppLeadPart3:
      ' 构建的徽章在白色表面上显得很模糊。这些规则记录了每个令牌的归属位置。',
    tierTitle: '层级指南——何时使用哪种背景',
    tierLead: '4 个反馈家族每个都有 3 个层级。按视觉重量而非色相选择。',
    colTier: '层级',
    colUseFor: '用于',
    colDontUseFor: '不要用于',
    tierFullUse:
      '实色反馈填充——Toast 实色背景、带白色文字的成功徽章、破坏性按钮。',
    tierFullAvoid: '正文文本——各品牌对比度差异大；仅与白色搭配。',
    tierLightUse:
      '带标题和正文的 Alert 容器。校准到 OKLCH L=0.92——正文始终可读。',
    tierLightAvoid: '紧凑 UI 如徽章——在小尺寸下过于显眼。',
    tierLightestUse:
      '细微的行着色、提示框背景、彩色行上的悬停叠加。OKLCH L=0.96——非常细微的渲染。',
    tierLightestAvoid: '独立徽章背景——太淡而无法识别为 chip。',
    pairingsTitle: '表面搭配——哪个前景搭配哪个背景',
    pairingsLead:
      '前景/背景搭配错误是低对比度渲染的头号原因。请使用以下默认值。',
    pairing1: '在实色品牌表面上的白色文字',
    pairing2: '正文文本——或 fg-brand-primary 用于强调',
    pairing3: '正文文本——仅在图标和强调元素上搭配 fg-{success/warning/...}',
    pairing4: '细微的悬停/按下渲染——仅用于白色表面之上',
    pairing5: '仅用于模态遮罩——切勿在遮罩本身上放置正文文本',
    fidelityTitle: '⚠ 保真度警告',
    fidelityLeadPart1:
      '简单模式派生近似于 Brand Switcher 手工调校的色调。对于色度非常高的品牌主色（鲜艳的粉色、紫色、橙色 > ~70% 饱和度），通过 OKLCH 派生的 ',
    fidelityLeadPart2:
      ' 色调在感知上保持平衡，但可能与设计师手选的值不完全一致。',
    fidelityLeadPart3: '切换到完整模式并按单个令牌覆盖',
    fidelityLeadPart4:
      '，如果你需要与真实的基础库精确对齐（例如匹配 Mastercard 特定的警告黄色阴影）。完整模式完全绕过派生——你输入的就是发布的内容。',
    primitivesSection: '14 个原语',
    drivesPrefix: '驱动 ',
    tokenSuffix: ' 个令牌',
    tokenPlural: '',
    seenOn: '出现在：',
    compressionSafePart1: 'Brand Switcher 压缩了 ',
    compressionMidPart1: ' 个不同的变量',
    compressionSafePart2: '（在每个品牌中相同——安全）',
    compressionLossyPart2: '（在某些品牌中值有差异——有损）',
    fixedTitle: '固定值——不可由用户编辑',
    fixedLeadPart1: '9 个令牌不由任何原语驱动。',
    fixedLeadPart2: '5',
    fixedLeadPart3: ' 个真正通用——每个品牌都将它们解析为相同的十六进制值。另外 ',
    fixedLeadPart4: '4',
    fixedLeadPart5:
      ' 个为"基本固定"：门户使用单一合理的默认值，但 Brand Switcher 在实际 Atom 库中提供按模式覆盖。如果默认值与自定义品牌不匹配，请在导出的 CSS 中覆盖它们。',
    universalTitle: '在全部 6 个品牌中通用（',
    variesTitle: '基本固定——按品牌变化（',
    closeParen: '）',
    variesLead:
      '门户使用左侧显示的默认十六进制值。每行下方的 6 个色板显示 Brand Switcher 实际为每个内置品牌将令牌解析为的值——带虚线琥珀色边框的色板是与门户默认值不同的品牌特定覆盖。',
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
            <code className="font-mono text-slate-700 font-semibold">{t.rulePrimitiveLabel}</code>
            <p className="text-slate-500 mt-1">{t.rulePrimitiveDesc}</p>
          </div>
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <code className="font-mono text-slate-700 font-semibold">p @ OKLCH L=N</code>
            <p className="text-slate-500 mt-1">{t.ruleOklchDesc}</p>
          </div>
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <code className="font-mono text-slate-700 font-semibold">lighten(p, X%) / darken(p, X%)</code>
            <p className="text-slate-500 mt-1">{t.ruleHslDesc}</p>
          </div>
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <code className="font-mono text-slate-700 font-semibold">p @ X%</code>
            <p className="text-slate-500 mt-1">{t.ruleAlphaDesc}</p>
          </div>
          <div className="bg-white rounded-md p-3 border border-slate-200">
            <code className="font-mono text-slate-700 font-semibold">{t.ruleFixedLabel}</code>
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
