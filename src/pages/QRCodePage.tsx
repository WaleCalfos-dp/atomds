import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QRCodeType } from '../components/qr-code/QRCodeLive';
import { type Brand, RESOLVED_SEMANTIC_TOKENS } from '../data/tokens';
import { type Language } from '../data/languages';

// Figma-exported variant SVGs. One per shipped combination of
// (Code Type, Product Module, State, Type). These are the definitive
// rendering truth — they override any procedural reconstruction.
import barcodeAllFailedDark       from '../assets/qr-variants/barcode-all-failed-dark.svg';
import barcodeAllFailedLight      from '../assets/qr-variants/barcode-all-failed-light.svg';
import barcodeAllGeneratingDark   from '../assets/qr-variants/barcode-all-generating-dark.svg';
import barcodeAllGeneratingLight  from '../assets/qr-variants/barcode-all-generating-light.svg';
import barcodeAllSuccessDark      from '../assets/qr-variants/barcode-all-success-dark.svg';
import barcodeAllSuccessLight     from '../assets/qr-variants/barcode-all-success-light.svg';
import healthDefaultLight         from '../assets/qr-variants/health-healthandwellness-default-light.svg';
import membershipAllDefaultDark   from '../assets/qr-variants/membership-all-default-dark.svg';
import membershipAllDefaultLight  from '../assets/qr-variants/membership-all-default-light.svg';
import membershipAllFailedDark    from '../assets/qr-variants/membership-all-failed-dark.svg';
import membershipAllFailedLight   from '../assets/qr-variants/membership-all-failed-light.svg';
import membershipAllGenDark       from '../assets/qr-variants/membership-all-generating-dark.svg';
import membershipAllGenLight      from '../assets/qr-variants/membership-all-generating-light.svg';
import qrAllFailedDark            from '../assets/qr-variants/qr-all-failed-dark.svg';
import qrAllFailedLight           from '../assets/qr-variants/qr-all-failed-light.svg';
import qrAllGeneratingDark        from '../assets/qr-variants/qr-all-generating-dark.svg';
import qrAllGeneratingLight       from '../assets/qr-variants/qr-all-generating-light.svg';
import qrDiningSuccessDark        from '../assets/qr-variants/qr-dining-success-dark.svg';
import qrDiningSuccessLight       from '../assets/qr-variants/qr-dining-success-light.svg';
import qrESIMSuccessDark          from '../assets/qr-variants/qr-esim-success-dark.svg';
import qrESIMSuccessLight         from '../assets/qr-variants/qr-esim-success-light.svg';
import qrFastTrackSuccessDark     from '../assets/qr-variants/qr-fasttrack-success-dark.svg';
import qrFastTrackSuccessLight    from '../assets/qr-variants/qr-fasttrack-success-light.svg';
import qrLoungeSuccessDark        from '../assets/qr-variants/qr-lounge-success-dark.svg';
import qrLoungeSuccessLight       from '../assets/qr-variants/qr-lounge-success-light.svg';

