import { useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Brand, type BrandTokens, type SemanticTokenKey } from '../data/tokens';
import { type Language } from '../data/languages';
import {
  type AccessibilityCheck,
  type CorePrimitives,
  type CustomBrand,
  type CustomBrandMode,
  DEFAULT_PRIMITIVES,
  FONT_PRESETS,
  PRIMITIVE_DESCRIPTORS,
  TOKEN_DERIVATION,
  TOKEN_GROUP_ORDER,
  TOKEN_INFO,
  auditTokens,
  deriveTokens,
  describeRule,
  generateCss,
  tokensInGroup,
} from '../data/deriveTokens';
import { ButtonLive } from '../components/button/ButtonLive';
import { AlertLive } from '../components/alert/AlertLive';
import { BadgeLive } from '../components/badge/BadgeLive';
import { InputLive } from '../components/input/InputLive';
import { CardLive } from '../components/card/CardLive';
import { ProgressIndicatorLive } from '../components/progress-indicator/ProgressIndicatorLive';
import { BreadcrumbsLive } from '../components/breadcrumbs/BreadcrumbsLive';

interface PortalPageProps {
  customBrand: CustomBrand | null;
  setCustomBrand: (brand: CustomBrand) => void;
  clearCustomBrand: () => void;
  setBrand: (brand: Brand) => void;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    title: 'White-label Portal',
    leadDesc:
      "Define a brand that mirrors Brand Switcher's token structure. Switch between Simple (14 primitives, auto-derived) and Full (all 67 tokens, explicit) based on how much control you need.",
    modeSimpleLabel: 'Simple',
    modeSimpleCount: '14 primitives',
    modeSimpleHint:
      'Edit 14 brand colors; the portal derives the rest via HSL lighten/darken/alpha rules.',
    modeFullLabel: 'Full',
    modeFullCount: '67 tokens',
    modeFullHint:
      'Edit every Brand Switcher variable individually. No derivation — what you see is what ships.',
    applySave: 'Apply & Save',
    copied: 'Copied!',
    copyCss: 'Copy CSS block',
    clearCustom: 'Clear custom brand',
    viewComponents: 'View components with active brand →',
    savedAs: 'Saved as',
    savedSuffix: ' — active in TopBar, persists across reloads.',
    confirmModeSwitch:
      'Switching to Simple will discard your per-token edits and re-derive all 67 tokens from the 13 primitives. Continue?',
    auditAllPassPart1: 'Accessibility — all ',
    auditAllPassPart2: ' pairings meet WCAG AA (4.5:1)',
    auditFailPart1: 'Accessibility — ',
    auditFailPart2: ' of ',
    auditFailPart3: ' pairings fail WCAG AA',
    auditChecksRun:
      'Checks run on every change against component pairings that paint text on white or brand surfaces.',
    needsPrefix: 'needs ≥ ',
    needsSuffix: ' : 1',
    suggestionLabel: 'Suggestion:',
    applyToPrefix: 'Apply to ',
    noNearbyAccessible:
      'Could not find a nearby accessible color. Consider a completely different shade.',
    identitySection: 'Identity',
    brandName: 'Brand name',
    brandNamePlaceholder: 'e.g. Acme',
    fontFamily: 'Font family',
    fontFamilyHintPart1: "Maps to Brand Switcher's ",
    fontFamilyHintPart2: '. Drives ',
    fontFamilyHintPart3: ' across all 42+ components that read it.',
    logoUrl: 'Logo URL',
    logoUrlPlaceholder: 'https://… or leave blank to upload',
    uploadFile: 'Upload file',
    logoAlt: 'logo preview',
    remove: 'Remove',
    fullModeBannerLabel: 'Full mode.',
    fullModeBannerLeadPart1: " You're editing all 67 tokens directly. No derivation — changes here do not cascade. The ",
    fullModeBannerLeadPart2: ' and ',
    fullModeBannerLeadPart3:
      " descriptions below come from Brand Switcher's variable catalogue so you know where each token gets painted.",
    tokenSuffix: ' token',
    tokenPlural: 's',
    drives: 'Drives: ',
    seenOn: 'Seen on: ',
    simpleRule: 'Simple rule: ',
    livePreview: 'Live preview',
    reactsToFormChanges: 'Reacts to form changes in real time · ',
    modeWord: ' mode',
    previewButton: 'Button',
    previewAlert: 'Alert (feedback colors)',
    previewBadge: 'Badge',
    previewInput: 'Input',
    previewCard: 'Card',
    previewProgress: 'Progress indicator',
    previewBreadcrumbs: 'Breadcrumbs',
    btnPrimary: 'Primary',
    btnSecondary: 'Secondary',
    btnDelete: 'Delete',
    btnDisabled: 'Disabled',
    alertSuccessTitle: 'Payment received',
    alertSuccessDesc: 'Your order is on its way.',
    alertWarningTitle: 'Session expiring',
    alertWarningDesc: "You'll be signed out in 2 minutes.",
    alertErrorTitle: 'Could not save',
    alertErrorDesc: 'Check your connection and try again.',
    alertInfoTitle: 'New feature',
    alertInfoDesc: 'We updated the dashboard layout.',
    badgeBrand: 'Brand',
    badgeSuccess: 'Success',
    badgeWarning: 'Warning',
    badgeError: 'Error',
    badgeInfo: 'Info',
    badgeMuted: 'Muted',
    inputDefaultLabel: 'Default',
    inputTypePlaceholder: 'Type something…',
    inputHelperText: 'Helper text in secondary color',
    inputFocusedLabel: 'Focused',
    inputFocusedPlaceholder: 'Focused state',
    inputErrorLabel: 'Error',
    inputErrorPlaceholder: 'Invalid value',
    inputErrorHelper: 'Something went wrong',
    cardTitle: 'Welcome to your dashboard',
    cardBody:
      'Track orders, redeem offers, and manage benefits — all in one place.',
    cardAction: 'Learn more',
    progressUploading: 'Uploading',
    progressStep: 'Step 2 of 4',
    crumbHome: 'Home',
    crumbAccount: 'Account',
    crumbPreferences: 'Preferences',
    cssBlockTitle: 'Generated CSS block (all 67 tokens)',
  },
  zh: {
    title: '白标门户',
    leadDesc:
      '定义一个镜像 Brand Switcher 令牌结构的品牌。根据所需的控制程度，在简单模式（14 个原语，自动派生）和完整模式（全部 67 个令牌，显式设置）之间切换。',
    modeSimpleLabel: '简单',
    modeSimpleCount: '14 个原语',
    modeSimpleHint:
      '编辑 14 个品牌颜色；门户通过 HSL 变浅/变深/透明度规则派生其余令牌。',
    modeFullLabel: '完整',
    modeFullCount: '67 个令牌',
    modeFullHint:
      '逐个编辑每个 Brand Switcher 变量。不派生——所见即所发。',
    applySave: '应用并保存',
    copied: '已复制！',
    copyCss: '复制 CSS 块',
    clearCustom: '清除自定义品牌',
    viewComponents: '使用活跃品牌查看组件 →',
    savedAs: '已保存为',
    savedSuffix: ' —— 在顶栏中活跃，跨重载持久保存。',
    confirmModeSwitch:
      '切换到简单模式将丢弃你对单个令牌的编辑，并从 13 个原语重新派生全部 67 个令牌。继续？',
    auditAllPassPart1: '可访问性 —— 全部 ',
    auditAllPassPart2: ' 个搭配满足 WCAG AA（4.5:1）',
    auditFailPart1: '可访问性 —— ',
    auditFailPart2: ' / ',
    auditFailPart3: ' 个搭配未通过 WCAG AA',
    auditChecksRun:
      '每次变更都会针对在白色或品牌表面上绘制文字的组件搭配进行检查。',
    needsPrefix: '需要 ≥ ',
    needsSuffix: ' : 1',
    suggestionLabel: '建议：',
    applyToPrefix: '应用到 ',
    noNearbyAccessible:
      '找不到附近的可访问颜色。请考虑使用完全不同的色调。',
    identitySection: '身份',
    brandName: '品牌名称',
    brandNamePlaceholder: '例如 Acme',
    fontFamily: '字体',
    fontFamilyHintPart1: '映射到 Brand Switcher 的 ',
    fontFamilyHintPart2: '。驱动所有读取它的 42+ 个组件中的 ',
    fontFamilyHintPart3: '。',
    logoUrl: '标志 URL',
    logoUrlPlaceholder: 'https://… 或留空以上传',
    uploadFile: '上传文件',
    logoAlt: '标志预览',
    remove: '移除',
    fullModeBannerLabel: '完整模式。',
    fullModeBannerLeadPart1: ' 你正在直接编辑全部 67 个令牌。不派生 —— 这里的变更不会级联。下方的 ',
    fullModeBannerLeadPart2: ' 和 ',
    fullModeBannerLeadPart3:
      ' 描述来自 Brand Switcher 的变量目录，便于你了解每个令牌的绘制位置。',
    tokenSuffix: ' 个令牌',
    tokenPlural: '',
    drives: '驱动：',
    seenOn: '出现在：',
    simpleRule: '简单规则：',
    livePreview: '实时预览',
    reactsToFormChanges: '实时响应表单变更 · ',
    modeWord: ' 模式',
    previewButton: '按钮',
    previewAlert: 'Alert（反馈颜色）',
    previewBadge: '徽章',
    previewInput: '输入框',
    previewCard: '卡片',
    previewProgress: '进度指示器',
    previewBreadcrumbs: '面包屑',
    btnPrimary: '主要',
    btnSecondary: '次要',
    btnDelete: '删除',
    btnDisabled: '禁用',
    alertSuccessTitle: '付款已收到',
    alertSuccessDesc: '你的订单正在送出。',
    alertWarningTitle: '会话即将过期',
    alertWarningDesc: '你将在 2 分钟内被登出。',
    alertErrorTitle: '无法保存',
    alertErrorDesc: '请检查你的连接并重试。',
    alertInfoTitle: '新功能',
    alertInfoDesc: '我们更新了仪表盘布局。',
    badgeBrand: '品牌',
    badgeSuccess: '成功',
    badgeWarning: '警告',
    badgeError: '错误',
    badgeInfo: '信息',
    badgeMuted: '柔和',
    inputDefaultLabel: '默认',
    inputTypePlaceholder: '输入内容……',
    inputHelperText: '次要颜色的辅助文本',
    inputFocusedLabel: '聚焦',
    inputFocusedPlaceholder: '聚焦状态',
    inputErrorLabel: '错误',
    inputErrorPlaceholder: '无效值',
    inputErrorHelper: '发生错误',
    cardTitle: '欢迎来到你的仪表盘',
    cardBody: '追踪订单、兑换优惠、管理权益——一站式完成。',
    cardAction: '了解更多',
    progressUploading: '上传中',
    progressStep: '第 2 步，共 4 步',
    crumbHome: '首页',
    crumbAccount: '账户',
    crumbPreferences: '偏好设置',
    cssBlockTitle: '生成的 CSS 块（全部 67 个令牌）',
  },
} as const;

