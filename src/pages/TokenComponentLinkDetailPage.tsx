import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  type Brand,
  type SemanticTokenKey,
  BRANDS,
  RESOLVED_SEMANTIC_TOKENS,
} from '../data/tokens';
import { type Language } from '../data/languages';
import {
  TOKEN_USAGE,
  TOKEN_PURPOSE,
  ALL_TOKENS,
  type CSSPropertyKind,
  type TokenUsage,
  type BindingSource,
  CATEGORY_LABELS,
  tokenCategory,
  tokenShortName,
  tokenCssVar,
  tokenToSlug,
  slugToToken,
  bindingSource,
} from '../data/tokenUsage';

interface Props {
  brand: Brand;
  lang?: Language;
}

// ─── Bilingual copy block ─────────────────────────────────────────────────
const COPY = {
  en: {
    propertyKindLabels: {
      text: 'Text',
      background: 'Background',
      border: 'Border',
      'icon-fill': 'Icon fill',
      'icon-stroke': 'Icon stroke',
      outline: 'Outline',
      shadow: 'Shadow',
    } as Record<CSSPropertyKind, string>,
    sourceLabels: {
      react: 'React',
      figma: 'Figma',
    } as Record<BindingSource, string>,
    sourceTitles: {
      react: 'Bound via var(--atom-…) in the Live React component.',
      figma:
        'Bound on a layer inside the Atom Figma component set, but not yet rendered by the Live React preview (typically a state variant such as hover, pressed, or focus).',
    } as Record<BindingSource, string>,
    notFoundTitle: 'Token not found',
    notFoundLead1: 'No token matches the slug ',
    notFoundEmpty: '(empty)',
    notFoundLead2: '. Tokens are linked from the Token-Component Link overview.',
    backToOverview: '← Back to overview',
    breadcrumbRoot: 'Token-Component Link',
    resolvedPerBrand: 'Resolved per brand',
    componentBindings: 'Component bindings',
    bindingPrefix: '',
    bindingMid: ' binding',
    bindingPlural: 's',
    acrossPrefix: ' across ',
    componentSuffix: ' component',
    componentPlural: 's',
    unusedTitle: 'Unused token',
    unusedLead1:
      'This token is defined in Brand Switcher and resolves per brand, but it has',
    unusedLead2: ' no binding in either source',
    unusedLead3: ': ',
    unusedLead4: ' does not appear in any ',
    unusedLead5:
      ' file, and MCP introspection of every Atom Figma component set found no layer binding it. It may be reserved for future use, retained for legacy compatibility, or read only by the documentation swatch tables that pull ',
    unusedLead6: ' directly.',
    otherTokensIn: 'Other tokens in ',
    unusedChip: 'Unused',
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
    sourceLabels: {
      react: 'React',
      figma: 'Figma',
    } as Record<BindingSource, string>,
    sourceTitles: {
      react: '在 Live React 组件中通过 var(--atom-…) 绑定。',
      figma:
        '在 Atom Figma 组件集的图层上绑定，但 Live React 预览尚未渲染（通常是悬停、按下或焦点等状态变体）。',
    } as Record<BindingSource, string>,
    notFoundTitle: '未找到设计令牌',
    notFoundLead1: '没有设计令牌与 slug ',
    notFoundEmpty: '（空）',
    notFoundLead2: ' 匹配。设计令牌从“令牌-组件链接”总览中关联。',
    backToOverview: '← 返回总览',
    breadcrumbRoot: '令牌-组件链接',
    resolvedPerBrand: '各品牌的解析值',
    componentBindings: '组件绑定',
    bindingPrefix: '',
    bindingMid: ' 个绑定',
    bindingPlural: '',
    acrossPrefix: '，跨越 ',
    componentSuffix: ' 个组件',
    componentPlural: '',
    unusedTitle: '未使用的设计令牌',
    unusedLead1:
      '此设计令牌在 Brand Switcher 中已定义并按品牌解析，但',
    unusedLead2: '在两个来源中均无绑定',
    unusedLead3: '：',
    unusedLead4: ' 未出现在任何 ',
    unusedLead5:
      ' 文件中，并且对每个 Atom Figma 组件集进行 MCP 内省也未找到绑定它的图层。它可能保留以备将来使用、出于历史兼容性而保留，或仅由直接读取 ',
    unusedLead6: ' 的文档色板表所读取。',
    otherTokensIn: '其他位于 ',
    unusedChip: '未使用',
  },
} as const;

