import { useMemo } from 'react';
import { buildStudioCss } from '../../lib/brandStudio/cssBuilder';
import type { StudioBrand } from '../../lib/brandStudio/types';
import { ButtonLive } from '../button/ButtonLive';
import { BadgeLive } from '../badge/BadgeLive';
import { AlertLive } from '../alert/AlertLive';
import { InputLive } from '../input/InputLive';

interface BrandPreviewProps {
  brand: StudioBrand;
}

// Renders a small sample of components themed by the supplied brand.
// Uses a unique data-brand value (`studio-preview`) so the preview is
// isolated from whatever brand the surrounding app has applied. The CSS
// block injected here only matches the preview wrapper.
export function BrandPreview({ brand }: BrandPreviewProps) {
  const css = useMemo(() => {
    try {
      return buildStudioCss(brand, '[data-brand-studio-preview="on"]');
    } catch {
      return null;
    }
  }, [brand]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
        <span className="text-xs text-slate-500">
          {css ? "Live render with this brand's tokens" : 'Waiting for valid seed colours…'}
        </span>
      </div>
      {css && <style>{css}</style>}
      <div
        data-brand-studio-preview="on"
        className="p-6 border border-slate-200 rounded-lg bg-white space-y-6"
        style={{ fontFamily: brand.font }}
      >
        <Section title="Buttons">
          <div className="flex flex-wrap gap-3 items-center">
            <ButtonLive variant="Primary" label="Primary" />
            <ButtonLive variant="Secondary" label="Secondary" />
            <ButtonLive variant="Tertiary" label="Tertiary" />
          </div>
        </Section>

        <Section title="Badges">
          <div className="flex flex-wrap gap-2 items-center">
            <BadgeLive state="Brand" label="Brand" />
            <BadgeLive state="Success" label="Success" />
            <BadgeLive state="Warning" label="Warning" />
            <BadgeLive state="Error" label="Error" />
            <BadgeLive state="Information" label="Information" />
          </div>
        </Section>

        <Section title="Alerts">
          <div className="space-y-2">
            <AlertLive type="Success" title="Success" description="Operation completed." />
            <AlertLive type="Warning" title="Warning" description="Please double-check." />
            <AlertLive type="Error" title="Error" description="Something went wrong." />
          </div>
        </Section>

        <Section title="Inputs">
          <div className="max-w-sm">
            <InputLive label="Email" placeholder="you@example.com" />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}