// ─── Form grouping for Simple mode ────────────────────────────────────────────
type PrimitiveKey = keyof CorePrimitives;

type SimpleGroup = {
  titleKey: 'coreBrand' | 'text' | 'neutralLink' | 'feedback';
  keys: PrimitiveKey[];
};

const SIMPLE_GROUPS: SimpleGroup[] = [
  { titleKey: 'coreBrand', keys: ['brandPrimary', 'brandHover', 'brandPressed', 'accent'] },
  { titleKey: 'text', keys: ['textPrimary', 'textSecondary', 'textTertiary'] },
  { titleKey: 'neutralLink', keys: ['link', 'backgroundSecondary', 'borderDefault'] },
  { titleKey: 'feedback', keys: ['feedbackSuccess', 'feedbackWarning', 'feedbackError', 'feedbackInfo'] },
];

const SIMPLE_GROUP_LABELS = {
  en: {
    coreBrand: 'Core brand',
    text: 'Text',
    neutralLink: 'Neutral & link',
    feedback: 'Feedback',
  },
  zh: {
    coreBrand: '核心品牌',
    text: '文本',
    neutralLink: '中性与链接',
    feedback: '反馈',
  },
} as const;

// Token → CSS var (same table generateCss uses; duplicated here so preview
// inline style doesn't have to import from tokens.ts).
const CSS_VAR_FOR: Record<SemanticTokenKey, string> = Object.fromEntries(
  (Object.keys(TOKEN_DERIVATION) as SemanticTokenKey[]).map((k) => [
    k,
    '--atom-' + k.replace(/^atom\./, '').replace(/\./g, '-'),
  ]),
) as Record<SemanticTokenKey, string>;

