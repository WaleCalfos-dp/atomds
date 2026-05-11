export interface FontPreset {
  label: string;
  value: string;
}

export const FONT_PRESETS: FontPreset[] = [
  { label: 'System default', value: 'system-ui, -apple-system, sans-serif' },
  { label: 'Poppins', value: "'Poppins', sans-serif" },
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Manrope', value: "'Manrope', sans-serif" },
  { label: 'Lato', value: "'Lato', sans-serif" },
  { label: 'Cabin', value: "'Cabin', sans-serif" },
  { label: 'Arial', value: 'Arial, sans-serif' },
];

export const DEFAULT_FONT = FONT_PRESETS[1].value;