const BUILTIN_BRANDS = BRANDS.filter((b) => b.id !== 'custom');

const PROPERTY_KIND_COLORS: Record<CSSPropertyKind, string> = {
  text: 'bg-blue-50 text-blue-700 border-blue-200',
  background: 'bg-purple-50 text-purple-700 border-purple-200',
  border: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'icon-fill': 'bg-amber-50 text-amber-700 border-amber-200',
  'icon-stroke': 'bg-amber-50 text-amber-700 border-amber-200',
  outline: 'bg-rose-50 text-rose-700 border-rose-200',
  shadow: 'bg-slate-100 text-slate-700 border-slate-300',
};

const SOURCE_COLORS: Record<BindingSource, string> = {
  react: 'bg-sky-50 text-sky-700 border-sky-200',
  figma: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
};

export function TokenComponentLinkDetailPage({ brand, lang = 'en' }: Props) {
  const { tokenSlug = '' } = useParams<{ tokenSlug: string }>();
  const tokenKey = slugToToken(tokenSlug);

  if (!tokenKey) {
    return <NotFound slug={tokenSlug} lang={lang} />;
  }

  return <Detail tokenKey={tokenKey} brand={brand} lang={lang} />;
}

function NotFound({ slug, lang }: { slug: string; lang: Language }) {
  const t = COPY[lang];
  return (
    <div className="pb-16 space-y-6">
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.notFoundTitle}</h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto mb-4">
          {t.notFoundLead1}
          <code className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-xs">
            {slug || t.notFoundEmpty}
          </code>
          {t.notFoundLead2}
        </p>
        <Link
          to="/token-component-link"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 underline"
        >
          {t.backToOverview}
        </Link>
      </div>
    </div>
  );
}