interface QRCodePageProps {
  brand: Brand;
  lang?: Language;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Figma property catalogue — mirrors componentPropertyDefinitions 1:1
 * ────────────────────────────────────────────────────────────────────────── */

type CodeType       = 'QR' | 'Barcode' | 'Membership ID' | 'Health';
type ProductModule  = 'Fast Track' | 'eSIM' | 'Lounge' | 'Dining' | 'All' | 'Health and Wellness';
type QRState        = 'Default' | 'Success' | 'Generating' | 'Failed';

const CODE_TYPES:      CodeType[]      = ['QR', 'Barcode', 'Membership ID', 'Health'];
const PRODUCT_MODULES: ProductModule[] = ['Fast Track', 'eSIM', 'Lounge', 'Dining', 'All', 'Health and Wellness'];
const QR_STATES:       QRState[]       = ['Default', 'Success', 'Generating', 'Failed'];
const QR_TYPES:        QRCodeType[]    = ['Dark', 'Light'];

const BOOLEAN_PROPS: { name: string; default: boolean; appearsIn: string }[] = [
  { name: 'Counter',            default: false, appearsIn: 'QR / Barcode — page-of-page indicator' },
  { name: 'Chevron Left',       default: true,  appearsIn: 'QR / Barcode — previous-code affordance' },
  { name: 'Chevron Right',      default: true,  appearsIn: 'QR / Barcode — next-code affordance' },
  { name: 'Icon',               default: true,  appearsIn: 'Header icon above title' },
  { name: 'Title',              default: true,  appearsIn: 'Block heading' },
  { name: 'Validity',           default: true,  appearsIn: 'Dining, Lounge — expiry line' },
  { name: 'QR Code',            default: true,  appearsIn: 'Core glyph visibility toggle' },
  { name: 'Offer',              default: false, appearsIn: 'Dining — percentage-off ribbon' },
  { name: 'Description',        default: true,  appearsIn: 'Explanatory paragraph below pattern' },
  { name: 'Refresh Button',     default: false, appearsIn: 'Generating / Failed states — retry control' },
  { name: 'Add to Wallet',      default: true,  appearsIn: 'Lounge, eSIM — pass-kit CTA' },
  { name: 'Dining Location',    default: true,  appearsIn: 'Dining — venue line' },
  { name: 'Special Brand Logo', default: false, appearsIn: 'Co-branded lockups' },
  { name: 'Show Name',          default: true,  appearsIn: 'Fast Track — cardholder name row' },
  { name: 'Show Activity',      default: true,  appearsIn: 'Fast Track — activity row (Hatha Yoga etc.)' },
  { name: 'Show Date and Time', default: true,  appearsIn: 'Fast Track — date row' },
  { name: 'Footer',             default: true,  appearsIn: 'Fast Track — "Powered by" line' },
];

const TEXT_PROPS: { name: string; defaultValue: string }[] = [
  { name: 'Name',               defaultValue: 'John Smith' },
  { name: 'Card Number',        defaultValue: '4565 6374 4176 0934' },
  { name: 'Counter Text',       defaultValue: '1 of 2' },
  { name: 'Percentage Off',     defaultValue: '10% off' },
  { name: 'Validity Text',      defaultValue: 'Valid until 01 December 2026' },
  { name: 'Offer Text',         defaultValue: '3 course set meal' },
  { name: 'Description Text',   defaultValue: 'To install your eSIM, scan this QR code using another device or take a screenshot and follow the on-screen steps in your device settings.' },
  { name: 'Status Text',        defaultValue: 'Code status' },
  { name: 'Airport Name',       defaultValue: 'Guarulhos International Airport' },
  { name: 'Terminal',           defaultValue: 'Terminal 3, International Departures' },
  { name: 'Title Text',         defaultValue: 'You are checked in:' },
  { name: 'Location Text',      defaultValue: 'Fit @ Tottenham Court' },
  { name: 'Description Text 1', defaultValue: 'Please present this screen to a member of staff at the venue to gain access.' },
  { name: 'Name Label',         defaultValue: 'Name' },
  { name: 'Activity Label',     defaultValue: 'Activity' },
  { name: 'Activity',           defaultValue: 'Hatha Yoga' },
  { name: 'Check in Label',     defaultValue: 'Checked in ' },
  { name: 'Date and Time',      defaultValue: 'Sat, 14 Jan 2024, 10:30' },
  { name: 'Powered by Text',    defaultValue: 'Powered by' },
];

// ── Bilingual COPY map ───────────────────────────────────────────────────────
const COPY = {
  en: {
    headline: 'QR Code',
    taglineLead: 'A polymorphic scannable-code block. The ',
    taglineMid: ' variant reshapes the surrounding card for Fast Track check-in, eSIM activation, Lounge access, Dining vouchers, generic states, or Health & Wellness. Font family updates per brand via ',
    taglineProductModule: 'Product Module',
    taglineEnd: '.',
    pillFeedback: 'Feedback',
    pillStable: 'Stable',
    sectionInteractivePreview: 'Interactive Preview',
    matchesShipped: 'Matches Figma variant',
    notShipped: 'Not a shipped variant',
    matchesShippedTitle: 'This combination matches a shipped Figma variant.',
    notShippedTitle: 'This combination does not match any of the 25 variants Figma publishes.',
    railCodeType: 'Code Type',
    railProductModule: 'Product Module',
    railState: 'State',
    railType: 'Type',
    railBooleans: (n: number) => `Booleans (${n})`,
    railTextSlots: (n: number) => `Text slots (${n})`,
    sectionAnatomy: 'Anatomy',
    anatomyIntro: 'Shared structure across every Product Module. Each module re-uses or omits these parts — toggle them in the preview rail to see the effect.',
    sectionVariants: 'Variants',
    variantsIntroLines: [
      { lead: 'Figma ships ', strong: '25 concrete variants', tail: ', not every cross-product of the four properties.' },
      { lead: '', strong: 'QR', tail: ' appears in Fast Track, eSIM, Lounge, Dining, and All (Generating / Failed only for All).' },
      { lead: '', strong: 'Barcode', tail: ' and ' },
      { lead: '', strong: 'Membership ID', tail: ' ship only in the ' },
      { lead: '', strong: 'All', tail: ' module.' },
      { lead: '', strong: 'Health', tail: ' ships only in Health and Wellness, and only as ' },
      { lead: '', strong: 'Type = Light', tail: '.' },
    ],
    colProperty: 'Property',
    colValues: 'Values',
    fontFamilyLabel: 'Font family',
    sectionTokens: 'Design Tokens',
    tokensIntro: 'Active tokens for the selected Type are highlighted. Switch Type or Brand to see values update.',
    colToken: 'Token',
    colCss: 'CSS Variable',
    colValueWithBrand: (b: string) => `Value (${b})`,
    sectionA11y: 'Accessibility',
    a11yIntro: 'Guidelines for designing inclusive QR Code experiences.',
    sectionUsage: 'Usage',
    usageIntro: 'When and how to reach for each Product Module.',
    whenToUseTitle: '✓ When to use',
    whenNotToUseTitle: '✗ When not to use',
    placeholderText: 'Figma ships 25 concrete variants, and this combination is not one of them. Pick a different Code Type / Product Module / State pairing to see the real design.',
    placeholderAria: 'No Figma export for this variant',
    codeTypeNames: {
      'QR':            'QR',
      'Barcode':       'Barcode',
      'Membership ID': 'Membership ID',
      'Health':        'Health',
    } as Record<CodeType, string>,
    productModuleNames: {
      'Fast Track':          'Fast Track',
      'eSIM':                'eSIM',
      'Lounge':              'Lounge',
      'Dining':              'Dining',
      'All':                 'All',
      'Health and Wellness': 'Health and Wellness',
    } as Record<ProductModule, string>,
    stateNames: {
      'Default':    'Default',
      'Success':    'Success',
      'Generating': 'Generating',
      'Failed':     'Failed',
    } as Record<QRState, string>,
    typeNames: {
      'Dark':  'Dark',
      'Light': 'Light',
    } as Record<QRCodeType, string>,
    a11yRows: [
      { icon: '🏷️', title: 'Semantic labelling', body: 'The code pattern should be exposed to assistive tech with a concise label (e.g. "QR code for eSIM install"). Decorative framing around it — chevrons, wallet icons — must carry its own label or be hidden from the accessibility tree.' },
      { icon: '👁️', title: 'Always provide an alternative', body: 'Not every user can scan with a camera. Pair every code with the same information in text form — a short code, a URL, or a "Copy to clipboard" affordance — so keyboard-only users, users with tremors, and users on desktops can still complete the task.' },
      { icon: '🎨', title: 'Contrast', body: 'Light uses dark glyph on white. Dark uses white glyph on brand primary. Both directions meet WCAG AAA (7:1) for the pattern. Do not re-tint the glyph in brand colors — scanners require strict binary contrast.' },
      { icon: '📏', title: 'Minimum size & quiet zone', body: 'Render the code at 140×140px minimum and never crop the quiet zone around the glyph. Scanner phones need ~4 modules of whitespace on each side to lock on reliably, especially in low light.' },
      { icon: '🧠', title: 'Context & trust', body: 'Always explain what scanning will do (install an eSIM, open a URL, verify identity). Users are increasingly cautious of QR-code phishing — an explicit description paragraph is a trust signal, not just decoration.' },
      { icon: '🔄', title: 'Loading / failed states', body: 'When the code is Generating or Failed, announce the status text to screen readers via aria-live="polite". The Refresh button must be reachable by keyboard when it appears.' },
    ],
    anatomyParts: [
      { num: '1', name: 'Container',    desc: 'Outer card: 16px radius, 1px border on Light, 24px padding, subtle drop-shadow. Background flips to brand primary on Dark.' },
      { num: '2', name: 'Header row',   desc: 'Chevrons for stepping between codes plus an optional Counter ("1 of 2"). Hides entirely on Health and Wellness.' },
      { num: '3', name: 'Code glyph',   desc: 'The scannable pattern. Swaps by Code Type — QR (21×21 modules), Barcode (linear), Membership ID (alphanumeric), Health (wellness glyph).' },
      { num: '4', name: 'Name / card',  desc: '14px weight 600 name and 12px weight 400 card number with 0.04em letter-spacing. Uses foreground-primary and foreground-secondary.' },
      { num: '5', name: 'Description',  desc: 'Optional 11px paragraph capped at ~260px wide, centered. Copy comes from Description Text or Description Text 1.' },
      { num: '6', name: 'Footer / CTA', desc: 'Product-Module-specific: Add to Wallet (eSIM, Lounge), Refresh Button (All · Generating / Failed), or Powered-by footer (Fast Track).' },
    ],
    tokenLabels: {
      cardBgLight:     'Card bg (Light)',
      cardBgDark:      'Card bg (Dark)',
      glyphFgLight:    'Glyph fg (Light)',
      glyphFgDark:     'Glyph fg (Dark)',
      border:          'Border',
      nameText:        'Name text',
      cardNumberDesc:  'Card number / desc',
      offerRibbon:     'Offer ribbon',
      divider:         'Divider',
      failedIcon:      'Failed icon',
      spinner:         'Spinner',
    },
    chipNotes: {
      'QR-21x21':  '21×21 modules',
      'BC-linear': 'linear',
      'MID-alpha': 'alphanumeric',
      'HEALTH':    'wellness glyph',
      'DARK-bg':   'brand-primary bg',
      'LIGHT-bg':  'white bg + border',
      'on':        'default on',
      'off':       'default off',
    } as Record<string, string>,
    fontChips: [
      { text: 'Poppins',  note: 'Dragonpass' },
      { text: 'Arial',    note: 'Mastercard' },
      { text: 'Inter',    note: 'Investec' },
      { text: 'Manrope',  note: 'Visa · Greyscale' },
      { text: 'Lato',     note: 'Assurant' },
    ],
    usageCards: [
      { title: 'Fast Track',          color: '#0a2333', bg: '#f0f4f8', when: "Airport check-in confirmations: show the user what they're checked into, who they are, and when they arrived." },
      { title: 'eSIM',                color: '#0a2333', bg: '#f9fafb', when: 'Mobile-data provisioning flows. Pair the code with explanatory copy so users know what scanning will install.' },
      { title: 'Lounge',              color: '#0a2333', bg: '#f0f9ff', when: 'Airport-lounge access. Show airport name, terminal, and validity window; pair with Add to Wallet.' },
      { title: 'Dining',              color: '#0a2333', bg: '#fef9f4', when: 'Restaurant vouchers and percentage-off offers. Dining Location + Offer Text + Validity is the common shape.' },
      { title: 'All (states)',        color: '#0a2333', bg: '#f8fafc', when: "Generic card for Generating / Failed states. Used across Barcode, Membership ID, and QR when the code isn't ready." },
      { title: 'Health and Wellness', color: '#0a2333', bg: '#f0fdf4', when: 'Paired exclusively with Code Type = Health. Simpler shell without chevrons; presented to staff at wellness venues.' },
    ],
    whenToUse: [
      'Pair every code with a readable alternative — code, URL, or copy button',
      "Pick the Product Module that matches the task — don't genericise",
      'Show Validity where it applies (Lounge, Dining)',
      'Show Status Text + Refresh Button on Generating / Failed states',
      'Use Light on light surfaces, Dark on brand-colored surfaces',
    ],
    whenNotToUse: [
      "Don't rely on the code alone — always pair with a readable alternative",
      "Don't render smaller than 140×140px or remove the quiet-zone padding",
      "Don't re-tint the glyph in brand colors — scanners need binary contrast",
      "Don't mix Product Modules in one screen — pick one that matches the task",
      "Don't hide the Refresh Button while the code is Failed — users need a way out",
    ],
  },
  zh: {
    headline: '二维码',
    taglineLead: '一个多形态的可扫描代码区块。',
    taglineMid: ' 变体会重塑外层卡片以适配快速通道办登机、eSIM 激活、休息室入场、餐饮券、通用状态或健康与保健。字体随品牌通过 ',
    taglineProductModule: '产品模块',
    taglineEnd: ' 自动更新。',
    pillFeedback: '反馈',
    pillStable: '稳定版',
    sectionInteractivePreview: '交互式预览',
    matchesShipped: '匹配 Figma 已发布变体',
    notShipped: '非已发布变体',
    matchesShippedTitle: '此组合与一个已发布的 Figma 变体匹配。',
    notShippedTitle: '此组合不属于 Figma 已发布的 25 个变体之一。',
    railCodeType: '代码类型',
    railProductModule: '产品模块',
    railState: '状态',
    railType: '主题',
    railBooleans: (n: number) => `布尔开关(${n})`,
    railTextSlots: (n: number) => `文本插槽(${n})`,
    sectionAnatomy: '结构剖析',
    anatomyIntro: '所有产品模块共享的结构。每个模块复用或省略以下部件——在预览侧栏中切换可查看效果。',
    sectionVariants: '变体',
    variantsIntroLines: [
      { lead: 'Figma 共发布 ', strong: '25 个具体变体', tail: ',并非四个属性的全部交叉组合。' },
      { lead: '', strong: 'QR', tail: ' 出现在 Fast Track、eSIM、Lounge、Dining 与 All(其中 Generating / Failed 仅在 All 中)。' },
      { lead: '', strong: 'Barcode', tail: ' 与 ' },
      { lead: '', strong: 'Membership ID', tail: ' 仅在 ' },
      { lead: '', strong: 'All', tail: ' 模块中发布。' },
      { lead: '', strong: 'Health', tail: ' 仅出现于 Health and Wellness,并且只有 ' },
      { lead: '', strong: 'Type = Light', tail: '。' },
    ],
    colProperty: '属性',
    colValues: '值',
    fontFamilyLabel: '字体',
    sectionTokens: '设计令牌',
    tokensIntro: '当前所选 Type 对应的活动令牌已高亮。切换 Type 或品牌可查看数值更新。',
    colToken: '令牌',
    colCss: 'CSS 变量',
    colValueWithBrand: (b: string) => `数值(${b})`,
    sectionA11y: '可访问性',
    a11yIntro: '设计包容性二维码体验的指引。',
    sectionUsage: '用法',
    usageIntro: '何时以及如何选择各个产品模块。',
    whenToUseTitle: '✓ 推荐使用',
    whenNotToUseTitle: '✗ 避免使用',
    placeholderText: 'Figma 仅发布了 25 个具体变体,此组合不在其中。请选择不同的代码类型/产品模块/状态搭配以查看真实设计。',
    placeholderAria: '此变体没有对应的 Figma 导出',
    codeTypeNames: {
      'QR':            '二维码',
      'Barcode':       '条形码',
      'Membership ID': '会员 ID',
      'Health':        '健康',
    } as Record<CodeType, string>,
    productModuleNames: {
      'Fast Track':          '快速通道',
      'eSIM':                'eSIM',
      'Lounge':              '休息室',
      'Dining':              '餐饮',
      'All':                 '全部',
      'Health and Wellness': '健康与保健',
    } as Record<ProductModule, string>,
    stateNames: {
      'Default':    '默认',
      'Success':    '成功',
      'Generating': '生成中',
      'Failed':     '失败',
    } as Record<QRState, string>,
    typeNames: {
      'Dark':  '深色',
      'Light': '浅色',
    } as Record<QRCodeType, string>,
    a11yRows: [
      { icon: '🏷️', title: '语义标注', body: '代码图形应通过简明标签暴露给辅助技术(例如「用于安装 eSIM 的二维码」)。周围的装饰框架——箭头、钱包图标等——必须各自带标签或被隐藏在可访问性树之外。' },
      { icon: '👁️', title: '始终提供替代方案', body: '并非所有用户都能用相机扫码。每个代码都应配以同样信息的文本形式——短代码、URL 或「复制到剪贴板」——使仅键盘用户、手部颤抖的用户与桌面端用户都能完成任务。' },
      { icon: '🎨', title: '对比度', body: '浅色版为白底深色图案,深色版为品牌主色底白色图案。两种方向均满足 WCAG AAA(7:1)。请勿用品牌色重新着色图案——扫描器需要严格的二值对比度。' },
      { icon: '📏', title: '最小尺寸与静默区', body: '渲染时不小于 140×140 px,绝不裁剪图案周围的静默区。扫描手机需要每边约 4 个模块的留白才能稳定锁定,尤其在弱光环境中。' },
      { icon: '🧠', title: '上下文与信任', body: '始终说明扫描后会发生什么(安装 eSIM、打开 URL、验证身份)。用户对二维码钓鱼日益警惕——明确的说明段落是信任信号,而非装饰。' },
      { icon: '🔄', title: '加载/失败状态', body: '当代码处于「生成中」或「失败」时,通过 aria-live="polite" 向屏幕阅读器播报状态文本。出现「刷新」按钮时必须可通过键盘到达。' },
    ],
    anatomyParts: [
      { num: '1', name: '容器',       desc: '外层卡片:16 px 圆角,浅色版 1 px 边框,24 px 内边距,微妙投影。深色版背景翻转为品牌主色。' },
      { num: '2', name: '页眉行',     desc: '用于在多个代码间切换的箭头,以及可选的页码计数(如「1 / 2」)。在「健康与保健」中完全隐藏。' },
      { num: '3', name: '代码图形',   desc: '可扫描图案。按代码类型切换:QR(21×21 模块)、Barcode(线性)、Membership ID(字母数字)、Health(健康图形)。' },
      { num: '4', name: '姓名/卡号',  desc: '14 px 600 字重的姓名,12 px 400 字重、0.04em 字距的卡号。使用 foreground-primary 与 foreground-secondary。' },
      { num: '5', name: '说明',       desc: '可选 11 px 段落,最大宽度约 260 px,居中。文案来自「Description Text」或「Description Text 1」。' },
      { num: '6', name: '页脚/CTA',  desc: '随产品模块变化:Add to Wallet(eSIM、Lounge)、刷新按钮(All · Generating / Failed),或 Powered-by 页脚(Fast Track)。' },
    ],
    tokenLabels: {
      cardBgLight:     '卡片背景(浅色)',
      cardBgDark:      '卡片背景(深色)',
      glyphFgLight:    '图形前景(浅色)',
      glyphFgDark:     '图形前景(深色)',
      border:          '边框',
      nameText:        '姓名文字',
      cardNumberDesc:  '卡号/说明',
      offerRibbon:     '促销条带',
      divider:         '分隔线',
      failedIcon:      '失败图标',
      spinner:         '加载指示器',
    },
    chipNotes: {
      'QR-21x21':  '21×21 模块',
      'BC-linear': '线性',
      'MID-alpha': '字母数字',
      'HEALTH':    '健康图形',
      'DARK-bg':   '品牌主色底',
      'LIGHT-bg':  '白底+边框',
      'on':        '默认开',
      'off':       '默认关',
    } as Record<string, string>,
    fontChips: [
      { text: 'Poppins',  note: 'DragonPass' },
      { text: 'Arial',    note: 'Mastercard' },
      { text: 'Inter',    note: 'Investec' },
      { text: 'Manrope',  note: 'Visa · Greyscale' },
      { text: 'Lato',     note: 'Assurant' },
    ],
    usageCards: [
      { title: '快速通道',           color: '#0a2333', bg: '#f0f4f8', when: '机场办登机确认:让用户看到自己已办理的内容、本人身份及到达时间。' },
      { title: 'eSIM',              color: '#0a2333', bg: '#f9fafb', when: '移动数据开通流程。将代码与说明文字搭配,让用户清楚扫码会安装什么。' },
      { title: '休息室',            color: '#0a2333', bg: '#f0f9ff', when: '机场休息室入场。展示机场名称、航站楼与有效期;搭配「Add to Wallet」。' },
      { title: '餐饮',              color: '#0a2333', bg: '#fef9f4', when: '餐厅券与折扣优惠。「餐厅地点 + 优惠文案 + 有效期」是常见组合。' },
      { title: '全部(状态)',       color: '#0a2333', bg: '#f8fafc', when: '用于「生成中/失败」状态的通用卡片。Barcode、Membership ID 与 QR 在代码尚未就绪时均使用。' },
      { title: '健康与保健',         color: '#0a2333', bg: '#f0fdf4', when: '专门搭配「Code Type = Health」。无箭头的简化外壳;在健康场所出示给工作人员。' },
    ],
    whenToUse: [
      '每个代码都搭配可读的替代方案——短代码、URL 或复制按钮',
      '选择与任务匹配的产品模块——不要泛化',
      '在适用场景显示有效期(休息室、餐饮)',
      '在「生成中/失败」状态下显示状态文本与刷新按钮',
      '浅色用于浅色表面,深色用于品牌色表面',
    ],
    whenNotToUse: [
      '不要仅依赖代码本身——始终配以可读的替代方案',
      '不要小于 140×140 px 或移除静默区填充',
      '不要用品牌色重新着色图形——扫描器需要二值对比度',
      '不要在同一屏幕混用多个产品模块——选择与任务匹配的一个',
      '不要在代码失败时隐藏刷新按钮——用户需要出口',
    ],
  },
} as const;

/* ──────────────────────────────────────────────────────────────────────────
 * Backgrounds & helpers
 * ────────────────────────────────────────────────────────────────────────── */

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

function isLightColor(hex: string): boolean {
  const raw = hex.replace('#', '').slice(0, 6);
  if (raw.length < 6) return true;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Figma variant lookup + preview renderer
 * ────────────────────────────────────────────────────────────────────────── */

const VARIANT_SRC: Record<string, string> = {
  'Barcode|All|Failed|Dark':                    barcodeAllFailedDark,
  'Barcode|All|Failed|Light':                   barcodeAllFailedLight,
  'Barcode|All|Generating|Dark':                barcodeAllGeneratingDark,
  'Barcode|All|Generating|Light':               barcodeAllGeneratingLight,
  'Barcode|All|Success|Dark':                   barcodeAllSuccessDark,
  'Barcode|All|Success|Light':                  barcodeAllSuccessLight,
  'Health|Health and Wellness|Default|Light':   healthDefaultLight,
  'Membership ID|All|Default|Dark':             membershipAllDefaultDark,
  'Membership ID|All|Default|Light':            membershipAllDefaultLight,
  'Membership ID|All|Failed|Dark':              membershipAllFailedDark,
  'Membership ID|All|Failed|Light':             membershipAllFailedLight,
  'Membership ID|All|Generating|Dark':          membershipAllGenDark,
  'Membership ID|All|Generating|Light':         membershipAllGenLight,
  'QR|All|Failed|Dark':                         qrAllFailedDark,
  'QR|All|Failed|Light':                        qrAllFailedLight,
  'QR|All|Generating|Dark':                     qrAllGeneratingDark,
  'QR|All|Generating|Light':                    qrAllGeneratingLight,
  'QR|Dining|Success|Dark':                     qrDiningSuccessDark,
  'QR|Dining|Success|Light':                    qrDiningSuccessLight,
  'QR|eSIM|Success|Dark':                       qrESIMSuccessDark,
  'QR|eSIM|Success|Light':                      qrESIMSuccessLight,
  'QR|Fast Track|Success|Dark':                 qrFastTrackSuccessDark,
  'QR|Fast Track|Success|Light':                qrFastTrackSuccessLight,
  'QR|Lounge|Success|Dark':                     qrLoungeSuccessDark,
  'QR|Lounge|Success|Light':                    qrLoungeSuccessLight,
};

interface PreviewState {
  codeType: CodeType;
  productModule: ProductModule;
  state: QRState;
  type: QRCodeType;
  b: Record<string, boolean>;
  t: Record<string, string>;
}

function variantKey(c: CodeType, p: ProductModule, s: QRState, t: QRCodeType): string {
  return `${c}|${p}|${s}|${t}`;
}

function FigmaVariantImage({
  codeType, productModule, state, type,
  maxWidth,
  placeholderText,
  placeholderAria,
}: {
  codeType: CodeType;
  productModule: ProductModule;
  state: QRState;
  type: QRCodeType;
  maxWidth?: number | string;
  placeholderText: string;
  placeholderAria: string;
}) {
  const src = VARIANT_SRC[variantKey(codeType, productModule, state, type)];
  if (!src) {
    return (
      <div
        role="img"
        aria-label={placeholderAria}
        style={{
          width: '100%',
          maxWidth: maxWidth ?? 281,
          aspectRatio: '281 / 485',
          borderRadius: 12,
          border: '1.5px dashed #cbd5e1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24, textAlign: 'center',
          fontFamily: 'var(--atom-font-body, Poppins, sans-serif)',
          fontSize: 12, lineHeight: '18px', color: '#64748b',
          backgroundColor: '#f8fafc',
        }}
      >
        {placeholderText}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={`${codeType} · ${productModule} · ${state} · ${type}`}
      style={{
        width: '100%',
        maxWidth: maxWidth ?? 281,
        height: 'auto',
        display: 'block',
      }}
    />
  );
}

function renderPreview(p: PreviewState, placeholderText: string, placeholderAria: string) {
  return (
    <FigmaVariantImage
      codeType={p.codeType}
      productModule={p.productModule}
      state={p.state}
      type={p.type}
      placeholderText={placeholderText}
      placeholderAria={placeholderAria}
    />
  );
}

const DEFAULT_BOOLEANS = Object.fromEntries(BOOLEAN_PROPS.map(p => [p.name, p.default])) as Record<string, boolean>;
const DEFAULT_TEXTS    = Object.fromEntries(TEXT_PROPS.map(p => [p.name, p.defaultValue]))   as Record<string, string>;

/* ──────────────────────────────────────────────────────────────────────────
 * Shipped-variant lookup
 * ────────────────────────────────────────────────────────────────────────── */

const SHIPPED_VARIANTS: ReadonlySet<string> = new Set([
  'QR|Fast Track|Success|Dark',
  'QR|Fast Track|Success|Light',
  'QR|eSIM|Success|Dark',
  'QR|eSIM|Success|Light',
  'QR|Lounge|Success|Dark',
  'QR|Lounge|Success|Light',
  'QR|Dining|Success|Dark',
  'QR|Dining|Success|Light',
  'QR|All|Generating|Dark',
  'QR|All|Generating|Light',
  'QR|All|Failed|Dark',
  'QR|All|Failed|Light',
  'Barcode|All|Success|Dark',
  'Barcode|All|Success|Light',
  'Barcode|All|Generating|Dark',
  'Barcode|All|Generating|Light',
  'Barcode|All|Failed|Dark',
  'Barcode|All|Failed|Light',
  'Membership ID|All|Default|Dark',
  'Membership ID|All|Default|Light',
  'Membership ID|All|Generating|Dark',
  'Membership ID|All|Generating|Light',
  'Membership ID|All|Failed|Dark',
  'Membership ID|All|Failed|Light',
  'Health|Health and Wellness|Default|Light',
]);

function isShippedVariant(c: CodeType, p: ProductModule, s: QRState, t: QRCodeType): boolean {
  return SHIPPED_VARIANTS.has(`${c}|${p}|${s}|${t}`);
}

function FigmaMatchBadge({ codeType, productModule, state, type, t }: {
  codeType: CodeType;
  productModule: ProductModule;
  state: QRState;
  type: QRCodeType;
  t: {
    matchesShipped: string;
    notShipped: string;
    matchesShippedTitle: string;
    notShippedTitle: string;
  };
}) {
  const shipped = isShippedVariant(codeType, productModule, state, type);
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold',
        shipped
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-amber-50 text-amber-700 border-amber-200',
      ].join(' ')}
      title={shipped ? t.matchesShippedTitle : t.notShippedTitle}
    >
      <span aria-hidden="true">{shipped ? '✓' : '⚠'}</span>
      {shipped ? t.matchesShipped : t.notShipped}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Preview-rail helpers
 * ────────────────────────────────────────────────────────────────────────── */

function ControlSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function Segmented({ values, selected, onSelect, labelMap }: {
  values: string[]; selected: string; onSelect: (v: string) => void; labelMap?: Record<string, string>;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {values.map(v => {
        const active = v === selected;
        return (
          <button
            key={v}
            onClick={() => onSelect(v)}
            style={{
              padding: '4px 9px', fontSize: 11, borderRadius: 6,
              border: '1px solid', cursor: 'pointer', fontWeight: active ? 600 : 500,
              transition: 'all 0.1s ease',
              ...(active
                ? { backgroundColor: '#0f172a', color: '#ffffff', borderColor: '#0f172a' }
                : { backgroundColor: 'transparent', color: '#475569', borderColor: '#e2e8f0' }),
            }}
          >
            {labelMap ? (labelMap[v] ?? v) : v}
          </button>
        );
      })}
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 11, userSelect: 'none' }}>
      <button
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: 14, height: 14, borderRadius: 3, border: '1.5px solid',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, cursor: 'pointer',
          backgroundColor: checked ? '#0f172a' : '#ffffff',
          borderColor: checked ? '#0f172a' : '#cbd5e1',
          transition: 'all 0.1s ease',
        }}
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3l2 2 4-4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span style={{ color: '#475569' }}>{label}</span>
    </label>
  );
}

