import { type Brand } from '../data/tokens';
import { type Language } from '../data/languages';
import { DocsTemplate, DOTTED_BG, type DocsCopy } from '../components/DocsTemplate';

interface PageProps { brand: Brand; lang?: Language }

const COPY: Record<Language, DocsCopy> = {
  en: {
    headline: 'Country Code Dropdown',
    tagline: 'Allows users to select a country code before entering a phone number to ensure correct international formatting. Pair with phone-number Inputs in registration, checkout, contact, and verification forms.',
    badgeFeedback: 'Input · Specialty', badgeStable: 'Stable',
    sectionAnatomy: 'Anatomy', sectionVariants: 'Variants', sectionTokens: 'Design Tokens', sectionA11y: 'Accessibility', sectionUsage: 'Usage',
    columnProperty: 'Property', columnValues: 'Values', columnUsage: 'Usage', columnCssVar: 'CSS Variable',
    valueColumnTpl: (b) => `Value (${b})`,
    anatomyIntro: 'A specialised Select that surfaces country names alongside their dialling codes and an optional flag glyph.',
    anatomyParts: [
      { num: '1', name: 'Trigger', desc: '40px-tall pill matching Select. Shows the currently selected country and dialling code (e.g. "England (+44)"). Opens the menu on click.' },
      { num: '2', name: 'Menu', desc: 'Scrollable list of countries with checkbox-style selection. Each row shows country name + dialling code in monospace.' },
      { num: '3', name: 'Country row', desc: 'Each row toggles via the Country 1/2/3 booleans. Defaults: England (+44), Andorra (+376), Belgium (+32).' },
    ],
    variantRows: [
      { prop: 'Type', vals: 'Country (only published value, default)' },
      { prop: 'Booleans (3)', vals: 'Country 1 (default on), Country 2 (default on), Country 3 (default on)' },
      { prop: 'Text slots (3)', vals: 'Country Text 1 (default "England (+44)"), Country Text 2 (default "Andorra (+376)"), Country Text 3 (default "Belgium (+32)")' },
    ],
    tokensIntroLead: 'Country Code Dropdown inherits Select tokens for its trigger and menu surfaces.',
    tokenRows: [
      { label: 'Trigger bg',  cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: 'Trigger fg',  cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
      { label: 'Border',      cssVar: '--atom-border-default-border-default',         tokenKey: 'atom.border.default.border-default',         fallback: '#cdcbcb' },
      { label: 'Menu hover',  cssVar: '--atom-background-core-bg-secondary-hover',    tokenKey: 'atom.background.core.bg-secondary-hover',    fallback: '#0a23330a' },
    ],
    a11yIntro: 'Behaviour mirrors Select. Treat the dropdown as a single combobox with a labelled menu of options.',
    a11yRows: [
      { icon: '🏷️', title: 'Label association', body: 'Always include a visible Label (e.g. "Country code"). The trigger uses role="combobox" with aria-labelledby pointing at the label.' },
      { icon: '⌨️', title: 'Keyboard interaction', body: 'Open with Enter / Space / Down. Use arrow keys to navigate the country list. Type-ahead jumps to the next matching country (e.g. typing "B" jumps to Belgium).' },
      { icon: '🌍', title: 'Localisation', body: 'Country names should localise per active language. Dialling codes (+44, +376, …) are universal — never translate them.' },
      { icon: '🎨', title: 'Color contrast', body: 'Country name and dialling code text on white meet WCAG AA 4.5:1 across all 6 brands.' },
    ],
    usageIntro: 'A pairing component, not a standalone control.',
    usageCards: [
      { title: 'With Phone Number Input', when: 'The most common pairing. Place the dropdown immediately before the phone number Input so the dialling code prefixes the number visually.' },
      { title: 'In a Registration form', when: 'Use early in the form so users can confirm their region. Default to a sensible value based on geo-IP, but never hide the control.' },
      { title: 'For SMS verification', when: 'Critical that the dialling code is explicit — SMS routing depends on it. Pair with a "We will send you a code" hint below.' },
    ],
    whenToUseTitle: '✓ When to use', whenNotToUseTitle: '✗ When not to use',
    whenToUse: [
      'Pair with phone number Inputs in registration, contact, and verification forms',
      'Show the user-visible dialling code, not just the country name',
      'Default to the current language\'s likely region',
      'Allow type-ahead search across the country list',
    ],
    whenNotToUse: [
      "Don't use as a generic country picker — use Select with country flags instead",
      "Don't auto-submit when a country is chosen — wait for the user to type the phone number",
      "Don't omit the visible dropdown — assuming geo-IP is correct frustrates international users",
      "Don't strip the dialling code from the value — store the full E.164 phone format",
    ],
  },
  zh: {
    headline: '国家代码下拉',
    tagline: '允许用户在输入电话号码前选择国家代码,以确保国际格式正确。与注册、结账、联系、验证表单中的电话输入框配对。',
    badgeFeedback: '输入 · 专用', badgeStable: '稳定版',
    sectionAnatomy: '结构剖析', sectionVariants: '变体', sectionTokens: '设计令牌', sectionA11y: '可访问性', sectionUsage: '用法',
    columnProperty: '属性', columnValues: '可选值', columnUsage: '用途', columnCssVar: 'CSS 变量',
    valueColumnTpl: (b) => `值 (${b})`,
    anatomyIntro: '一种专用的选择器,展示国家名称、拨号代码和可选国旗符号。',
    anatomyParts: [
      { num: '1', name: '触发器', desc: '40px 高度的胶囊,样式与 Select 一致。显示当前选中的国家及拨号代码(例如 "England (+44)")。点击后打开菜单。' },
      { num: '2', name: '菜单', desc: '可滚动的国家列表,采用复选框式选择。每行显示国家名称 + 等宽拨号代码。' },
      { num: '3', name: '国家行', desc: '每一行通过 Country 1/2/3 布尔值切换。默认值:England (+44)、Andorra (+376)、Belgium (+32)。' },
    ],
    variantRows: [
      { prop: '类型', vals: 'Country(已发布的唯一取值,默认)' },
      { prop: '布尔值 (3)', vals: 'Country 1(默认开)、Country 2(默认开)、Country 3(默认开)' },
      { prop: '文本插槽 (3)', vals: 'Country Text 1(默认 "England (+44)")、Country Text 2(默认 "Andorra (+376)")、Country Text 3(默认 "Belgium (+32)")' },
    ],
    tokensIntroLead: '国家代码下拉继承 Select 的令牌,用于触发器和菜单表面。',
    tokenRows: [
      { label: '触发器背景',  cssVar: '--atom-background-primary-bg-primary-inverse', tokenKey: 'atom.background.primary.bg-primary-inverse', fallback: '#ffffff' },
      { label: '触发器前景',  cssVar: '--atom-foreground-primary-fg-brand-primary',   tokenKey: 'atom.foreground.primary.fg-brand-primary',   fallback: '#0a2333' },
      { label: '边框',        cssVar: '--atom-border-default-border-default',         tokenKey: 'atom.border.default.border-default',         fallback: '#cdcbcb' },
      { label: '菜单悬停',    cssVar: '--atom-background-core-bg-secondary-hover',    tokenKey: 'atom.background.core.bg-secondary-hover',    fallback: '#0a23330a' },
    ],
    a11yIntro: '行为与 Select 相同。将下拉视为单一 combobox,菜单为带标签的选项列表。',
    a11yRows: [
      { icon: '🏷️', title: '标签关联', body: '始终包含可见标签(例如 "国家代码")。触发器使用 role="combobox" 并通过 aria-labelledby 指向标签。' },
      { icon: '⌨️', title: '键盘交互', body: '使用 Enter / 空格 / 向下打开。方向键浏览列表。键入字符跳转到匹配的下一个国家(例如键入 "B" 跳转到 Belgium)。' },
      { icon: '🌍', title: '本地化', body: '国家名称应根据当前语言本地化。拨号代码(+44、+376 等)是国际通用的——切勿翻译。' },
      { icon: '🎨', title: '颜色对比度', body: '国家名称和拨号代码文字在白色背景上,所有 6 个品牌均满足 WCAG AA 4.5:1。' },
    ],
    usageIntro: '配对组件,不能独立使用。',
    usageCards: [
      { title: '与电话输入框配对', when: '最常见的配对。将下拉放在电话输入框之前,让拨号代码视觉上作为号码前缀。' },
      { title: '在注册表单中', when: '在表单较早位置使用,让用户确认所在区域。可基于 geo-IP 设置默认值,但绝不要隐藏控件。' },
      { title: '用于短信验证', when: '拨号代码必须显式——短信路由依赖于它。下方搭配 "我们会向您发送验证码" 提示。' },
    ],
    whenToUseTitle: '✓ 推荐使用', whenNotToUseTitle: '✗ 避免使用',
    whenToUse: [
      '在注册、联系、验证表单中与电话输入框配对',
      '展示用户可见的拨号代码,而不仅仅是国家名称',
      '默认值采用当前语言的可能区域',
      '允许在国家列表中输入字符快速搜索',
    ],
    whenNotToUse: [
      '不要将其作为通用国家选择器——请改用带国旗的 Select',
      '不要在选择国家后自动提交——等待用户输入电话号码',
      '不要省略可见的下拉——假设 geo-IP 正确会让国际用户感到困扰',
      '不要从值中剥离拨号代码——以 E.164 完整电话格式存储',
    ],
  },
};

export function CountryCodeDropdownPage({ brand, lang = 'en' }: PageProps) {
  const t = COPY[lang];
  const preview = (
    <div className="flex items-start justify-center p-12" style={{ ...DOTTED_BG, minHeight: 360 }}>
      <div style={{ width: 320, fontFamily: 'var(--atom-font-body, Poppins, sans-serif)' }}>
        <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 500, color: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)' }}>
          {lang === 'zh' ? '国家代码' : 'Country code'}
        </label>
        <div style={{ width: '100%', minHeight: 40, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'var(--atom-background-primary-bg-primary-inverse, #ffffff)', border: '1px solid var(--atom-border-default-border-default, #cdcbcb)', borderRadius: 8, fontSize: 13 }}>
          <div style={{ width: 18, height: 12, borderRadius: 2, background: 'linear-gradient(to bottom, #ce1126 33%, #ffffff 33%, #ffffff 66%, #002868 66%)' }} />
          <span style={{ flex: 1, color: 'var(--atom-foreground-primary-fg-brand-primary, #0a2333)' }}>England (+44)</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 5L7 8.5L10.5 5" stroke="#0a2333" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </div>
        <div style={{ marginTop: 6, border: '1px solid var(--atom-border-default-border-default, #cdcbcb)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 10px 24px rgba(10,35,51,0.12)' }}>
          {[['England', '+44'], ['Andorra', '+376'], ['Belgium', '+32']].map(([name, code], i) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderBottom: i < 2 ? '1px solid var(--atom-border-default-border-divider, #cdcbcb)' : 'none', fontSize: 13 }}>
              <span style={{ width: 16, height: 16, borderRadius: 3, border: i === 0 ? '1.5px solid #0a2333' : '1.5px solid #cdcbcb', backgroundColor: i === 0 ? '#0a2333' : 'transparent' }} />
              <span style={{ flex: 1 }}>{name}</span>
              <span style={{ fontFamily: 'monospace', color: '#737272' }}>{code}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  return <DocsTemplate brand={brand} preview={preview} t={t} />;
}
