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
    id: 'tools',
    label: 'Tools',
    basePath: '/portal',
    items: [
      { to: '/portal', label: 'White-label Portal' },
      { to: '/portal/mapping', label: 'Token Mapping' },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    basePath: '/components',
    items: [
      { to: '/components/accordion', label: 'Accordion' },
      { to: '/components/alert', label: 'Alert' },
      { to: '/components/avatar', label: 'Avatar' },
      { to: '/components/badge', label: 'Badge' },
      { to: '/components/breadcrumbs', label: 'Breadcrumbs' },
      { to: '/components/button', label: 'Button' },
      { to: '/components/button-group', label: 'Button Group' },
      { to: '/components/card', label: 'Card' },
      { to: '/components/checkbox', label: 'Checkbox' },
      { to: '/components/data-row', label: 'Data Row' },
      { to: '/components/data-group', label: 'Data Group' },
      { to: '/components/data-group-no-slot', label: 'Data Group (No Slot)' },
      { to: '/components/date-picker', label: 'Date Picker' },
      { to: '/components/dialog', label: 'Dialog' },
      { to: '/components/divider', label: 'Divider' },
      { to: '/components/input', label: 'Input' },
      { to: '/components/line-item', label: 'Line Item' },
      { to: '/components/list-item', label: 'List Item' },
      { to: '/components/media', label: 'Media' },
      { to: '/components/progress-indicator', label: 'Progress Indicator' },
      { to: '/components/qr-code', label: 'QR Code' },
      { to: '/components/quantity-stepper', label: 'Quantity Stepper' },
      { to: '/components/select', label: 'Select' },
      { to: '/components/stepper', label: 'Stepper' },
      { to: '/components/steps', label: 'Steps' },
      { to: '/components/switch', label: 'Switch' },
      { to: '/components/tabs', label: 'Tabs' },
      { to: '/components/tags', label: 'Tags' },
      { to: '/components/tiles', label: 'Tiles' },
      { to: '/components/time-picker', label: 'Time Picker' },
      { to: '/components/toast', label: 'Toast' },
      { to: '/components/tooltip', label: 'Tooltip' },
      { to: '/components/transport-card', label: 'Transport Card' },
    ],
  },
];