function Detail({
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
  const purpose = TOKEN_PURPOSE[tokenKey];
  const cat = tokenCategory(tokenKey);
  const isUnused = usages.length === 0;

  // Group usages by component
  const usagesByComponent = useMemo(() => {
    const map = new Map<string, { path: string; file: string; uses: TokenUsage[] }>();
    for (const u of usages) {
      if (!map.has(u.component)) {
        map.set(u.component, { path: u.componentPath, file: u.componentFile, uses: [] });
      }
      map.get(u.component)!.uses.push(u);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b));
  }, [usages]);

  // Related tokens: same category prefix
  const related = useMemo(
    () => ALL_TOKENS.filter((k) => k !== tokenKey && tokenCategory(k) === cat),
    [tokenKey, cat],
  );

  return (
    <div className="pb-16 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link to="/token-component-link" className="hover:text-slate-800 underline">
          {t.breadcrumbRoot}
        </Link>
        <span className="text-slate-400">›</span>
        <span className="text-slate-700 font-medium">{tokenShortName(tokenKey)}</span>
      </nav>

      {/* Token header */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          {CATEGORY_LABELS[cat]}
        </div>
        <h1 className="text-[32px] leading-[1.15] font-bold text-slate-900 tracking-tight font-mono">
          {tokenShortName(tokenKey)}
        </h1>
        <div className="space-y-1">
          <div className="text-xs font-mono text-slate-500" title={tokenKey}>
            {tokenKey}
          </div>
          <div className="text-xs font-mono text-slate-500">{tokenCssVar(tokenKey)}</div>
        </div>
        {purpose && (
          <p className="text-slate-600 leading-relaxed max-w-3xl">{purpose}</p>
        )}
      </header>

      {/* Brand swatch strip */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          {t.resolvedPerBrand}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BUILTIN_BRANDS.map((b) => {
            const hex = RESOLVED_SEMANTIC_TOKENS[b.id]?.[tokenKey] ?? '#cccccc';
            const isCurrent = b.id === brand;
            return (
              <div
                key={b.id}
                className={[
                  'rounded-xl border bg-white p-3 transition-all',
                  isCurrent
                    ? 'border-slate-900 shadow-md ring-2 ring-slate-900 ring-offset-2'
                    : 'border-slate-200',
                ].join(' ')}
              >
                <div
                  className="w-full h-14 rounded-md border border-slate-200 mb-2"
                  style={{ backgroundColor: hex }}
                />
                <div className="text-xs font-medium text-slate-800 truncate">
                  {b.label}
                </div>
                <div className="text-[10px] font-mono text-slate-500">{hex}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bindings */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t.componentBindings}
          </h2>
          {!isUnused && (
            <div className="text-xs text-slate-500">
              <strong className="text-slate-700">{usages.length}</strong>
              {t.bindingMid}
              {usages.length === 1 ? '' : t.bindingPlural}
              {t.acrossPrefix}
              <strong className="text-slate-700">{usagesByComponent.length}</strong>
              {t.componentSuffix}
              {usagesByComponent.length === 1 ? '' : t.componentPlural}
            </div>
          )}
        </div>

        {isUnused ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <h3 className="text-sm font-semibold text-slate-800 mb-1">{t.unusedTitle}</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              {t.unusedLead1}
              <strong>{t.unusedLead2}</strong>
              {t.unusedLead3}
              {' '}
              <code className="font-mono text-xs bg-white border border-slate-200 px-1 py-0.5 rounded">
                var({tokenCssVar(tokenKey)})
              </code>
              {t.unusedLead4}
              <code className="font-mono text-xs bg-white border border-slate-200 px-1 py-0.5 rounded">
                *Live.tsx
              </code>
              {t.unusedLead5}
              <code className="font-mono text-xs bg-white border border-slate-200 px-1 py-0.5 rounded">
                RESOLVED_SEMANTIC_TOKENS
              </code>
              {t.unusedLead6}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
            {usagesByComponent.map(([name, info]) => (
              <div key={name} className="p-4">
                <div className="flex items-baseline justify-between mb-2">
                  <Link
                    to={info.path}
                    className="text-sm font-semibold text-slate-900 hover:text-slate-700 underline decoration-slate-300 underline-offset-2"
                  >
                    {name}
                  </Link>
                  <code
                    className="text-[10px] font-mono text-slate-400 truncate ml-3"
                    title={info.file}
                  >
                    {info.file.replace('src/components/', '')}
                  </code>
                </div>
                <ul className="space-y-1.5">
                  {info.uses.map((u, i) => {
                    const src = bindingSource(u);
                    return (
                      <li key={i} className="flex items-baseline gap-2 text-sm flex-wrap">
                        <span
                          className={[
                            'text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0',
                            PROPERTY_KIND_COLORS[u.property],
                          ].join(' ')}
                        >
                          {t.propertyKindLabels[u.property]}
                        </span>
                        <span
                          className={[
                            'text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0',
                            SOURCE_COLORS[src],
                          ].join(' ')}
                          title={t.sourceTitles[src]}
                        >
                          {t.sourceLabels[src]}
                        </span>
                        <span className="text-slate-700 leading-snug">
                          {u.description}
                        </span>
                        {u.scope && (
                          <code className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {u.scope}
                          </code>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related tokens */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            {t.otherTokensIn}{CATEGORY_LABELS[cat]}
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map((k) => {
              const hex = RESOLVED_SEMANTIC_TOKENS[brand]?.[k] ?? '#cccccc';
              const used = TOKEN_USAGE[k].length > 0;
              return (
                <Link
                  key={k}
                  to={`/token-component-link/${tokenToSlug(k)}`}
                  className={[
                    'inline-flex items-center gap-2 rounded-full border bg-white px-2.5 py-1 text-xs hover:border-slate-400 transition-colors',
                    used ? 'border-slate-200 text-slate-700' : 'border-slate-200 text-slate-400',
                  ].join(' ')}
                  title={k}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-slate-200"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="font-mono">{tokenShortName(k)}</span>
                  {!used && (
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">
                      {t.unusedChip}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
