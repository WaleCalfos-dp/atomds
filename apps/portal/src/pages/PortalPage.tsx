import { useMemo } from 'react'
import { buildStudioCss } from '@atom-core/theming/cssBuilder'
import { AlertLive, BadgeLive, ButtonLive, CardLive, InputLive } from '@atom-core'
import { useAuth } from '../auth/AuthProvider'
import { useBrand } from '../hooks/useBrand'
import { BrandEditorForm } from '../components/BrandEditorForm'

const PREVIEW_SELECTOR = '[data-brand-portal="on"]'

export default function PortalPage() {
  const { user, signOut } = useAuth()
  const { brand, setBrand, loading, error } = useBrand()

  // The selector below scopes the generated `--atom-*` variables to the preview wrapper.
  // If the wrapping element is ever moved, the cascade no longer applies — keep the
  // <style> tag and the [data-brand-portal="on"] node siblings/ancestor-descendant.
  const css = useMemo(() => (brand ? buildStudioCss(brand, PREVIEW_SELECTOR) : ''), [brand])

  if (loading || !brand) return <div className="p-6 text-sm text-gray-500">Loading…</div>

  return (
    <div className="min-h-screen p-6 grid gap-6 lg:grid-cols-[360px_1fr]">
      <BrandEditorForm value={brand} onChange={setBrand} onSignOut={signOut} email={user?.email} />

      <section className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <style>{css}</style>
        <div
          data-brand-portal="on"
          style={{ fontFamily: brand.font }}
          className="space-y-5 p-8 bg-white border border-gray-200 rounded-md"
        >
          <h3 className="text-sm uppercase tracking-wide text-gray-500">Live preview</h3>
          <div className="flex flex-wrap gap-3">
            <ButtonLive variant="Primary" label="Primary action" />
            <ButtonLive variant="Secondary" label="Secondary" />
          </div>
          <InputLive label="Email" placeholder="you@example.com" />
          <div className="flex flex-wrap gap-2">
            <BadgeLive state="Success" label="Active" />
            <BadgeLive state="Warning" label="Pending" />
            <BadgeLive state="Error" label="Declined" />
            <BadgeLive state="Information" label="Info" />
          </div>
          <AlertLive type="Error" title="Card declined" description="Try a different payment method." />
          <AlertLive type="Success" title="Saved" description="Your brand is up to date." />
          <CardLive titleText={brand.name} bodyText="This card repaints as you edit your brand seeds." />
        </div>
      </section>
    </div>
  )
}
