// Sidebar navigation data.
//
// The site is bilingual (English + Simplified Chinese). Rather than carrying a
// flat string `label`, each item and section now declares both languages
// inline. The Sidebar resolves the active language at render time by calling
// `getNavSections(lang)`, which returns the same shape the previous flat
// `NAV_SECTIONS` constant exposed — so the Sidebar code stays simple.

import { type Language } from './languages';

export interface NavItem {
  to: string;
  label: string;
}

export interface NavSection {
  id: string;
  label: string;
  basePath: string;
  items: NavItem[];
}

interface BilingualLabel {
  en: string;
  zh: string;
}

interface BilingualNavItem {
  to: string;
  label: BilingualLabel;
}

interface BilingualNavSection {
  id: string;
  label: BilingualLabel;
  basePath: string;
  items: BilingualNavItem[];
}

const SECTIONS: BilingualNavSection[] = [
  {
    id: 'getting-started',
    label: { en: 'Getting Started', zh: '入门' },
    basePath: '/getting-started',
    items: [
      {
        to: '/getting-started',
        label: { en: 'Getting started with Atom', zh: 'Atom 入门指南' },
      },
    ],
  },
  {
    id: 'foundations',
    label: { en: 'Foundations', zh: '基础' },
    basePath: '/foundations',
    items: [
      {
        to: '/foundations/brand-foundations',
        label: { en: 'Brand Foundations', zh: '品牌基础' },
      },
      {
        to: '/foundations/brand-switcher',
        label: { en: 'Brand Switcher', zh: '品牌切换器' },
      },
      { to: '/foundations/borders', label: { en: 'Borders', zh: '边框' } },
      { to: '/foundations/spacing', label: { en: 'Spacing', zh: '间距' } },
    ],
  },
  {
    id: 'tools',
    label: { en: 'Tools', zh: '工具' },
    basePath: '/portal',
    items: [
      { to: '/portal', label: { en: 'White-label Portal', zh: '白标门户' } },
      { to: '/portal/mapping', label: { en: 'Token Mapping', zh: '令牌映射' } },
    ],
  },
  {
    id: 'token-component-link',
    label: { en: 'Token-Component Link', zh: '令牌-组件关联' },
    basePath: '/token-component-link',
    items: [
      { to: '/token-component-link', label: { en: 'Overview', zh: '概览' } },
    ],
  },
  {
    id: 'components',
    label: { en: 'Components', zh: '组件' },
    basePath: '/components',
    items: [
      { to: '/components/accordion', label: { en: 'Accordion', zh: '手风琴' } },
      { to: '/components/alert', label: { en: 'Alert', zh: '警告' } },
      { to: '/components/avatar', label: { en: 'Avatar', zh: '头像' } },
      { to: '/components/badge', label: { en: 'Badge', zh: '徽章' } },
      { to: '/components/breadcrumbs', label: { en: 'Breadcrumbs', zh: '面包屑' } },
      { to: '/components/button', label: { en: 'Button', zh: '按钮' } },
      { to: '/components/button-group', label: { en: 'Button Group', zh: '按钮组' } },
      { to: '/components/card', label: { en: 'Card', zh: '卡片' } },
      { to: '/components/checkbox', label: { en: 'Checkbox', zh: '复选框' } },
      { to: '/components/data-row', label: { en: 'Data Row', zh: '数据行' } },
      { to: '/components/data-group', label: { en: 'Data Group', zh: '数据组' } },
      {
        to: '/components/data-group-no-slot',
        label: { en: 'Data Group (No Slot)', zh: '数据组（无插槽）' },
      },
      { to: '/components/date-picker', label: { en: 'Date Picker', zh: '日期选择器' } },
      { to: '/components/dialog', label: { en: 'Dialog', zh: '对话框' } },
      { to: '/components/divider', label: { en: 'Divider', zh: '分割线' } },
      { to: '/components/input', label: { en: 'Input', zh: '输入框' } },
      { to: '/components/line-item', label: { en: 'Line Item', zh: '行项目' } },
      { to: '/components/list-item', label: { en: 'List Item', zh: '列表项' } },
      { to: '/components/media', label: { en: 'Media', zh: '媒体' } },
      {
        to: '/components/progress-indicator',
        label: { en: 'Progress Indicator', zh: '进度指示器' },
      },
      { to: '/components/qr-code', label: { en: 'QR Code', zh: '二维码' } },
      {
        to: '/components/quantity-stepper',
        label: { en: 'Quantity Stepper', zh: '数量步进器' },
      },
      { to: '/components/select', label: { en: 'Select', zh: '选择器' } },
      { to: '/components/stepper', label: { en: 'Stepper', zh: '步进器' } },
      { to: '/components/steps', label: { en: 'Steps', zh: '步骤' } },
      { to: '/components/switch', label: { en: 'Switch', zh: '开关' } },
      { to: '/components/tabs', label: { en: 'Tabs', zh: '选项卡' } },
      { to: '/components/tags', label: { en: 'Tags', zh: '标签' } },
      { to: '/components/tiles', label: { en: 'Tiles', zh: '磁贴' } },
      { to: '/components/time-picker', label: { en: 'Time Picker', zh: '时间选择器' } },
      { to: '/components/toast', label: { en: 'Toast', zh: '提示消息' } },
      { to: '/components/tooltip', label: { en: 'Tooltip', zh: '工具提示' } },
      { to: '/components/transport-card', label: { en: 'Transport Card', zh: '交通卡' } },
    ],
  },
];

export function getNavSections(lang: Language): NavSection[] {
  return SECTIONS.map((s) => ({
    id: s.id,
    label: s.label[lang],
    basePath: s.basePath,
    items: s.items.map((i) => ({ to: i.to, label: i.label[lang] })),
  }));
}

// English-default export retained so that any consumer that doesn't yet pass a
// language continues to work. Sidebar.tsx now uses getNavSections(lang).
export const NAV_SECTIONS: NavSection[] = getNavSections('en');
