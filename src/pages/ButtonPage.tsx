import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ButtonLive,
  type ButtonType,
  type ButtonVariant,
  type ButtonSize,
  type ButtonState,
} from '../components/button/ButtonLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

interface ButtonPageProps {
  brand: Brand;
  lang?: Language;
}

const COPY = {
  en: {
    typeLabel: 'Type',
    variantLabel: 'Variant',
    sizeLabel: 'Size',
    stateLabel: 'State',
    labelLabel: 'Label',
    buttonLabelLabel: 'Button Label',
    iconsLabel: 'Icons',
    show: 'Show',
    hide: 'Hide',
    iconLeft: 'Icon Left',
    iconRight: 'Icon Right',
    placeholderLabel: 'Label text…',
    defaultLabel: 'Button Label',
    paymentNote:
      'Payment variants use fixed provider branding. In production, integrate via the official provider SDK — do not replicate these styles manually.',
    title: 'Button',
    introBefore:
      'The primary action element. Three types (Full Button, Icon Only, Social Login) across ten variants including payment providers. All sized across Default / Small / Tiny. Font family updates per brand via ',
    introAfter: '.',
    pillFeedback: 'Feedback',
    pillStable: 'Stable',
    anatomyHeading: 'Anatomy',
    anatomyIntro:
      'Full Button anatomy. Icon Only has a single icon slot; Social Login adds a provider icon left-slot with justified layout.',
    variantsHeading: 'Variants',
    propertyHeader: 'Property',
    valuesHeader: 'Values',
    designTokensHeading: 'Design Tokens',
    designTokensIntro:
      'Active tokens for the selected type + variant are highlighted. Payment buttons use fixed provider brand colors, not design system tokens.',
    tokenHeader: 'Token',
    cssVarHeader: 'CSS Variable',
    fallbackHeader: 'Fallback',
    paymentNoteStrong: 'Payment buttons',
    paymentNoteMid: ' (GooglePay, ApplePay, PayPal) use fixed provider brand colors — ',
    paymentNoteAfter1: ' for Google/Apple Pay and ',
    paymentNoteAfter2: " for PayPal — not design system tokens. Follow each provider's official branding guidelines.",
    a11yHeading: 'Accessibility',
    a11yIntro: 'Guidelines for implementing all Button types inclusively.',
    usageHeading: 'Usage',
    usageIntro: 'When and how to use each Button type and variant.',
    whenToUse: 'When to use',
    whenNotToUse: 'When not to use',
    anatomyParts: [
      { num: '1', name: 'Container',  desc: 'Pill-shaped wrapper (border-radius: 999px). Background and border driven by variant token. Height: 64/52/42px. Icon Only: 60/52/40px square.' },
      { num: '2', name: 'Icon Left',  desc: 'Optional 16x16px icon slot (Full Button). 24x24px centered icon (Icon Only). Provider logo slot (Social Login). All inherit currentColor.' },
      { num: '3', name: 'Label',      desc: '14px / weight 600. Font family from --atom-font-body — changes per brand. Required for Full Button and Social Login. Absent in Icon Only.' },
      { num: '4', name: 'Icon Right', desc: 'Optional 16x16px icon slot (Full Button only). Social Login has an empty right slot to center the label. Payment buttons show provider logos here.' },
    ],
    variantTableRows: [
      {
        label: 'Type',
        chips: [
          { text: 'Full Button', note: '' },
          { text: 'Icon Only',   note: '' },
          { text: 'Social Login', note: '' },
        ],
      },
      {
        label: 'Variant',
        chips: [
          { text: 'Primary', note: '' },
          { text: 'Secondary', note: '' },
          { text: 'Tertiary', note: '' },
          { text: 'Destructive', note: '' },
          { text: 'White', note: '' },
          { text: 'Loading', note: '' },
          { text: 'Destructive-Text', note: '' },
          { text: 'ApplePay', note: '' },
          { text: 'PayPal', note: '' },
          { text: 'GooglePay', note: '' },
        ],
      },
      {
        label: 'Size',
        chips: [
          { text: 'Default', note: '64px (Icon Only: 60px)' },
          { text: 'Small',   note: '52px' },
          { text: 'Tiny',    note: '42px (Icon Only: 40px)' },
        ],
      },
      {
        label: 'State',
        chips: [
          { text: 'Default', note: '' },
          { text: 'Hover', note: '' },
          { text: 'Focus', note: '' },
          { text: 'Active', note: '' },
          { text: 'Disabled', note: '' },
          { text: 'Loading', note: '' },
        ],
      },
      {
        label: 'Font family',
        chips: [
          { text: 'Poppins',  note: 'Dragonpass' },
          { text: 'Arial',    note: 'Mastercard' },
          { text: 'Inter',    note: 'Investec' },
          { text: 'Manrope',  note: 'Visa · Greyscale' },
          { text: 'Lato',     note: 'Assurant' },
        ],
      },
    ],
    tokenRows: [
      { label: 'Primary bg',           cssVar: '--atom-background-primary-bg-primary-default',           tokenKey: 'atom.background.primary.bg-primary-default',              fallback: '#0a2333', types: ['Full Button', 'Icon Only'] as ButtonType[], variants: ['Primary'] as ButtonVariant[] },
      { label: 'Primary fg',           cssVar: '--atom-foreground-primary-fg-brand-primary-inverse',     tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',         fallback: '#ffffff', types: ['Full Button', 'Icon Only'] as ButtonType[], variants: ['Primary', 'Destructive'] as ButtonVariant[] },
      { label: 'Secondary / White bg', cssVar: '--atom-background-primary-bg-primary-inverse',           tokenKey: 'atom.background.primary.bg-primary-inverse',              fallback: '#ffffff', types: ['Full Button', 'Icon Only', 'Social Login'] as ButtonType[], variants: ['Secondary', 'White'] as ButtonVariant[] },
      { label: 'Brand fg',             cssVar: '--atom-foreground-primary-fg-brand-primary',             tokenKey: 'atom.foreground.primary.fg-brand-primary',                fallback: '#0a2333', types: ['Full Button', 'Icon Only', 'Social Login'] as ButtonType[], variants: ['Secondary', 'White'] as ButtonVariant[] },
      { label: 'Brand border',         cssVar: '--atom-border-default-border-default-brand',             tokenKey: 'atom.border.default.border-default-brand',                fallback: '#0a2333', types: ['Full Button', 'Icon Only', 'Social Login'] as ButtonType[], variants: ['Secondary'] as ButtonVariant[] },
      { label: 'Tertiary / link fg',   cssVar: '--atom-foreground-core-fg-link',                        tokenKey: 'atom.foreground.core.fg-link',                            fallback: '#006b99', types: ['Full Button'] as ButtonType[], variants: ['Tertiary'] as ButtonVariant[] },
      { label: 'Destructive bg',       cssVar: '--atom-background-alert-bg-error-full',                 tokenKey: 'atom.background.alert.bg-error-full',                     fallback: '#e02d3c', types: ['Full Button'] as ButtonType[], variants: ['Destructive'] as ButtonVariant[] },
      { label: 'Destructive-Text fg',  cssVar: '--atom-foreground-feedback-fg-error',                   tokenKey: 'atom.foreground.feedback.fg-error',                       fallback: '#e02d3c', types: ['Full Button'] as ButtonType[], variants: ['Destructive-Text'] as ButtonVariant[] },
      { label: 'Border radius',        cssVar: '--atom-buttons-radius',                                                                                                      fallback: '999px',  types: ['Full Button', 'Icon Only', 'Social Login'] as ButtonType[], variants: ['Primary', 'Secondary', 'Tertiary', 'White', 'Destructive', 'Destructive-Text', 'Loading'] as ButtonVariant[] },
      { label: 'Focus ring',           cssVar: '--atom-border-selection-and-focus-border-primary-focus', tokenKey: 'atom.border.selection-and-focus.border-primary-focus',    fallback: '#3b82f6', types: ['Full Button', 'Icon Only', 'Social Login'] as ButtonType[], variants: ['Primary', 'Secondary', 'Tertiary', 'Destructive', 'White', 'Loading', 'Destructive-Text', 'ApplePay', 'PayPal', 'GooglePay'] as ButtonVariant[] },
    ],
    a11yRows: [
      { icon: '⌨️', title: 'Keyboard interaction', body: 'All button types receive focus and activate on Enter or Space. Never implement buttons as <div> or <a> without role="button" and keyboard handlers.' },
      { icon: '🚫', title: 'Disabled state', body: 'Use the disabled attribute — not visual styling alone. Screen readers announce disabled state; keyboard focus is removed automatically.' },
      { icon: '⏳', title: 'Loading state', body: 'Add aria-busy="true" when loading. If label changes to "Loading…", that is announced. The spinner SVG should be aria-hidden="true".' },
      { icon: '🖼️', title: 'Icon Only buttons', body: 'Icon Only buttons have no visible label — always provide aria-label describing the action (e.g. aria-label="Add to cart"). The icon is aria-hidden="true".' },
      { icon: '🔐', title: 'Social Login buttons', body: 'Label must identify the provider: "Continue with Google". Do not rely on the provider logo alone — always include visible text.' },
      { icon: '💳', title: 'Payment buttons', body: "GooglePay, ApplePay, and PayPal buttons should follow each provider's branding guidelines. Always test with real provider SDKs in production." },
      { icon: '🎨', title: 'Color contrast', body: 'Primary and Destructive (white on filled bg) meet WCAG AA 4.5:1. Secondary/Tertiary/White/Destructive-Text meet AA. Disabled is exempt per WCAG 1.4.3.' },
    ],
    usageCards: [
      { title: 'Primary',          color: '#0a2333', bg: '#f0f4f8', when: 'The dominant action per view. Use once. E.g. "Submit", "Save", "Continue".' },
      { title: 'Secondary',        color: '#0a2333', bg: '#f9fafb', when: 'Supporting actions alongside Primary. Multiple allowed. E.g. "Cancel" + "Save Draft".' },
      { title: 'Tertiary',         color: '#006b99', bg: '#f0f9ff', when: 'Low-emphasis inline actions. No fill or border. Best inside content or alongside elements.' },
      { title: 'White',            color: '#1e293b', bg: '#e2e8f0', when: 'On dark or brand-colored surfaces where Primary fill would be invisible. Inverts the fill.' },
      { title: 'Destructive',      color: '#991b1b', bg: '#fef2f2', when: 'Permanent or high-risk actions: delete, remove, revoke. Always confirm before execution.' },
      { title: 'Destructive-Text', color: '#b91c1c', bg: '#fff5f5', when: 'Low-emphasis destructive actions where a full red fill would be too aggressive. E.g. inline "Remove".' },
      { title: 'Icon Only',        color: '#374151', bg: '#f8fafc', when: 'When space is constrained and the action is universally understood. Always add aria-label.' },
      { title: 'Social Login',     color: '#374151', bg: '#f8fafc', when: 'Authentication flows. Always show provider name in the label alongside the provider logo.' },
      { title: 'Payment buttons',  color: '#374151', bg: '#fffbeb', when: 'Checkout flows. Use provider SDKs in production — never replicate payment button styles manually.' },
    ],
    whenToUseItems: [
      '• Use Primary for the single critical action per view',
      '• Use Icon Only when space is constrained and intent is clear',
      '• Use Social Login with provider name visible in label',
      '• Use Destructive for delete / revoke actions',
      '• Use White on dark or brand-colored surfaces',
    ],
    whenNotToUseItems: [
      "• Don't use multiple Primary buttons in the same view",
      "• Don't use Icon Only without an aria-label",
      "• Don't replicate GooglePay/ApplePay/PayPal styles manually",
      "• Don't use Destructive for non-destructive actions",
      "• Don't disable without showing why — use inline validation",
    ],
  },
  zh: {
    typeLabel: '类型',
    variantLabel: '变体',
    sizeLabel: '尺寸',
    stateLabel: '状态',
    labelLabel: '标签',
    buttonLabelLabel: '按钮标签',
    iconsLabel: '图标',
    show: '显示',
    hide: '隐藏',
    iconLeft: '左侧图标',
    iconRight: '右侧图标',
    placeholderLabel: '标签文本…',
    defaultLabel: '按钮标签',
    paymentNote:
      '支付变体使用固定的提供商品牌标识。在生产环境中,通过官方提供商 SDK 集成 — 切勿手动复制这些样式。',
    title: '按钮',
    introBefore:
      '主要操作元素。三种类型(Full Button、Icon Only、Social Login),包括支付提供商在内的十种变体。所有尺寸均涵盖 Default / Small / Tiny。字体系列通过 ',
    introAfter: ' 按品牌更新。',
    pillFeedback: '反馈',
    pillStable: '稳定',
    anatomyHeading: '结构',
    anatomyIntro:
      'Full Button 结构。Icon Only 有单个图标插槽;Social Login 添加左侧的提供商图标插槽,并采用两端对齐布局。',
    variantsHeading: '变体',
    propertyHeader: '属性',
    valuesHeader: '值',
    designTokensHeading: '设计令牌',
    designTokensIntro:
      '所选类型 + 变体的活动令牌将高亮显示。支付按钮使用固定的提供商品牌色,而非设计系统令牌。',
    tokenHeader: '令牌',
    cssVarHeader: 'CSS 变量',
    fallbackHeader: '回退值',
    paymentNoteStrong: '支付按钮',
    paymentNoteMid: '(GooglePay、ApplePay、PayPal)使用固定的提供商品牌色 — ',
    paymentNoteAfter1: ' 用于 Google/Apple Pay,',
    paymentNoteAfter2: ' 用于 PayPal — 而非设计系统令牌。请遵循每个提供商的官方品牌指南。',
    a11yHeading: '无障碍',
    a11yIntro: '以包容性方式实现所有按钮类型的指南。',
    usageHeading: '用法',
    usageIntro: '何时以及如何使用每种按钮类型和变体。',
    whenToUse: '适用场景',
    whenNotToUse: '不适用场景',
    anatomyParts: [
      { num: '1', name: '容器',     desc: '胶囊形包装(border-radius: 999px)。背景和边框由变体令牌驱动。高度:64/52/42px。Icon Only:60/52/40px 正方形。' },
      { num: '2', name: '左侧图标',  desc: '可选 16×16px 图标插槽(Full Button)。24×24px 居中图标(Icon Only)。提供商徽标插槽(Social Login)。均继承 currentColor。' },
      { num: '3', name: '标签',     desc: '14px / 字重 600。字体来自 --atom-font-body — 因品牌而异。Full Button 和 Social Login 必填。Icon Only 中无此项。' },
      { num: '4', name: '右侧图标', desc: '可选 16×16px 图标插槽(仅 Full Button)。Social Login 右侧有空插槽以居中标签。支付按钮在此显示提供商徽标。' },
    ],
    variantTableRows: [
      {
        label: '类型',
        chips: [
          { text: 'Full Button', note: '' },
          { text: 'Icon Only',   note: '' },
          { text: 'Social Login', note: '' },
        ],
      },
      {
        label: '变体',
        chips: [
          { text: 'Primary', note: '' },
          { text: 'Secondary', note: '' },
          { text: 'Tertiary', note: '' },
          { text: 'Destructive', note: '' },
          { text: 'White', note: '' },
          { text: 'Loading', note: '' },
          { text: 'Destructive-Text', note: '' },
          { text: 'ApplePay', note: '' },
          { text: 'PayPal', note: '' },
          { text: 'GooglePay', note: '' },
        ],
      },
      {
        label: '尺寸',
        chips: [
          { text: 'Default', note: '64px(Icon Only:60px)' },
          { text: 'Small',   note: '52px' },
          { text: 'Tiny',    note: '42px(Icon Only:40px)' },
        ],
      },
      {
        label: '状态',
        chips: [
          { text: 'Default', note: '' },
          { text: 'Hover', note: '' },
          { text: 'Focus', note: '' },
          { text: 'Active', note: '' },
          { text: 'Disabled', note: '' },
          { text: 'Loading', note: '' },
        ],
      },
      {
        label: '字体系列',
        chips: [
          { text: 'Poppins',  note: 'Dragonpass' },
          { text: 'Arial',    note: 'Mastercard' },
          { text: 'Inter',    note: 'Investec' },
          { text: 'Manrope',  note: 'Visa · Greyscale' },
          { text: 'Lato',     note: 'Assurant' },
        ],
      },
    ],
    tokenRows: [
      { label: '主背景',                cssVar: '--atom-background-primary-bg-primary-default',           tokenKey: 'atom.background.primary.bg-primary-default',              fallback: '#0a2333', types: ['Full Button', 'Icon Only'] as ButtonType[], variants: ['Primary'] as ButtonVariant[] },
      { label: '主前景',                cssVar: '--atom-foreground-primary-fg-brand-primary-inverse',     tokenKey: 'atom.foreground.primary.fg-brand-primary-inverse',         fallback: '#ffffff', types: ['Full Button', 'Icon Only'] as ButtonType[], variants: ['Primary', 'Destructive'] as ButtonVariant[] },
      { label: 'Secondary / White 背景', cssVar: '--atom-background-primary-bg-primary-inverse',           tokenKey: 'atom.background.primary.bg-primary-inverse',              fallback: '#ffffff', types: ['Full Button', 'Icon Only', 'Social Login'] as ButtonType[], variants: ['Secondary', 'White'] as ButtonVariant[] },
      { label: '品牌前景',              cssVar: '--atom-foreground-primary-fg-brand-primary',             tokenKey: 'atom.foreground.primary.fg-brand-primary',                fallback: '#0a2333', types: ['Full Button', 'Icon Only', 'Social Login'] as ButtonType[], variants: ['Secondary', 'White'] as ButtonVariant[] },
      { label: '品牌边框',              cssVar: '--atom-border-default-border-default-brand',             tokenKey: 'atom.border.default.border-default-brand',                fallback: '#0a2333', types: ['Full Button', 'Icon Only', 'Social Login'] as ButtonType[], variants: ['Secondary'] as ButtonVariant[] },
      { label: '次要 / 链接前景',       cssVar: '--atom-foreground-core-fg-link',                        tokenKey: 'atom.foreground.core.fg-link',                            fallback: '#006b99', types: ['Full Button'] as ButtonType[], variants: ['Tertiary'] as ButtonVariant[] },
      { label: '破坏性背景',            cssVar: '--atom-background-alert-bg-error-full',                 tokenKey: 'atom.background.alert.bg-error-full',                     fallback: '#e02d3c', types: ['Full Button'] as ButtonType[], variants: ['Destructive'] as ButtonVariant[] },
      { label: '破坏性文本前景',        cssVar: '--atom-foreground-feedback-fg-error',                   tokenKey: 'atom.foreground.feedback.fg-error',                       fallback: '#e02d3c', types: ['Full Button'] as ButtonType[], variants: ['Destructive-Text'] as ButtonVariant[] },
      { label: '边框圆角',              cssVar: '--atom-buttons-radius',                                                                                                      fallback: '999px',  types: ['Full Button', 'Icon Only', 'Social Login'] as ButtonType[], variants: ['Primary', 'Secondary', 'Tertiary', 'White', 'Destructive', 'Destructive-Text', 'Loading'] as ButtonVariant[] },
      { label: '焦点环',                cssVar: '--atom-border-selection-and-focus-border-primary-focus', tokenKey: 'atom.border.selection-and-focus.border-primary-focus',    fallback: '#3b82f6', types: ['Full Button', 'Icon Only', 'Social Login'] as ButtonType[], variants: ['Primary', 'Secondary', 'Tertiary', 'Destructive', 'White', 'Loading', 'Destructive-Text', 'ApplePay', 'PayPal', 'GooglePay'] as ButtonVariant[] },
    ],
    a11yRows: [
      { icon: '⌨️', title: '键盘交互', body: '所有按钮类型均接收焦点,并通过 Enter 或 Space 激活。切勿将按钮实现为 <div> 或 <a> 而不附加 role="button" 与键盘处理。' },
      { icon: '🚫', title: '禁用状态', body: '使用 disabled 属性 — 而不仅仅是视觉样式。屏幕阅读器会朗读禁用状态;键盘焦点会自动移除。' },
      { icon: '⏳', title: '加载状态', body: '加载时添加 aria-busy="true"。如果标签变为 "Loading…",将被朗读。加载图标 SVG 应设置为 aria-hidden="true"。' },
      { icon: '🖼️', title: 'Icon Only 按钮', body: 'Icon Only 按钮没有可见标签 — 始终提供描述操作的 aria-label(例如 aria-label="Add to cart")。图标设为 aria-hidden="true"。' },
      { icon: '🔐', title: 'Social Login 按钮', body: '标签必须标明提供商:"Continue with Google"。切勿仅依赖提供商徽标 — 始终包含可见文本。' },
      { icon: '💳', title: '支付按钮', body: 'GooglePay、ApplePay 和 PayPal 按钮应遵循每个提供商的品牌指南。生产环境中始终使用真实的提供商 SDK 进行测试。' },
      { icon: '🎨', title: '颜色对比度', body: 'Primary 和 Destructive(填充背景上的白色文字)符合 WCAG AA 4.5:1。Secondary/Tertiary/White/Destructive-Text 符合 AA。Disabled 根据 WCAG 1.4.3 豁免。' },
    ],
    usageCards: [
      { title: 'Primary',          color: '#0a2333', bg: '#f0f4f8', when: '每个视图的主导操作。仅使用一次。例如 "Submit"、"Save"、"Continue"。' },
      { title: 'Secondary',        color: '#0a2333', bg: '#f9fafb', when: '与 Primary 并用的辅助操作。允许多个。例如 "Cancel" + "Save Draft"。' },
      { title: 'Tertiary',         color: '#006b99', bg: '#f0f9ff', when: '低强调的内联操作。无填充或边框。最适合内容内或与元素并排。' },
      { title: 'White',            color: '#1e293b', bg: '#e2e8f0', when: '用于 Primary 填充会不可见的深色或品牌色表面。反转填充。' },
      { title: 'Destructive',      color: '#991b1b', bg: '#fef2f2', when: '永久性或高风险操作:删除、移除、撤销。执行前始终确认。' },
      { title: 'Destructive-Text', color: '#b91c1c', bg: '#fff5f5', when: '完整红色填充过于强烈的低强调破坏性操作。例如内联 "Remove"。' },
      { title: 'Icon Only',        color: '#374151', bg: '#f8fafc', when: '空间受限且操作含义明确时使用。始终添加 aria-label。' },
      { title: 'Social Login',     color: '#374151', bg: '#f8fafc', when: '认证流程。始终在标签中显示提供商名称,并附带提供商徽标。' },
      { title: '支付按钮',         color: '#374151', bg: '#fffbeb', when: '结账流程。生产环境中使用提供商 SDK — 切勿手动复制支付按钮样式。' },
    ],
    whenToUseItems: [
      '• 在每个视图中使用 Primary 处理唯一的关键操作',
      '• 在空间受限且意图清晰时使用 Icon Only',
      '• 使用 Social Login 时在标签中显示提供商名称',
      '• 使用 Destructive 处理删除 / 撤销操作',
      '• 在深色或品牌色表面上使用 White',
    ],
    whenNotToUseItems: [
      '• 不要在同一视图中使用多个 Primary 按钮',
      '• 不要在没有 aria-label 的情况下使用 Icon Only',
      '• 不要手动复制 GooglePay/ApplePay/PayPal 样式',
      '• 不要将 Destructive 用于非破坏性操作',
      '• 不要在不显示原因的情况下禁用 — 使用内联验证',
    ],
  },
} as const;

const DOTTED_BG: React.CSSProperties = {
  backgroundColor: '#f2f2f2',
  backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const DARK_BG: React.CSSProperties = {
  backgroundColor: '#1e293b',
  backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const ALL_TYPES: ButtonType[] = [
  'Full Button', 'Icon Only', 'Social Login',
];

const ALL_VARIANTS: ButtonVariant[] = [
  'Primary', 'Secondary', 'Tertiary', 'Destructive', 'White', 'Loading', 'Destructive-Text', 'ApplePay', 'PayPal', 'GooglePay',
];

const ICON_ONLY_VARIANTS: ButtonVariant[] = ['Primary', 'Secondary'];
const SOCIAL_LOGIN_VARIANTS: ButtonVariant[] = ['Primary', 'Secondary'];

const ALL_SIZES: ButtonSize[] = ['Default', 'Small', 'Tiny'];
const ALL_STATES: ButtonState[] = ['Default', 'Hover', 'Focus', 'Active', 'Disabled', 'Loading'];

// Variants available per type
function variantsForType(type: ButtonType): ButtonVariant[] {
  if (type === 'Full Button') return ALL_VARIANTS;
  if (type === 'Icon Only')   return ICON_ONLY_VARIANTS;
  if (type === 'Social Login') return SOCIAL_LOGIN_VARIANTS;
  return ALL_VARIANTS;
}

const VARIANT_META: Record<ButtonVariant, { dotColor: string; dotBorder: string }> = {
  Primary:            { dotColor: 'var(--atom-background-primary-bg-primary-default)', dotBorder: 'var(--atom-background-primary-bg-primary-default)' },
  Secondary:          { dotColor: 'transparent', dotBorder: 'var(--atom-border-default-border-default-brand)' },
  Tertiary:           { dotColor: 'transparent', dotBorder: 'var(--atom-foreground-core-fg-link)' },
  White:              { dotColor: '#e2e8f0', dotBorder: '#94a3b8' },
  Destructive:        { dotColor: 'var(--atom-background-alert-bg-error-full)', dotBorder: 'var(--atom-background-alert-bg-error-full)' },
  'Destructive-Text': { dotColor: 'transparent', dotBorder: 'var(--atom-foreground-feedback-fg-error)' },
  Loading:            { dotColor: 'var(--atom-background-primary-bg-primary-default)', dotBorder: 'var(--atom-background-primary-bg-primary-default)' },
  ApplePay:           { dotColor: '#000000', dotBorder: '#000000' },
  PayPal:             { dotColor: '#179bd7', dotBorder: '#179bd7' },
  GooglePay:          { dotColor: '#000000', dotBorder: '#4285F4' },
};

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

function canvasBg(_buttonType: ButtonType, variant: ButtonVariant): React.CSSProperties {
  // White variant and payment variants look best on dark background
  if (variant === 'White' || variant === 'GooglePay' || variant === 'ApplePay') return DARK_BG;
  return DOTTED_BG;
}

export function ButtonPage({ brand, lang = 'en' }: ButtonPageProps) {
  const t = COPY[lang];
  const [buttonType, setButtonType] = useState<ButtonType>('Full Button');
  const [variant, setVariant]       = useState<ButtonVariant>('Primary');
  const [size, setSize]             = useState<ButtonSize>('Default');
  const [state, setState]           = useState<ButtonState>('Default');
  const [label, setLabel]           = useState<string>(t.defaultLabel);
  const [showLabel, setShowLabel]   = useState(true);
  const [showIconLeft,  setShowIconLeft]  = useState(false);
  const [showIconRight, setShowIconRight] = useState(false);

  const availableVariants = variantsForType(buttonType);
  // Reset variant when type changes and current variant isn't valid
  const effectiveVariant: ButtonVariant =
    !availableVariants.includes(variant) ? availableVariants[0] : variant;

  const buttonKey = `${buttonType}-${effectiveVariant}-${size}-${state}-${label}-${showLabel}-${showIconLeft}-${showIconRight}`;
  const isPayment = effectiveVariant === 'GooglePay' || effectiveVariant === 'ApplePay' || effectiveVariant === 'PayPal';
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col md:flex-row min-h-72">

            {/* Canvas */}
            <div
              className="flex-1 flex items-center justify-center p-12 min-h-52"
              style={canvasBg(buttonType, effectiveVariant)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={buttonKey}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  <ButtonLive
                    buttonType={buttonType}
                    variant={effectiveVariant}
                    size={size}
                    state={state}
                    label={label}
                    showLabel={showLabel}
                    showIconLeft={showIconLeft}
                    showIconRight={showIconRight}
                    brand={brand}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-5 flex flex-col gap-5 overflow-y-auto">

              {/* Type */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.typeLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_TYPES.map((ty) => (
                    <button
                      key={ty}
                      onClick={() => setButtonType(ty)}
                      className={[
                        'px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        buttonType === ty
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {ty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variant */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.variantLabel}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {availableVariants.map((v) => {
                    const meta = VARIANT_META[v];
                    return (
                      <button
                        key={v}
                        onClick={() => setVariant(v)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '4px 10px', borderRadius: '6px',
                          fontSize: '12px', fontWeight: 500, border: '1px solid',
                          cursor: 'pointer', textAlign: 'left', width: '100%',
                          transition: 'all 0.1s ease',
                          ...(effectiveVariant === v
                            ? { backgroundColor: '#0f172a', color: '#ffffff', borderColor: '#0f172a', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }
                            : { backgroundColor: 'transparent', color: '#475569', borderColor: '#e2e8f0' }),
                        }}
                      >
                        <span style={{
                          width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                          border: '1.5px solid', backgroundColor: meta.dotColor, borderColor: meta.dotBorder,
                        }} />
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.sizeLabel}</p>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
                  {ALL_SIZES.map((s) => (
                    <button key={s} onClick={() => setSize(s)}
                      className={['px-3 py-1.5 text-xs font-medium transition-all duration-100',
                        size === s ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'].join(' ')}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* State */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.stateLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_STATES.map((s) => (
                    <button key={s} onClick={() => setState(s)}
                      className={['px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-100',
                        state === s
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'].join(' ')}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Label visibility toggle */}
              {buttonType !== 'Icon Only' && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{t.labelLabel}</p>
                  <div style={{ display: 'flex', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', width: 'fit-content' }}>
                    {([{ key: 'Show', label: t.show }, { key: 'Hide', label: t.hide }] as const).map((opt) => {
                      const isActive = opt.key === 'Show' ? showLabel : !showLabel;
                      return (
                        <button
                          key={opt.key}
                          onClick={() => setShowLabel(opt.key === 'Show')}
                          style={{
                            padding: '6px 12px', fontSize: '12px', fontWeight: 500, border: 'none', cursor: 'pointer',
                            transition: 'all 0.1s ease',
                            ...(isActive
                              ? { backgroundColor: '#0f172a', color: '#ffffff' }
                              : { backgroundColor: 'transparent', color: '#475569' }),
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Label text — not for Icon Only or payment */}
              {buttonType !== 'Icon Only' && !isPayment && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{t.buttonLabelLabel}</p>
                  <input
                    type="text" value={label} maxLength={30}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-md text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
                    placeholder={t.placeholderLabel}
                  />
                </div>
              )}

              {/* Icons — Full Button only */}
              {buttonType === 'Full Button' && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.iconsLabel}</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: t.iconLeft,  value: showIconLeft,  set: setShowIconLeft },
                      { label: t.iconRight, value: showIconRight, set: setShowIconRight },
                    ].map(({ label: lbl, value, set }) => (
                      <label key={lbl} className="flex items-center gap-2.5 cursor-pointer select-none group">
                        <button role="checkbox" aria-checked={value} onClick={() => set(!value)}
                          className={['w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-100 flex-shrink-0',
                            value ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-300 group-hover:border-slate-400'].join(' ')}>
                          {value && (
                            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                              <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                        <span className="text-xs text-slate-600">{lbl}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment variant note */}
              {isPayment && (
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
                  {t.paymentNote}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{t.title}</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              {t.introBefore}<code className="text-xs bg-slate-100 px-1 rounded">--atom-font-body</code>{t.introAfter}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.25" />
                <path d="M5 3v3M5 7.5v.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              {t.pillFeedback}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t.pillStable}
            </span>
          </div>
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* ── 3. ANATOMY ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.anatomyHeading}</h2>
        <p className="text-sm text-slate-500 mb-5">{t.anatomyIntro}</p>

        <div className="relative flex items-center justify-center py-20 px-8 rounded-xl" style={DOTTED_BG}>
          <div>
            <ButtonLive buttonType="Full Button" variant="Primary" size="Default" state="Default"
              label={t.defaultLabel} showIconLeft={true} showIconRight={true} brand={brand} />
          </div>
          {/* 1 — Container (bottom) */}
          <div className="absolute bottom-4 flex flex-col items-center pointer-events-none" style={{ left: '50%', transform: 'translateX(-50%)' }}>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">1</span>
          </div>
          {/* 2 — Icon Left (top) */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '40%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">2</span>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
          </div>
          {/* 3 — Label (top) */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '50%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">3</span>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
          </div>
          {/* 4 — Icon Right (top) */}
          <div className="absolute top-4 flex flex-col items-center pointer-events-none" style={{ left: '60%', transform: 'translateX(-50%)' }}>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold shadow">4</span>
            <div className="w-px bg-slate-400" style={{ height: '32px' }} />
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {t.anatomyParts.map((row) => (
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">{t.propertyHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.valuesHeader}</th>
              </tr>
            </thead>
            <tbody>
              {t.variantTableRows.map((row, i, arr) => (
                <tr key={row.label} className={i < arr.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="px-5 py-3.5 font-medium text-slate-700 text-sm align-top">{row.label}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {row.chips.map(({ text, note }) => (
                        <span key={text} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                          {text}{note && <span className="text-slate-400 font-normal">· {note}</span>}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview of all variants */}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {ALL_VARIANTS.map(v => {
            const needsDark = v === 'White' || v === 'GooglePay' || v === 'ApplePay';
            return (
              <div key={v} style={{
                padding: '20px 24px', borderRadius: '10px',
                border: '1px solid #f3f4f6',
                backgroundColor: needsDark ? '#1e293b' : '#fafafa',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px',
              }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: needsDark ? '#94a3b8' : '#6b7280' }}>{v}</p>
                <ButtonLive buttonType="Full Button" variant={v} size="Default" state="Default" label="Label" brand={brand} />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.designTokensHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.designTokensIntro}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.tokenHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.cssVarHeader}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">{t.fallbackHeader}</th>
              </tr>
            </thead>
            <tbody>
              {t.tokenRows.map((row, i) => {
                const typeActive    = row.types.includes(buttonType);
                const variantActive = !row.variants || row.variants.includes(effectiveVariant);
                const isActive      = typeActive && variantActive;
                const tokenKey = 'tokenKey' in row ? row.tokenKey : undefined;
                const resolvedValue = tokenKey ? (tokens[tokenKey as keyof typeof tokens] ?? row.fallback) : row.fallback;
                const isHexColor    = resolvedValue.startsWith('#');
                const light         = isHexColor ? isLightColor(resolvedValue) : true;
                return (
                  <tr
                    key={row.cssVar}
                    className={[
                      i < t.tokenRows.length - 1 ? 'border-b border-slate-100' : '',
                      isActive ? 'bg-blue-50/60' : 'opacity-40',
                      'transition-all duration-150',
                    ].join(' ')}
                    style={isActive ? { borderLeft: '3px solid #3b82f6' } : { borderLeft: '3px solid transparent' }}
                  >
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{row.label}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {row.cssVar}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      {isHexColor ? (
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded flex-shrink-0 border border-black/10" style={{ backgroundColor: resolvedValue }} />
                          <span className="font-mono text-xs px-1.5 py-0.5 rounded border"
                            style={{ backgroundColor: resolvedValue, color: light ? '#1e293b' : '#f8fafc', borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)' }}>
                            {resolvedValue.toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <code className="font-mono text-xs text-slate-500">{resolvedValue}</code>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Payment note */}
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs text-amber-800">
            <strong>{t.paymentNoteStrong}</strong>{t.paymentNoteMid}<code className="bg-amber-100 px-1 rounded">#000000</code>{t.paymentNoteAfter1}<code className="bg-amber-100 px-1 rounded">#ffc439</code>{t.paymentNoteAfter2}
          </p>
        </div>
      </section>

      {/* ── 6. ACCESSIBILITY ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.a11yHeading}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.a11yIntro}</p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm divide-y divide-slate-100">
          {t.a11yRows.map((row, i) => (
            <div key={row.title} className={['flex items-start gap-4 px-5 py-4', i % 2 === 1 ? 'bg-slate-50/50' : ''].join(' ')}>
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
          {t.usageIntro}
        </p>

        {/* Per-type/variant usage cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {t.usageCards.map((card) => (
            <div key={card.title} style={{ padding: '14px 16px', borderRadius: '10px', border: `1px solid ${card.color}22`, backgroundColor: card.bg }}>
              <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: card.color }}>{card.title}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: 1.5 }}>{card.when}</p>
            </div>
          ))}
        </div>

        {/* Do / Don't */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>✓ {t.whenToUse}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
              {t.whenToUseItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.whenToUseItems.length - 1 ? '6px' : 0 }}>{item}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#991b1b' }}>✗ {t.whenNotToUse}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '12.5px', color: '#b91c1c', lineHeight: 1.4 }}>
              {t.whenNotToUseItems.map((item, i) => (
                <li key={i} style={{ marginBottom: i < t.whenNotToUseItems.length - 1 ? '6px' : 0 }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
