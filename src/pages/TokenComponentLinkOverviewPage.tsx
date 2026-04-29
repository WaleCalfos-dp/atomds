import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { type Brand, type SemanticTokenKey, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';
import {
  TOKEN_USAGE,
  TOKEN_PURPOSE,
  USED_TOKENS,
  UNUSED_TOKENS,
  REACT_BINDINGS,
  FIGMA_BINDINGS,
  COMPONENTS_COVERED,
  ALL_TOKENS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type CSSPropertyKind,
  type TokenCategory,
  tokenCategory,
  tokenShortName,
  tokenCssVar,
  tokenToSlug,
  tokenPropertyKinds,
  tokenSources,
} from '../data/tokenUsage';

interface Props {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    propertyKindLabels: {
      text: 'text',
      background: 'background',
      border: 'border',
      'icon-fill': 'icon fill',
      'icon-stroke': 'icon stroke',
      outline: 'outline',
      shadow: 'shadow',
    } as Record<CSSPropertyKind, string>,
    topGroups: {
      foreground: 'Foreground',
      background: 'Background',
      border: 'Border',
      progress: 'Progress',
    } as Record<TopGroup, string>,
    chip: 'Token-Component Link · Overview',
    title: 'Where every Brand Switcher token lives',
    leadPart1: 'A token-first lookup across the Atom React library. Pick any of the ',
    leadPart2:
      ' Brand Switcher colour tokens to see exactly which components bind it, the CSS property it controls (text colour, background, border, icon fill, focus ring, …) and the variant or state where the binding activates.',
    statTokensUsed: 'tokens used',
    statBindings: 'React + Figma bindings',
    statComponents: 'components covered',
    sourcesLeadPart1: 'Bindings are sourced from ',
    sourcesLeadPart2: 'two passes',
    sourcesLeadPart3: ': (1) ',
    sourcesLeadPart4: ' usage in every ',
    sourcesLeadPart5:
      ' file, and (2) MCP introspection of every variant in the Atom Figma component sets. The Figma pass surfaces state variants (hover, pressed, focus, error-pressed, …) that the React previews don’t render. ',
    sourcesLeadPart6: ' token',
    sourcesLeadPart7: ' have no binding in either source — they’re defined per-brand but consumed by neither.',
    sourcesLeadPart7Single: ' has no binding in either source — it’s defined per-brand but consumed by neither.',
    searchPlaceholder: 'Search tokens, components, descriptions…',
    hideUnusedPrefix: 'Hide unused (',
    hideUnusedSuffix: ')',
    clear: 'Clear',
    categoryLabel: 'Category',
    propertyLabel: 'Property',
    showingPrefix: 'Showing ',
    showingMid: ' of ',
    showingSuffix: ' tokens',
    noMatches: 'No tokens match the current filters.',
    tokenSuffix: ' token',
    tokenPlural: 's',
    unusedChip: 'Unused',
    figmaOnly: 'Figma only',
    figmaOnlyTitle: 'No var(--atom-…) usage in *Live.tsx; only bound in the Atom Figma component.',
    componentSuffix: ' component',
    componentPlural: 's',
    moreSuffix: ' more',
  },
  zh: {
    propertyKindLabels: {
      text: '文本',
      background: '背景',
      border: '边框',
      'icon-fill': '图标填充',
      'icon-stroke': '图标描边',
      outline: '轮廓',
      shadow: '阴影',
    } as Record<CSSPropertyKind, string>,
    topGroups: {
      foreground: '前景',
      background: '背景',
      border: '边框',
      progress: '进度',
    } as Record<TopGroup, string>,
    chip: '令牌-组件链接 · 总览',
    title: '每个 Brand Switcher 设计令牌的所在之处',
    leadPart1: '在 Atom React 库中以令牌为先的查询工具。选择 ',
    leadPart2:
      ' 个 Brand Switcher 颜色令牌中的任意一个，即可查看哪些组件绑定了它、它控制的 CSS 属性（文本颜色、背景、边框、图标填充、焦点环……）以及绑定生效的变体或状态。',
    statTokensUsed: '已使用的令牌',
    statBindings: 'React + Figma 绑定',
    statComponents: '覆盖的组件',
    sourcesLeadPart1: '绑定来源于',
    sourcesLeadPart2: '两次扫描',
    sourcesLeadPart3: '：（1）每个 ',
    sourcesLeadPart4: ' 文件中的 ',
    sourcesLeadPart5:
      ' 用法，以及（2）对 Atom Figma 组件集中每个变体的 MCP 内省。Figma 扫描会发现 React 预览不会渲染的状态变体（悬停、按下、焦点、错误按下……）。',
    sourcesLeadPart6: ' 个令牌',
    sourcesLeadPart7: '在两个来源中均无绑定——它们按品牌定义但两边都未使用。',
    sourcesLeadPart7Single: '在两个来源中均无绑定——它按品牌定义但两边都未使用。',
    searchPlaceholder: '搜索设计令牌、组件、描述……',
    hideUnusedPrefix: '隐藏未使用（',
    hideUnusedSuffix: '）',
    clear: '清除',
    categoryLabel: '类别',
    propertyLabel: '属性',
    showingPrefix: '显示 ',
    showingMid: ' / ',
    showingSuffix: ' 个令牌',
    noMatches: '没有令牌匹配当前筛选条件。',
    tokenSuffix: ' 个令牌',
    tokenPlural: '',
    unusedChip: '未使用',
    figmaOnly: '仅 Figma',
    figmaOnlyTitle: '*Live.tsx 中未使用 var(--atom-…)；仅在 Atom Figma 组件中绑定。',
    componentSuffix: ' 个组件',
    componentPlural: '',
    moreSuffix: ' 个更多',
  },
} as const;

