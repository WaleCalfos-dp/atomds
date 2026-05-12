import { useLocation, useNavigate } from 'react-router-dom';
import { type Brand, BRANDS } from '../data/tokens';
import { type CustomBrand } from '../data/deriveTokens';
import { type Language, LANGUAGES } from '../data/languages';

interface TopBarProps {
  brand: Brand;
  setBrand: (brand: Brand) => void;
  customBrand: CustomBrand | null;
  lang: Language;
  setLang: (lang: Language) => void;
}

const COPY = {
  en: {
    docs: 'Docs',
    foundations: 'Foundations',
    components: 'Components',
    tools: 'Tools',
    tokenComponentLink: 'Token-Component Link',
    gettingStarted: 'Getting Started',
    whiteLabelPortal: 'White-label Portal',
    customBrandTitle: 'Create a custom brand in the White-label Portal',
    customBrandLabel: 'Custom',
  },
  zh: {
    docs: '文档',
    foundations: '基础',
    components: '组件',
    tools: '工具',
    tokenComponentLink: '令牌-组件关联',
    gettingStarted: '入门',
    whiteLabelPortal: '白标门户',
    customBrandTitle: '在白标门户中创建自定义品牌',
    customBrandLabel: '自定义',
  },
} as const;

// Translated names for the second breadcrumb segment.
// Keys mirror the URL slug; values give EN + zh-CN labels.
const PAGE_NAMES: Record<string, { en: string; zh: string }> = {
  // Foundations
  'brand-foundations': { en: 'Brand Foundations', zh: '品牌基础' },
  'brand-switcher': { en: 'Brand Switcher', zh: '品牌切换器' },
  borders: { en: 'Borders', zh: '边框' },
  spacing: { en: 'Spacing', zh: '间距' },
  // Components
  accordion: { en: 'Accordion', zh: '手风琴' },
  alert: { en: 'Alert', zh: '警告' },
  avatar: { en: 'Avatar', zh: '头像' },
  badge: { en: 'Badge', zh: '徽章' },
  breadcrumbs: { en: 'Breadcrumbs', zh: '面包屑' },
  button: { en: 'Button', zh: '按钮' },
  'button-group': { en: 'Button Group', zh: '按钮组' },
  card: { en: 'Card', zh: '卡片' },
  checkbox: { en: 'Checkbox', zh: '复选框' },
  'data-row': { en: 'Data Row', zh: '数据行' },
  'data-group': { en: 'Data Group', zh: '数据组' },
  'data-group-no-slot': { en: 'Data Group (No Slot)', zh: '数据组（无插槽）' },
  'date-picker': { en: 'Date Picker', zh: '日期选择器' },
  dialog: { en: 'Dialog', zh: '对话框' },
  divider: { en: 'Divider', zh: '分割线' },
  input: { en: 'Input', zh: '输入框' },
  'line-item': { en: 'Line Item', zh: '行项目' },
  'list-item': { en: 'List Item', zh: '列表项' },
  media: { en: 'Media', zh: '媒体' },
  'progress-indicator': { en: 'Progress Indicator', zh: '进度指示器' },
  'qr-code': { en: 'QR Code', zh: '二维码' },
  'quantity-stepper': { en: 'Quantity Stepper', zh: '数量步进器' },
  select: { en: 'Select', zh: '选择器' },
  stepper: { en: 'Stepper', zh: '步进器' },
  steps: { en: 'Steps', zh: '步骤' },
  switch: { en: 'Switch', zh: '开关' },
  tabs: { en: 'Tabs', zh: '选项卡' },
  tags: { en: 'Tags', zh: '标签' },
  tiles: { en: 'Tiles', zh: '磁贴' },
  'time-picker': { en: 'Time Picker', zh: '时间选择器' },
  toast: { en: 'Toast', zh: '提示消息' },
  tooltip: { en: 'Tooltip', zh: '工具提示' },
  'transport-card': { en: 'Transport Card', zh: '交通卡' },
};

function pageLabel(slug: string, lang: Language): string {
  const entry = PAGE_NAMES[slug];
  if (entry) return entry[lang];
  // Fallback: humanise the slug.
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function routeMeta(pathname: string, lang: Language): { parent: string; label: string } {
  const t = COPY[lang];
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] === 'getting-started') {
    return { parent: t.docs, label: t.gettingStarted };
  }
  if (segments[0] === 'foundations' && segments[1]) {
    return { parent: t.foundations, label: pageLabel(segments[1], lang) };
  }
  if (segments[0] === 'components' && segments[1]) {
    return { parent: t.components, label: pageLabel(segments[1], lang) };
  }
  if (segments[0] === 'portal') {
    return { parent: t.tools, label: t.whiteLabelPortal };
  }
  if (segments[0] === 'token-component-link') {
    return { parent: t.tools, label: t.tokenComponentLink };
  }
  return { parent: t.docs, label: '' };
}

export function TopBar({ brand, setBrand, customBrand, lang, setLang }: TopBarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const t = COPY[lang];
  const { parent, label } = routeMeta(pathname, lang);

  return (
    <header className="fixed top-0 left-60 right-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <span className="text-slate-400">{parent}</span>
        {label && (
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="text-slate-300"
            >
              <path
                d="M5 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-slate-800 font-medium">{label}</span>
          </>
        )}
      </nav>

      {/* Brand + Language Switchers */}
      <div className="flex items-center gap-0.5">
        {BRANDS.map((b) => {
          const isActive = brand === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setBrand(b.id)}
              title={b.label}
              className={[
                'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150',
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
              ].join(' ')}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: b.primary }}
              />
              {b.label}
            </button>
          );
        })}

        {/* Custom brand pill — appears once the user has saved one in /portal */}
        {customBrand ? (
          <button
            onClick={() => setBrand('custom')}
            title={`${customBrand.name} (${t.customBrandLabel})`}
            className={[
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150',
              brand === 'custom'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
            ].join(' ')}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: customBrand.primitives.brandPrimary }}
            />
            {customBrand.name || t.customBrandLabel}
          </button>
        ) : (
          <button
            onClick={() => navigate('/portal')}
            title={t.customBrandTitle}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-dashed border-slate-300 ml-1"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {t.customBrandLabel}
          </button>
        )}

        {/* Divider between brand pills and language pills */}
        <div className="mx-2 h-5 w-px bg-slate-200" aria-hidden="true" />

        {/* Language switcher */}
        <div className="flex items-center gap-0.5">
          {LANGUAGES.map((l) => {
            const isActive = lang === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                title={l.label}
                className={[
                  'px-2 py-1 rounded-md text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
                ].join(' ')}
              >
                {l.native}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
