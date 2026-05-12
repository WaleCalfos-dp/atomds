import { useEffect, useRef, useState } from 'react'
import type { StudioBrand } from '@atom-core/theming/types'
import { DEFAULT_FONT } from '@atom-core/theming/fonts'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../auth/AuthProvider'

const DEFAULT_SEEDS: StudioBrand['seeds'] = {
  primary: '#006b99',
  secondary: '#d53f34',
  neutral: '#737272',
  success: '#17b26a',
  warning: '#fcbc2c',
  error: '#e02d3c',
}

function makeDefault(userId: string): StudioBrand {
  return {
    id: userId,
    name: 'My brand',
    logo: '',
    font: DEFAULT_FONT,
    seeds: { ...DEFAULT_SEEDS },
  }
}

interface BrandRow {
  user_id: string
  name: string
  logo_url: string | null
  font: string
  seed_primary: string
  seed_secondary: string
  seed_neutral: string
  seed_success: string
  seed_warning: string
  seed_error: string
}

function rowToBrand(row: BrandRow): StudioBrand {
  return {
    id: row.user_id,
    name: row.name,
    logo: row.logo_url ?? '',
    font: row.font,
    seeds: {
      primary: row.seed_primary,
      secondary: row.seed_secondary,
      neutral: row.seed_neutral,
      success: row.seed_success,
      warning: row.seed_warning,
      error: row.seed_error,
    },
  }
}

function brandToRow(userId: string, brand: StudioBrand): BrandRow {
  return {
    user_id: userId,
    name: brand.name,
    logo_url: brand.logo || null,
    font: brand.font,
    seed_primary: brand.seeds.primary,
    seed_secondary: brand.seeds.secondary,
    seed_neutral: brand.seeds.neutral,
    seed_success: brand.seeds.success,
    seed_warning: brand.seeds.warning,
    seed_error: brand.seeds.error,
  }
}

export function useBrand() {
  const { user } = useAuth()
  const [brand, setBrandState] = useState<StudioBrand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    setLoading(true)
    supabase
      .from('brands')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) setError(error.message)
        setBrandState(data ? rowToBrand(data as BrandRow) : makeDefault(user.id))
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  function setBrand(next: StudioBrand) {
    setBrandState(next)
    if (!user) return
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      supabase
        .from('brands')
        .upsert(brandToRow(user.id, next), { onConflict: 'user_id' })
        .then(({ error }) => {
          if (error) setError(error.message)
        })
    }, 300)
  }

  return { brand, setBrand, loading, error }
}
