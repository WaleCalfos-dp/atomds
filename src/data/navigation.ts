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

export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    basePath: '/getting-started',
    items: [
      { to: '/getting-started', label: 'Getting started with Atom' },
    ],
  },
  {
    id: 'foundations',
    label: 'Foundations',
    basePath: '/foundations',
    items: [
      { to: '/foundations/brand-foundations', label: 'Brand Foundations' },
      { to: '/foundations/brand-switcher', label: 'Brand Switcher' },
      { to: '/foundations/borders', label: 'Borders' },
      { to: '/foundations/spacing', label: 'Spacing' },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    basePath: '/components',
    items: [
      { to: '/components/alert', label: 'Alert' },
      { to: '/components/button', label: 'Button' },
      { to: '/components/badge', label: 'Badge' },
      { to: '/components/checkbox', label: 'Checkbox' },
      { to: '/components/divider', label: 'Divider' },
      { to: '/components/input', label: 'Input' },
      { to: '/components/line-item', label: 'Line Item' },
      { to: '/components/progress-indicator', label: 'Progress Indicator' },
      { to: '/components/steps', label: 'Steps' },
      { to: '/components/switch', label: 'Switch' },
      { to: '/components/tabs', label: 'Tabs' },
      { to: '/components/tags', label: 'Tags' },
      { to: '/components/tooltip', label: 'Tooltip' },
    ],
  },
];