// ─── Tiny color input (shared by Simple and Full modes) ──────────────────────
function ColorSwatchInput({
  value,
  onChange,
  label,
  subtitle,
  extra,
  compact = false,
}: {
  value: string;
  onChange: (next: string) => void;
  label: string;
  subtitle?: string;
  extra?: React.ReactNode;
  compact?: boolean;
}) {
  // <input type="color"> requires 6-digit hex with no alpha.
  const safeValue = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000';
  return (
    <div className={compact ? 'py-2' : 'py-3 border-b border-slate-100 last:border-0'}>
      <div className="flex items-center gap-3">
        <input
          type="color"
          aria-label={label}
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded-md cursor-pointer flex-shrink-0 border border-slate-200 bg-white p-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-800">{label}</span>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              spellCheck={false}
              className="w-24 px-2 py-0.5 text-xs font-mono border border-slate-200 rounded bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {subtitle && (
            <p className={compact ? 'text-[11px] leading-tight text-slate-500 mt-0.5' : 'text-[11px] leading-tight text-slate-500 mt-1'}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {extra}
    </div>
  );
}

// ─── PortalPage ──────────────────────────────────────────────────────────────
export function PortalPage({
  customBrand,
  setCustomBrand,
  clearCustomBrand,
  setBrand,
  lang = 'en',
}: PortalPageProps) {
  const t = COPY[lang];
  const groupLabels = SIMPLE_GROUP_LABELS[lang];
  const navigate = useNavigate();

  // Seed form state from saved custom brand (if any), else defaults.
  const [mode, setMode] = useState<CustomBrandMode>(customBrand?.mode ?? 'simple');
  const [name, setName] = useState(customBrand?.name ?? 'Acme');
  const [logo, setLogo] = useState(customBrand?.logo ?? '');
  const [font, setFont] = useState(customBrand?.font ?? FONT_PRESETS[0].value);
  const [primitives, setPrimitives] = useState<CorePrimitives>(
    customBrand?.primitives ?? DEFAULT_PRIMITIVES,
  );
  const [fullTokens, setFullTokens] = useState<BrandTokens>(
    customBrand?.tokens ?? deriveTokens(customBrand?.primitives ?? DEFAULT_PRIMITIVES),
  );
  const [copied, setCopied] = useState(false);

  // Effective token set for preview and audit. In simple mode we derive; in
  // full mode we use the user's explicit edits.
  const effectiveTokens = useMemo<BrandTokens>(
    () => (mode === 'simple' ? deriveTokens(primitives) : fullTokens),
    [mode, primitives, fullTokens],
  );

  const audit = useMemo(() => auditTokens(effectiveTokens, mode), [effectiveTokens, mode]);
  const failing = audit.filter((c) => !c.passes);

  // Preview inline CSS vars.
  const previewStyle = useMemo<CSSProperties>(() => {
    const css: Record<string, string> = {};
    (Object.keys(CSS_VAR_FOR) as SemanticTokenKey[]).forEach((k) => {
      css[CSS_VAR_FOR[k]] = effectiveTokens[k];
    });
    return css as CSSProperties;
  }, [effectiveTokens]);

  const updatePrimitive = (key: PrimitiveKey, value: string) =>
    setPrimitives((prev) => ({ ...prev, [key]: value }));

  const updateToken = (key: SemanticTokenKey, value: string) =>
    setFullTokens((prev) => ({ ...prev, [key]: value }));

  const onLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(file);
  };

  // Mode switch — Simple→Full seeds the 67 tokens from the current primitives
  // so the user keeps what they had. Full→Simple keeps primitives unchanged
  // but discards individual token overrides (we warn before doing it).
  const handleModeChange = (nextMode: CustomBrandMode) => {
    if (nextMode === mode) return;
    if (nextMode === 'full') {
      setFullTokens(deriveTokens(primitives));
      setMode('full');
    } else {
      // Simple mode — warn if there are per-token edits about to be lost.
      const derivedFromPrims = deriveTokens(primitives);
      const hasOverrides = (Object.keys(derivedFromPrims) as SemanticTokenKey[]).some(
        (k) => derivedFromPrims[k].toLowerCase() !== fullTokens[k]?.toLowerCase(),
      );
      if (hasOverrides) {
        const ok = window.confirm(t.confirmModeSwitch);
        if (!ok) return;
      }
      setMode('simple');
    }
  };

  const handleApply = () => {
    const next: CustomBrand = {
      name: name.trim() || 'Custom',
      logo,
      font,
      mode,
      primitives,
      tokens: mode === 'full' ? fullTokens : undefined,
    };
    setCustomBrand(next);
    setBrand('custom');
  };

  const handleClear = () => {
    clearCustomBrand();
    setBrand('dragonpass');
    setName('Acme');
    setLogo('');
    setFont(FONT_PRESETS[0].value);
    setPrimitives(DEFAULT_PRIMITIVES);
    setFullTokens(deriveTokens(DEFAULT_PRIMITIVES));
    setMode('simple');
  };

  const handleCopyCss = async () => {
    const css = generateCss(effectiveTokens, '[data-brand="custom"]', primitives, font);
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const applySuggestion = (check: AccessibilityCheck) => {
    if (!check.suggestion) return;
    if (mode === 'simple' && check.suggestedPrimitive) {
      setPrimitives((prev) => ({ ...prev, [check.suggestedPrimitive!]: check.suggestion! }));
    } else if (mode === 'full' && check.suggestedToken) {
      setFullTokens((prev) => ({ ...prev, [check.suggestedToken!]: check.suggestion! }));
    }
  };

  const isSaved = Boolean(customBrand);

  return (
    <div className="pb-16">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
            <p className="text-sm text-slate-600 mt-1">{t.leadDesc}</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="mt-5 inline-flex items-stretch rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          {(
            [
              {
                id: 'simple' as const,
                label: t.modeSimpleLabel,
                count: t.modeSimpleCount,
                hint: t.modeSimpleHint,
              },
              {
                id: 'full' as const,
                label: t.modeFullLabel,
                count: t.modeFullCount,
                hint: t.modeFullHint,
              },
            ] as const
          ).map((opt) => {
            const active = mode === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleModeChange(opt.id)}
                title={opt.hint}
                className={[
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100',
                ].join(' ')}
              >
                <span className="block text-left">{opt.label}</span>
                <span className={['block text-[10px]', active ? 'text-slate-300' : 'text-slate-400'].join(' ')}>
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action bar */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            {t.applySave}
          </button>
          <button
            onClick={handleCopyCss}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            {copied ? t.copied : t.copyCss}
          </button>
          {isSaved && (
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
            >
              {t.clearCustom}
            </button>
          )}
          <button
            onClick={() => navigate('/components/button')}
            className="ml-auto px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {t.viewComponents}
          </button>
        </div>

        {isSaved && (
          <p className="mt-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {t.savedAs} "{customBrand?.name}" ({customBrand?.mode})
            </span>{' '}
            {t.savedSuffix}
          </p>
        )}
      </header>

      {/* Accessibility audit (works in both modes) */}
      <section
        className={[
          'mb-6 rounded-xl border shadow-sm overflow-hidden',
          failing.length === 0
            ? 'bg-green-50 border-green-200'
            : 'bg-amber-50 border-amber-200',
        ].join(' ')}
      >
        <div className="px-5 py-4 flex items-center gap-3">
          <div
            className={[
              'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold',
              failing.length === 0 ? 'bg-green-500' : 'bg-amber-500',
            ].join(' ')}
            aria-hidden="true"
          >
            {failing.length === 0 ? '✓' : '!'}
          </div>
          <div className="flex-1">
            <h2
              className={[
                'text-sm font-semibold',
                failing.length === 0 ? 'text-green-900' : 'text-amber-900',
              ].join(' ')}
            >
              {failing.length === 0
                ? `${t.auditAllPassPart1}${audit.length}${t.auditAllPassPart2}`
                : `${t.auditFailPart1}${failing.length}${t.auditFailPart2}${audit.length}${t.auditFailPart3}`}
            </h2>
            <p
              className={[
                'text-xs mt-0.5',
                failing.length === 0 ? 'text-green-700' : 'text-amber-800',
              ].join(' ')}
            >
              {t.auditChecksRun}
            </p>
          </div>
        </div>

        {failing.length > 0 && (
          <div className="divide-y divide-amber-200 border-t border-amber-200 bg-white">
            {failing.map((check) => {
              const targetLabel =
                check.suggestedPrimitive ?? check.suggestedToken?.replace('atom.', '');
              return (
                <div key={check.id} className="px-5 py-3 flex items-start gap-4 text-sm">
                  <div className="flex-shrink-0 flex items-center gap-1.5 pt-0.5">
                    <div className="w-4 h-4 rounded border border-slate-200" style={{ backgroundColor: check.bg }} aria-hidden="true" />
                    <div className="w-4 h-4 rounded border border-slate-200" style={{ backgroundColor: check.fg }} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-medium text-slate-900">{check.label}</span>
                      <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-100">
                        {check.actual.toFixed(2)} : 1
                      </code>
                      <span className="text-xs text-slate-500">{t.needsPrefix}{check.target}{t.needsSuffix}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{check.description}</p>
                    {check.suggestion && targetLabel && (
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-600">{t.suggestionLabel}</span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                          <span className="w-3 h-3 rounded border border-slate-300 flex-shrink-0" style={{ backgroundColor: check.suggestion }} />
                          {check.suggestion}
                        </span>
                        <button
                          onClick={() => applySuggestion(check)}
                          className="text-xs font-medium px-2 py-0.5 rounded bg-slate-900 text-white hover:bg-slate-700"
                        >
                          {t.applyToPrefix}{targetLabel}
                        </button>
                      </div>
                    )}
                    {!check.suggestion && (
                      <div className="mt-2 text-xs text-slate-600">
                        {t.noNearbyAccessible}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: form (shape differs per mode) ──────────────────────────── */}
        <div className="space-y-6">
          {/* Identity card — shared */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">
              {t.identitySection}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.brandName}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.brandNamePlaceholder}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.fontFamily}</label>
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: font }}
                >
                  {FONT_PRESETS.map((f) => (
                    <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  {t.fontFamilyHintPart1}<code className="font-mono">type/body/family</code>{t.fontFamilyHintPart2}
                  <code className="font-mono">--atom-font-body</code>{t.fontFamilyHintPart3}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.logoUrl}</label>
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder={t.logoUrlPlaceholder}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex items-center gap-3 mt-2">
                  <label className="text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                    <input type="file" accept="image/*" onChange={onLogoFileChange} className="hidden" />
                    <span className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 font-medium inline-block transition-colors">
                      {t.uploadFile}
                    </span>
                  </label>
                  {logo && (
                    <div className="flex items-center gap-2">
                      <img
                        src={logo}
                        alt={t.logoAlt}
                        className="w-8 h-8 rounded bg-slate-100 object-contain"
                        onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
                      />
                      <button onClick={() => setLogo('')} className="text-xs text-slate-500 hover:text-red-600">
                        {t.remove}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Simple mode — 13 primitives */}
          {mode === 'simple' &&
            SIMPLE_GROUPS.map((group) => (
              <section
                key={group.titleKey}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
              >
                <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">
                  {groupLabels[group.titleKey]}
                </h2>
                <div>
                  {group.keys.map((k) => {
                    const d = PRIMITIVE_DESCRIPTORS[k];
                    return (
                      <ColorSwatchInput
                        key={k}
                        value={primitives[k]}
                        onChange={(next) => updatePrimitive(k, next)}
                        label={d.label}
                        extra={
                          <div className="mt-2 pl-[48px] space-y-1">
                            <p className="text-[11px] leading-tight text-slate-500">
                              <span className="font-medium text-slate-600">{t.drives}</span>
                              <span className="font-mono">{d.drives}</span>
                            </p>
                            <p className="text-[11px] leading-tight text-slate-500">
                              <span className="font-medium text-slate-600">{t.seenOn}</span>
                              {d.seenOn}
                            </p>
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              </section>
            ))}

          {/* Full mode — 67 tokens grouped by Brand Switcher category */}
          {mode === 'full' && (
            <>
              <div className="rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 px-4 py-3">
                <strong>{t.fullModeBannerLabel}</strong>{t.fullModeBannerLeadPart1}
                <code className="font-mono">{t.drives}</code>{t.fullModeBannerLeadPart2}
                <code className="font-mono">{t.seenOn}</code>
                {t.fullModeBannerLeadPart3}
              </div>
              {TOKEN_GROUP_ORDER.map((group) => {
                const keys = tokensInGroup(group);
                return (
                  <section
                    key={group}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
                  >
                    <div className="flex items-baseline justify-between mb-2">
                      <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                        {group}
                      </h2>
                      <span className="text-[11px] text-slate-400">
                        {keys.length}{t.tokenSuffix}{keys.length === 1 ? '' : t.tokenPlural}
                      </span>
                    </div>
                    <div>
                      {keys.map((k) => {
                        const info = TOKEN_INFO[k];
                        const rule = TOKEN_DERIVATION[k];
                        const shortName = k.replace(/^atom\./, '');
                        return (
                          <ColorSwatchInput
                            key={k}
                            compact
                            value={fullTokens[k]}
                            onChange={(next) => updateToken(k, next)}
                            label={shortName}
                            subtitle={info.purpose}
                            extra={
                              <p className="mt-1 pl-[48px] text-[10px] text-slate-400 font-mono">
                                {t.simpleRule}{describeRule(rule)}
                              </p>
                            }
                          />
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </>
          )}
        </div>

        {/* ── Right: live preview (scoped with CSS vars) ───────────────────── */}
        <div>
          <div className="lg:sticky lg:top-20 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                {t.livePreview}
              </h2>
              <span className="text-[11px] text-slate-500">
                {t.reactsToFormChanges}{mode}{t.modeWord}
              </span>
            </div>

            <div
              data-brand="custom"
              style={previewStyle}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6"
            >
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">{t.previewButton}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <ButtonLive variant="Primary" size="Small" label={t.btnPrimary} brand="custom" />
                  <ButtonLive variant="Secondary" size="Small" label={t.btnSecondary} brand="custom" />
                  <ButtonLive variant="Destructive" size="Small" label={t.btnDelete} brand="custom" />
                  <ButtonLive variant="Primary" size="Small" label={t.btnDisabled} state="Disabled" brand="custom" />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">{t.previewAlert}</p>
                <div className="space-y-2">
                  <AlertLive type="Success" option="Full Border" title={t.alertSuccessTitle} description={t.alertSuccessDesc} brand="custom" showDismiss={false} />
                  <AlertLive type="Warning" option="Full Border" title={t.alertWarningTitle} description={t.alertWarningDesc} brand="custom" showDismiss={false} />
                  <AlertLive type="Error" option="Full Border" title={t.alertErrorTitle} description={t.alertErrorDesc} brand="custom" showDismiss={false} />
                  <AlertLive type="Information" option="Full Border" title={t.alertInfoTitle} description={t.alertInfoDesc} brand="custom" showDismiss={false} />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">{t.previewBadge}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <BadgeLive state="Brand" label={t.badgeBrand} brand="custom" />
                  <BadgeLive state="Success" label={t.badgeSuccess} brand="custom" />
                  <BadgeLive state="Warning" label={t.badgeWarning} brand="custom" />
                  <BadgeLive state="Error" label={t.badgeError} brand="custom" />
                  <BadgeLive state="Information" label={t.badgeInfo} brand="custom" />
                  <BadgeLive state="Muted" label={t.badgeMuted} brand="custom" />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">{t.previewInput}</p>
                <div className="space-y-3">
                  <InputLive type="Basic" label={t.inputDefaultLabel} placeholder={t.inputTypePlaceholder} helperText={t.inputHelperText} brand="custom" />
                  <InputLive type="Basic" label={t.inputFocusedLabel} state="Focus" placeholder={t.inputFocusedPlaceholder} brand="custom" />
                  <InputLive type="Basic" label={t.inputErrorLabel} state="Error" placeholder={t.inputErrorPlaceholder} helperText={t.inputErrorHelper} brand="custom" />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">{t.previewCard}</p>
                <CardLive
                  imagePosition="None"
                  textLine="Single"
                  titleText={t.cardTitle}
                  bodyText={t.cardBody}
                  actionLabel={t.cardAction}
                  brand="custom"
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">{t.previewProgress}</p>
                <div className="space-y-3 max-w-md">
                  <ProgressIndicatorLive variant="Percentage Bar" value={60} showTitle titleText={t.progressUploading} brand="custom" />
                  <ProgressIndicatorLive variant="Multiple Bars" segments={4} activeSegments={2} showTitle titleText={t.progressStep} brand="custom" />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">{t.previewBreadcrumbs}</p>
                <BreadcrumbsLive
                  items={[
                    { label: t.crumbHome, href: '#' },
                    { label: t.crumbAccount, href: '#' },
                    { label: t.crumbPreferences },
                  ]}
                  brand="custom"
                />
              </div>
            </div>

            <details className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
              <summary className="cursor-pointer px-4 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wider hover:bg-slate-800">
                {t.cssBlockTitle}
              </summary>
              <pre className="px-4 py-3 text-[11px] leading-relaxed text-slate-300 font-mono overflow-auto max-h-80">
                {generateCss(effectiveTokens, '[data-brand="custom"]', primitives, font)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