function TextInput({ label, value, onChange, multiline = false, maxLength = 80 }:
  { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; maxLength?: number }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>{label}</span>
      {multiline ? (
        <textarea
          rows={3} value={value} maxLength={maxLength}
          onChange={e => onChange(e.target.value)}
          style={{
            padding: '6px 8px', fontSize: 11, borderRadius: 4, border: '1px solid #e2e8f0',
            color: '#1f2937', backgroundColor: '#ffffff', resize: 'vertical', fontFamily: 'inherit',
          }}
        />
      ) : (
        <input
          type="text" value={value} maxLength={maxLength}
          onChange={e => onChange(e.target.value)}
          style={{
            padding: '5px 8px', fontSize: 11, borderRadius: 4, border: '1px solid #e2e8f0',
            color: '#1f2937', backgroundColor: '#ffffff',
          }}
        />
      )}
    </label>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Design Tokens catalogue
 * ────────────────────────────────────────────────────────────────────────── */

const TOKEN_TABLE_ROWS: {
  labelKey: keyof typeof COPY.en.tokenLabels;
  cssVar: string; fallback: string; tokenKey?: string; types: QRCodeType[];
}[] = [
  { labelKey: 'cardBgLight',     cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff', types: ['Light'] },
  { labelKey: 'cardBgDark',      cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333', types: ['Dark']  },
  { labelKey: 'glyphFgLight',    cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333', types: ['Light'] },
  { labelKey: 'glyphFgDark',     cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff', types: ['Dark']  },
  { labelKey: 'border',          cssVar: '--atom-border-default-border-default',         tokenKey: 'atom.border.default.border-default',         fallback: '#cdcbcb', types: ['Light'] },
  { labelKey: 'nameText',        cssVar: '--atom-foreground-core-fg-primary',            tokenKey: 'atom.foreground.core.fg-primary',            fallback: '#4b4a4a', types: ['Light', 'Dark'] },
  { labelKey: 'cardNumberDesc',  cssVar: '--atom-foreground-core-fg-secondary',          tokenKey: 'atom.foreground.core.fg-secondary',          fallback: '#737272', types: ['Light'] },
  { labelKey: 'offerRibbon',     cssVar: '--atom-background-core-bg-accent',             tokenKey: 'atom.background.core.bg-accent',             fallback: '#d53f34', types: ['Light', 'Dark'] },
  { labelKey: 'divider',         cssVar: '--atom-border-default-border-divider',         tokenKey: 'atom.border.default.border-divider',         fallback: '#cdcbcb', types: ['Light'] },
  { labelKey: 'failedIcon',      cssVar: '--atom-foreground-feedback-fg-error',          tokenKey: 'atom.foreground.feedback.fg-error',          fallback: '#e02d3c', types: ['Light'] },
  { labelKey: 'spinner',         cssVar: '--atom-foreground-core-fg-link',               tokenKey: 'atom.foreground.core.fg-link',               fallback: '#006b99', types: ['Light', 'Dark'] },
];

/* ──────────────────────────────────────────────────────────────────────────
 * Page
 * ────────────────────────────────────────────────────────────────────────── */

export function QRCodePage({ brand, lang = 'en' }: QRCodePageProps) {
  const t = COPY[lang];
  const tokens = RESOLVED_SEMANTIC_TOKENS[brand];

  // Variant state
  const [codeType,      setCodeType]      = useState<CodeType>('QR');
  const [productModule, setProductModule] = useState<ProductModule>('Fast Track');
  const [state,         setState]         = useState<QRState>('Success');
  const [type,          setType]          = useState<QRCodeType>('Dark');

  // Boolean + text state — initialised from Figma defaults
  const [booleans, setBooleans] = useState<Record<string, boolean>>(() => ({ ...DEFAULT_BOOLEANS }));
  const [texts,    setTexts]    = useState<Record<string, string>>(()  => ({ ...DEFAULT_TEXTS }));

  const setBool = (name: string, v: boolean) => setBooleans(prev => ({ ...prev, [name]: v }));
  const setText = (name: string, v: string)  => setTexts   (prev => ({ ...prev, [name]: v }));

  const previewState: PreviewState = { codeType, productModule, state, type, b: booleans, t: texts };
  const previewKey = [
    codeType, productModule, state, type,
    ...Object.entries(booleans).map(([k, v]) => `${k}:${v}`),
    ...Object.entries(texts   ).map(([k, v]) => `${k}:${v.length}`),
  ].join('|');

  const canvasBg = type === 'Dark' ? DARK_BG : DOTTED_BG;

  return (
    <div className="space-y-10">

      {/* ── 1. INTERACTIVE PREVIEW ───────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.sectionInteractivePreview}</span>
            <FigmaMatchBadge codeType={codeType} productModule={productModule} state={state} type={type} t={t} />
          </div>
          <div className="flex flex-col md:flex-row" style={{ minHeight: 520 }}>

            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center p-10" style={canvasBg}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                >
                  {renderPreview(previewState, t.placeholderText, t.placeholderAria)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls rail — every Figma property is exposed here */}
            <div
              className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-4 flex flex-col gap-4 overflow-y-auto"
              style={{ maxHeight: 720 }}
            >
              <ControlSection title={t.railCodeType}>
                <Segmented values={CODE_TYPES} selected={codeType} onSelect={v => setCodeType(v as CodeType)} labelMap={t.codeTypeNames as Record<string, string>} />
              </ControlSection>

              <ControlSection title={t.railProductModule}>
                <Segmented values={PRODUCT_MODULES} selected={productModule} onSelect={v => setProductModule(v as ProductModule)} labelMap={t.productModuleNames as Record<string, string>} />
              </ControlSection>

              <ControlSection title={t.railState}>
                <Segmented values={QR_STATES} selected={state} onSelect={v => setState(v as QRState)} labelMap={t.stateNames as Record<string, string>} />
              </ControlSection>

              <ControlSection title={t.railType}>
                <Segmented values={QR_TYPES} selected={type} onSelect={v => setType(v as QRCodeType)} labelMap={t.typeNames as Record<string, string>} />
              </ControlSection>

              <ControlSection title={t.railBooleans(BOOLEAN_PROPS.length)}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, rowGap: 6 }}>
                  {BOOLEAN_PROPS.map(p => (
                    <Checkbox key={p.name} label={p.name} checked={booleans[p.name]} onChange={v => setBool(p.name, v)} />
                  ))}
                </div>
              </ControlSection>

              <ControlSection title={t.railTextSlots(TEXT_PROPS.length)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {TEXT_PROPS.map(p => (
                    <TextInput
                      key={p.name}
                      label={p.name}
                      value={texts[p.name]}
                      onChange={v => setText(p.name, v)}
                      multiline={p.name === 'Description Text' || p.name === 'Description Text 1'}
                      maxLength={p.name === 'Description Text' || p.name === 'Description Text 1' ? 240 : 80}
                    />
                  ))}
                </div>
              </ControlSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPONENT INFO ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{t.headline}</h1>
            <p className="text-slate-500 text-sm max-w-xl">
              {t.taglineLead}<em>{t.taglineProductModule}</em>{t.taglineMid}<code className="text-xs bg-slate-100 px-1 rounded">--atom-font-body</code>{t.taglineEnd}
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
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.sectionAnatomy}</h2>
        <p className="text-sm text-slate-500 mb-5">{t.anatomyIntro}</p>

        <div className="relative flex items-center justify-center py-16 px-8 rounded-xl" style={DOTTED_BG}>
          {renderPreview({
            codeType: 'QR',
            productModule: 'eSIM',
            state: 'Success',
            type: 'Light',
            b: DEFAULT_BOOLEANS,
            t: DEFAULT_TEXTS,
          }, t.placeholderText, t.placeholderAria)}
        </div>

        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {t.anatomyParts.map(row => (
            <div key={row.num} style={{ display: 'flex', gap: 10, padding: 12, borderRadius: 8, backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', flexShrink: 0, marginTop: 1, minWidth: 12 }}>{row.num}</span>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827' }}>{row.name}</p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>{row.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. VARIANTS ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.sectionVariants}</h2>
        <p className="text-sm text-slate-500 mb-4">
          {t.variantsIntroLines.map((seg, i) => (
            <span key={i}>{seg.lead}<strong>{seg.strong}</strong>{seg.tail}{i < t.variantsIntroLines.length - 1 ? ' ' : ''}</span>
          ))}
        </p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">{t.colProperty}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.colValues}</th>
              </tr>
            </thead>
            <tbody>
              {([
                {
                  label: t.railCodeType,
                  chips: [
                    { text: t.codeTypeNames['QR'],            note: t.chipNotes['QR-21x21'],  isDefault: true },
                    { text: t.codeTypeNames['Barcode'],       note: t.chipNotes['BC-linear'] },
                    { text: t.codeTypeNames['Membership ID'], note: t.chipNotes['MID-alpha'] },
                    { text: t.codeTypeNames['Health'],        note: t.chipNotes['HEALTH'] },
                  ],
                },
                {
                  label: t.railProductModule,
                  chips: PRODUCT_MODULES.map(m => ({ text: t.productModuleNames[m], note: '', isDefault: m === 'Fast Track' })),
                },
                {
                  label: t.railState,
                  chips: QR_STATES.map(s => ({ text: t.stateNames[s], note: '', isDefault: s === 'Success' })),
                },
                {
                  label: t.railType,
                  chips: [
                    { text: t.typeNames['Dark'],  note: t.chipNotes['DARK-bg'],  isDefault: true },
                    { text: t.typeNames['Light'], note: t.chipNotes['LIGHT-bg'] },
                  ],
                },
                {
                  label: t.railBooleans(BOOLEAN_PROPS.length),
                  chips: BOOLEAN_PROPS.map(p => ({ text: p.name, note: p.default ? t.chipNotes['on'] : t.chipNotes['off'] })),
                },
                {
                  label: t.railTextSlots(TEXT_PROPS.length),
                  chips: TEXT_PROPS.map(p => ({ text: p.name, note: '' })),
                },
                {
                  label: t.fontFamilyLabel,
                  chips: t.fontChips.map(c => ({ text: c.text, note: c.note })),
                },
              ] as { label: string; chips: { text: string; note?: string; isDefault?: boolean }[] }[]).map((row, i, arr) => (
                <tr key={row.label} className={i < arr.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="px-5 py-3.5 font-medium text-slate-700 text-sm align-top">{row.label}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {row.chips.map(({ text, note, isDefault }) => (
                        <span
                          key={text}
                          className={[
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium',
                            isDefault
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'border-slate-200 bg-slate-50 text-slate-600',
                          ].join(' ')}
                        >
                          {text}
                          {note && (
                            <span className={isDefault ? 'text-slate-300 font-normal' : 'text-slate-400 font-normal'}>
                              · {note}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual preview — 10 cards covering every Figma variant axis */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {([
            { id: 'ft-dark',    module: 'Fast Track',          codeType: 'QR'            as CodeType, state: 'Success'    as QRState, type: 'Dark'  as QRCodeType },
            { id: 'esim-light', module: 'eSIM',                codeType: 'QR'            as CodeType, state: 'Success'    as QRState, type: 'Light' as QRCodeType },
            { id: 'lng-dark',   module: 'Lounge',              codeType: 'QR'            as CodeType, state: 'Success'    as QRState, type: 'Dark'  as QRCodeType },
            { id: 'dn-light',   module: 'Dining',              codeType: 'QR'            as CodeType, state: 'Success'    as QRState, type: 'Light' as QRCodeType, bOverride: { Offer: true } },
            { id: 'all-bc',     module: 'All',                 codeType: 'Barcode'       as CodeType, state: 'Success'    as QRState, type: 'Dark'  as QRCodeType },
            { id: 'all-mid',    module: 'All',                 codeType: 'Membership ID' as CodeType, state: 'Default'    as QRState, type: 'Light' as QRCodeType },
            { id: 'all-gen',    module: 'All',                 codeType: 'QR'            as CodeType, state: 'Generating' as QRState, type: 'Dark'  as QRCodeType, bOverride: { 'Refresh Button': true } },
            { id: 'all-fail',   module: 'All',                 codeType: 'QR'            as CodeType, state: 'Failed'     as QRState, type: 'Light' as QRCodeType, bOverride: { 'Refresh Button': true } },
            { id: 'hw',         module: 'Health and Wellness', codeType: 'Health'        as CodeType, state: 'Default'    as QRState, type: 'Light' as QRCodeType },
            { id: 'dn-brand',   module: 'Dining',              codeType: 'QR'            as CodeType, state: 'Success'    as QRState, type: 'Dark'  as QRCodeType, bOverride: { Offer: true, 'Special Brand Logo': true } },
          ] as const).map(v => (
            <div key={v.id} style={{
              padding: '20px 16px', borderRadius: 10,
              border: '1px solid #f3f4f6', backgroundColor: '#fafafa',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#6b7280' }}>{t.productModuleNames[v.module as ProductModule]}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>
                  {t.codeTypeNames[v.codeType]} · {t.stateNames[v.state]} · {t.typeNames[v.type]}
                </p>
              </div>
              {renderPreview({
                codeType: v.codeType,
                productModule: v.module as ProductModule,
                state: v.state,
                type: v.type,
                b: { ...DEFAULT_BOOLEANS, ...('bOverride' in v ? v.bOverride : {}) },
                t: DEFAULT_TEXTS,
              }, t.placeholderText, t.placeholderAria)}
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DESIGN TOKENS ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.sectionTokens}</h2>
        <p className="text-sm text-slate-500 mb-4">{t.tokensIntro}</p>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-44">{t.colToken}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.colCss}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">{t.colValueWithBrand(brand)}</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_TABLE_ROWS.map((row, i) => {
                const isActive      = row.types.includes(type);
                const resolvedValue = row.tokenKey ? (tokens[row.tokenKey as keyof typeof tokens] ?? row.fallback) : row.fallback;
                const swatchHex     = resolvedValue.length > 7 ? resolvedValue.slice(0, 7) : resolvedValue;
                const light         = isLightColor(swatchHex);
                return (
                  <tr
                    key={`${row.cssVar}-${row.labelKey}`}
                    className={[
                      i < TOKEN_TABLE_ROWS.length - 1 ? 'border-b border-slate-100' : '',
                      isActive ? 'bg-blue-50/60' : 'opacity-40',
                      'transition-all duration-150',
                    ].join(' ')}
                    style={isActive ? { borderLeft: '3px solid #3b82f6' } : { borderLeft: '3px solid transparent' }}
                  >
                    <td className="px-5 py-3 font-medium text-slate-700 text-xs">{t.tokenLabels[row.labelKey]}</td>
                    <td className="px-5 py-3">
                      <code className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {row.cssVar}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded flex-shrink-0 border border-black/10" style={{ backgroundColor: swatchHex }} />
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded border"
                          style={{ backgroundColor: swatchHex, color: light ? '#1e293b' : '#f8fafc', borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)' }}>
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
        <h2 className="text-base font-semibold text-slate-900 mb-1">{t.sectionA11y}</h2>
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
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{t.sectionUsage}</h2>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px' }}>{t.usageIntro}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {t.usageCards.map(card => (
            <div key={card.title} style={{ padding: '14px 16px', borderRadius: 10, border: `1px solid ${card.color}22`, backgroundColor: card.bg }}>
              <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 600, color: card.color }}>{card.title}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#4b5563', lineHeight: 1.5 }}>{card.when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#166534' }}>{t.whenToUseTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 12.5, color: '#15803d', lineHeight: 1.4 }}>
              {t.whenToUse.map((line, i) => (
                <li key={i} style={{ marginBottom: i === t.whenToUse.length - 1 ? 0 : 6 }}>• {line}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#991b1b' }}>{t.whenNotToUseTitle}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 12.5, color: '#b91c1c', lineHeight: 1.4 }}>
              {t.whenNotToUse.map((line, i) => (
                <li key={i} style={{ marginBottom: i === t.whenNotToUse.length - 1 ? 0 : 6 }}>• {line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  );
}