const PROPERTY_KIND_COLORS: Record<CSSPropertyKind, string> = {
  text: 'bg-blue-50 text-blue-700 border-blue-200',
  background: 'bg-purple-50 text-purple-700 border-purple-200',
  border: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'icon-fill': 'bg-amber-50 text-amber-700 border-amber-200',
  'icon-stroke': 'bg-amber-50 text-amber-700 border-amber-200',
  outline: 'bg-rose-50 text-rose-700 border-rose-200',
  shadow: 'bg-slate-50 text-slate-700 border-slate-200',
};

// Top-level category groups for the filter chips.
type TopGroup = 'foreground' | 'background' | 'border' | 'progress';

const TOP_GROUP_IDS: TopGroup[] = ['foreground', 'background', 'border', 'progress'];

function topGroupOf(cat: TokenCategory): TopGroup {
  if (cat.startsWith('foreground')) return 'foreground';
  if (cat.startsWith('background')) return 'background';
  if (cat.startsWith('border')) return 'border';
  return 'progress';
}

export function TokenComponentLinkOverviewPage({ brand, lang = 'en' }: Props) {
  const t = COPY[lang];
  const [search, setSearch] = useState('');
  const [activeGroups, setActiveGroups] = useState<Set<TopGroup>>(new Set());
  const [activeKinds, setActiveKinds] = useState<Set<CSSPropertyKind>>(new Set());
  const [hideUnused, setHideUnused] = useState(false);

  // Filtered tokens, grouped by category prefix.
  const groups = useMemo(() => {
    const lower = search.trim().toLowerCase();

    const filtered = ALL_TOKENS.filter((key) => {
      const cat = tokenCategory(key);
      const usages = TOKEN_USAGE[key];

      if (hideUnused && usages.length === 0) return false;

      if (activeGroups.size > 0 && !activeGroups.has(topGroupOf(cat))) return false;

      if (activeKinds.size > 0) {
        const kinds = tokenPropertyKinds(key);
        if (!kinds.some((k) => activeKinds.has(k))) return false;
      }

      if (lower) {
        const purpose = TOKEN_PURPOSE[key]?.toLowerCase() ?? '';
        const components = usages.map((u) => u.component.toLowerCase()).join(' ');
        const hay = [key.toLowerCase(), purpose, components].join(' ');
        if (!hay.includes(lower)) return false;
      }

      return true;
    });

    const grouped = new Map<TokenCategory, SemanticTokenKey[]>();
    for (const cat of CATEGORY_ORDER) grouped.set(cat, []);
    for (const k of filtered) grouped.get(tokenCategory(k))!.push(k);

    return CATEGORY_ORDER.map((cat) => ({
      cat,
      tokens: grouped.get(cat) ?? [],
    })).filter((g) => g.tokens.length > 0);
  }, [search, activeGroups, activeKinds, hideUnused]);

  const visibleCount = groups.reduce((acc, g) => acc + g.tokens.length, 0);

  const toggleGroup = (id: TopGroup) => {
    setActiveGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleKind = (id: CSSPropertyKind) => {
    setActiveKinds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setSearch('');
    setActiveGroups(new Set());
    setActiveKinds(new Set());
    setHideUnused(false);
  };

  const hasFilters =
    search !== '' || activeGroups.size > 0 || activeKinds.size > 0 || hideUnused;

  return (
    <div className="pb-16 space-y-8">
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
          {t.leadPart1}
          <strong>{ALL_TOKENS.length}</strong>
          {t.leadPart2}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3 max-w-xl">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-2xl font-bold text-slate-900">
              {USED_TOKENS.length}
              <span className="text-sm text-slate-400 font-normal"> / {ALL_TOKENS.length}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{t.statTokensUsed}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-2xl font-bold text-slate-900">
              {REACT_BINDINGS}
              <span className="text-sm text-slate-400 font-normal"> + {FIGMA_BINDINGS}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{t.statBindings}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-2xl font-bold text-slate-900">{COMPONENTS_COVERED}</div>
            <div className="text-xs text-slate-500 mt-1">{t.statComponents}</div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3 max-w-3xl">
          {t.sourcesLeadPart1}<strong className="text-slate-700">{t.sourcesLeadPart2}</strong>
          {t.sourcesLeadPart3}
          <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">var(--atom-…)</code>
          {t.sourcesLeadPart4}
          <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">*Live.tsx</code>
          {t.sourcesLeadPart5}
          {UNUSED_TOKENS.length}
          {UNUSED_TOKENS.length === 1 ? t.sourcesLeadPart7Single : `${t.sourcesLeadPart6}${t.sourcesLeadPart7}`}
        </p>
      </header>

      {/* Filter row */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 px-3 py-2 text-sm rounded-md border border-slate-200 focus:border-slate-400 focus:outline-none"
          />
          <label className="inline-flex items-center gap-2 text-xs text-slate-600 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={hideUnused}
              onChange={(e) => setHideUnused(e.target.checked)}
              className="rounded border-slate-300"
            />
            {t.hideUnusedPrefix}{UNUSED_TOKENS.length}{t.hideUnusedSuffix}
          </label>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              {t.clear}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mr-1">
            {t.categoryLabel}
          </span>
          {TOP_GROUP_IDS.map((id) => {
            const active = activeGroups.has(id);
            return (
              <button
                key={id}
                onClick={() => toggleGroup(id)}
                className={[
                  'px-2.5 py-1 text-xs rounded-full border transition-colors',
                  active
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400',
                ].join(' ')}
              >
                {t.topGroups[id]}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mr-1">
            {t.propertyLabel}
          </span>
          {(Object.keys(t.propertyKindLabels) as CSSPropertyKind[]).map((k) => {
            const active = activeKinds.has(k);
            return (
              <button
                key={k}
                onClick={() => toggleKind(k)}
                className={[
                  'px-2.5 py-1 text-xs rounded-full border transition-colors',
                  active
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400',
                ].join(' ')}
              >
                {t.propertyKindLabels[k]}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500">
          {t.showingPrefix}<strong className="text-slate-700">{visibleCount}</strong>
          {t.showingMid}{ALL_TOKENS.length}{t.showingSuffix}
        </div>
      </section>

      {/* Token groups */}
      {groups.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          {t.noMatches}
        </div>
      )}

      {groups.map(({ cat, tokens }) => (
        <section key={cat} className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {CATEGORY_LABELS[cat]}{' '}
            <span className="text-slate-400 font-normal normal-case">
              · {tokens.length}{t.tokenSuffix}{tokens.length === 1 ? '' : t.tokenPlural}
            </span>
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
            {tokens.map((key) => (
              <TokenRow key={key} tokenKey={key} brand={brand} lang={lang} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function TokenRow({
  tokenKey,
  brand,
  lang,
}: {
  tokenKey: SemanticTokenKey;
  brand: Brand;
  lang: Language;
}) {
  const t = COPY[lang];
  const usages = TOKEN_USAGE[tokenKey];
  const hex = RESOLVED_SEMANTIC_TOKENS[brand]?.[tokenKey] ?? '#cccccc';
  const kinds = tokenPropertyKinds(tokenKey);
  const sources = tokenSources(tokenKey);
  const purpose = TOKEN_PURPOSE[tokenKey];
  const isUnused = usages.length === 0;
  const isFigmaOnly = sources.length === 1 && sources[0] === 'figma';

  // First three component names + "+N more"
  const components = Array.from(new Set(usages.map((u) => u.component)));
  const componentsPreview = components.slice(0, 3).join(', ');
  const remaining = components.length - 3;

  return (
    <Link
      to={`/token-component-link/${tokenToSlug(tokenKey)}`}
      className={[
        'flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors',
        isUnused ? 'opacity-65' : '',
      ].join(' ')}
    >
      {/* Swatch */}
      <div
        className="w-8 h-8 rounded-md border border-slate-200 flex-shrink-0"
        style={{ backgroundColor: hex }}
        title={hex}
      />

      {/* Name + var */}
      <div className="flex-shrink-0 w-[290px] min-w-0">
        <div className="text-sm font-mono text-slate-800 truncate" title={tokenKey}>
          {tokenShortName(tokenKey)}
        </div>
        <div className="text-[11px] font-mono text-slate-400 truncate">
          {tokenCssVar(tokenKey)}
        </div>
      </div>

      {/* Property kind chips */}
      <div className="flex flex-wrap gap-1 flex-shrink-0 w-[230px]">
        {isUnused ? (
          <span className="text-[10px] uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded-full border border-dashed border-slate-300">
            {t.unusedChip}
          </span>
        ) : (
          <>
            {kinds.map((k) => (
              <span
                key={k}
                className={[
                  'text-[10px] px-1.5 py-0.5 rounded border',
                  PROPERTY_KIND_COLORS[k],
                ].join(' ')}
              >
                {t.propertyKindLabels[k]}
              </span>
            ))}
            {isFigmaOnly && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded border bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200"
                title={t.figmaOnlyTitle}
              >
                {t.figmaOnly}
              </span>
            )}
          </>
        )}
      </div>

      {/* Components */}
      <div className="flex-1 min-w-0 text-xs text-slate-600 truncate">
        {isUnused ? (
          <span className="text-slate-400 italic">{purpose}</span>
        ) : (
          <>
            <strong className="text-slate-700">{components.length}</strong>
            <span className="text-slate-400">
              {t.componentSuffix}{components.length === 1 ? '' : t.componentPlural} ·{' '}
            </span>
            {componentsPreview}
            {remaining > 0 && (
              <span className="text-slate-400"> +{remaining}{t.moreSuffix}</span>
            )}
          </>
        )}
      </div>

      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="text-slate-400 flex-shrink-0"
      >
        <path
          d="M5 3l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
