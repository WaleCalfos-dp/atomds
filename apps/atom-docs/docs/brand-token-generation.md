# Brand-agnostic token generation from 6 seed colours

> **Audience: designers and design-system engineers.** This doc explains how
> the Atom design system can derive its full primitive palette (~90 colours)
> and all 67 atom semantic tokens from just 6 hex inputs per brand. Validated
> against the dragonpass mode in
> [`scripts/raw/brand-switcher-variables.json`](../scripts/raw/brand-switcher-variables.json).

## TL;DR

The brand designer hands over 6 hex codes. The generator emits:

- **~90 primitive colours** — eight 10-stop tonal ramps (Primary, Secondary, Neutral, Error, Success, Warning, Info, Tertiary), plus white/black, plus 8 opacity overlays.
- **67 atom semantic tokens** — every `atom.foreground.*`, `atom.background.*`, `atom.border.*`, and `atom.progress-indicator.*` token used by Atom components.

Run it locally:

```bash
npm install
npm run gen:tokens   # validates byte-for-byte match against dragonpass
npm run gen:demo     # cross-brand smoke + override + out-of-gamut tests
```

## The 6 inputs

| # | Seed | What it represents | Dragonpass anchor value |
|---|---|---|---|
| 1 | `primary` | The brand's signature interactive colour. Lands at **Primary.600**. | `#006b99` |
| 2 | `secondary` | The brand's accent. Lands at **Secondary.500**. | `#d53f34` |
| 3 | `neutral` | The brand's mid-grey. Lands at **Neutral.500**. | `#737272` |
| 4 | `success` | Lands at **Success.500**. | `#17b26a` |
| 5 | `warning` | Lands at **Warning.500**. | `#fcbc2c` |
| 6 | `error` | Lands at **Error.500**. | `#e02d3c` |

White (`#ffffff`) and black (`#000000`) are universal constants, not inputs.

### Why 6, not fewer

- **5 by deriving Neutral from Primary** — rejected. Dragonpass `Neutral.500` is `#737272`, a hue-free pure grey; auto-desaturating Primary `#006b99` would produce a cool grey, drifting from the design intent. Brands deliberately decouple the two.
- **4 by aliasing Error to Secondary** — rejected. They're visually similar reds in dragonpass but used in distinct semantic contexts. Merging them removes the brand designer's ability to make "accent" feel different from "danger".

### Why 6, not more

In dragonpass two derived families come free: **Info ramp = Primary ramp** and **Tertiary ramp = Secondary ramp** (verified line-by-line in the JSON). Treating these as derivations keeps the surface minimal. The universal recipe enforces this for every brand going forward — small visual shift for brands that currently decouple them, big maintenance win.

## The 4-step recipe — plain English

### Step 1 — Generate 10 shades per seed (the tonal ramp)

Each seed becomes 10 shades labelled `50, 100, 200, 300, 400, 500, 600, 700, 800, 900` — `50` lightest, `900` darkest.

**The intuition.** Imagine a painter mixing paint for ten labelled cans. Can `500` (or `600` for Primary) is the brand's pure colour, exactly as the designer provided it. Lighter cans add white; darker cans add black. The recipe says *how much* lightening or darkening to apply at each step. The recipe is *fixed* — every brand uses the same one — so a Primary `100` always feels equally light, whether the underlying colour is dragonpass blue or Mastercard orange.

**The recipe.** We measured the dragonpass primitive palette to extract these recipes. For each colour family we recorded:
- **The lightness step** — how bright each of the 10 shades is on a 0-100% scale. Different families have different curves: Neutrals span an even gradient; Warnings stay bright across most of the ramp; Primary tilts dark.
- **The vividness ratio** — how saturated each shade is relative to the seed. Lighter shades are washed out; mid shades are punchy; darkest shades fade slightly so they don't crush to mud.

**How a single shade is produced.** Given the seed colour, the algorithm:
1. Reads the seed's hue (its position on the colour wheel — blue, orange, red, green).
2. Looks up the target shade's lightness from the recipe.
3. Looks up how vivid the target shade should be (recipe value × the seed's saturation).
4. Combines hue + lightness + vividness into a final colour, then converts it to a hex code.

If the seed equals the dragonpass anchor (e.g. `#006b99` for Primary), the output equals the dragonpass primitive at that shade exactly — because the recipe was measured from those very values. For a different brand seed, the output is a tonal ramp with the same *feel* in that brand's hue.

The maths under the hood uses **OKLCH**, a colour model that matches how the human eye perceives lightness. (It's like HSL but better — HSL's "lightness" lies, OKLCH's doesn't.) The [`culori`](https://culorijs.org/) JS library handles the conversion plus a safety net (`clampChroma`) for the edge case where a requested colour falls outside the screen's gamut.

### Step 2 — Reuse two ramps as derived families

`Info` is identical to `Primary`. `Tertiary` is identical to `Secondary`. No transformation, no extra seed — just direct reuse. This matches dragonpass exactly today and is what the universal recipe enforces for every brand going forward.

### Step 3 — Build the opacity overlays

Eight semi-transparent shades come from two base colours plus a fixed alpha:

| Alpha | Base colour | Hex appended |
|---|---|---|
| 4% | brand-ink (Primary.900) | `0a` |
| 8% | brand-ink | `14` |
| 10% | brand-ink | `1a` |
| 20% | brand-ink | `33` |
| 40% | neutral-black (`#000000`) | `66` |
| 60% | brand-ink | `99` |
| 80% | neutral-black | `cc` |
| 90% | brand-ink | `e5` |

**Brand-ink overlays** carry the brand's hue at low intensity — useful for hover/focus tints over light surfaces. **Neutral-black overlays** are pure neutral, used for modal scrims and muted borders.

(Dragonpass actively uses only 4 of the 8 in its 67 atom tokens — `4%`, `20%`, `40%`, `80%` — but the generator emits all 8 because they're part of the published primitive surface.)

### Step 4 — Resolve the 67 atom tokens via the universal mapping table

Every atom token points to one position in one family. The mapping is **the same for every brand** under the universal recipe.

#### Distinct primitive positions consumed

After deduping, only **27 unique primitive values** back the 67 atom tokens:

| Family | Stops used | Token count |
|---|---|---|
| Primary | 50, 100, 600, 700, 800, 900 | 19 |
| Secondary | 500 | 1 |
| Neutral | 50, 100, 200, 300, 400, 500, 700, white | 14 |
| Error | 50, 100, 500, 700, 800 | 9 |
| Success | 50, 100, 500, 700 | 5 |
| Warning | 50, 100, 600 | 4 |
| Info | 50, 100, 600 | 3 |
| Opacity | 4%, 20%, 40%, 80% | 4 |

**Compression ratio: 67 hand-authored hexes → 6 seeds + 1 universal mapping table.**

#### Full atom-token-to-primitive mapping

```
atom.foreground.core.fg-primary                       → Neutral.700
atom.foreground.core.fg-secondary                     → Neutral.500
atom.foreground.core.fg-tertiary                      → Neutral.300
atom.foreground.core.fg-link                          → Primary.600
atom.foreground.core.fg-interactive-icon              → Primary.600

atom.foreground.primary.fg-brand-primary              → Primary.900
atom.foreground.primary.fg-brand-primary-inverse      → Neutral.white
atom.foreground.primary.fg-brand-secondary            → Primary.700
atom.foreground.primary.fg-brand-hover                → Primary.900

atom.foreground.feedback.fg-success                   → Success.700
atom.foreground.feedback.fg-warning                   → Warning.600
atom.foreground.feedback.fg-error                     → Error.500
atom.foreground.feedback.fg-info                      → Info.600
atom.foreground.feedback.fg-error-pressed             → Error.700
atom.foreground.feedback.fg-error-hover               → Error.800

atom.foreground.states.fg-disabled                    → Neutral.400
atom.foreground.states.fg-hover                       → Primary.700
atom.foreground.states.fg-disabled-inverse            → Neutral.white
atom.foreground.states.fg-pressed                     → Primary.800
atom.foreground.states.fg-pressed-inverse             → Neutral.white

atom.background.primary.bg-primary-default            → Primary.900
atom.background.primary.bg-primary-inverse            → Neutral.white
atom.background.primary.bg-primary-disabled           → Neutral.100
atom.background.primary.bg-primary-hover              → Primary.700
atom.background.primary.bg-primary-pressed            → Primary.800
atom.background.primary.bg-primary-focus              → Primary.900
atom.background.primary.bg-primary-focus-inverse      → Opacity.4%
atom.background.primary.bg-primary-pressed-inverse    → Neutral.50
atom.background.primary.bg-primary-disabled-inverse   → Neutral.50
atom.background.primary.bg-primary-pressed-brand      → Primary.900
atom.background.primary.bg-primary-hover-inverse      → Neutral.white
atom.background.primary.accent                        → Primary.900

atom.background.core.bg-overlay                       → Opacity.80%
atom.background.core.bg-secondary-hover               → Opacity.4%
atom.background.core.bg-muted                         → Opacity.4%
atom.background.core.bg-secondary                     → Neutral.50
atom.background.core.bg-accent                        → Secondary.500

atom.background.alert.bg-success-light                → Success.100
atom.background.alert.bg-warning-default              → Warning.100
atom.background.alert.bg-error-light                  → Error.100
atom.background.alert.bg-info-default                 → Info.100
atom.background.alert.bg-success-lightest             → Success.50
atom.background.alert.bg-warning-lightest             → Warning.50
atom.background.alert.bg-error-lightest               → Error.50
atom.background.alert.bg-info-lightest                → Info.50
atom.background.alert.bg-success-full                 → Success.500
atom.background.alert.bg-error-full                   → Error.500
atom.background.alert.bg-error-hover                  → Error.800
atom.background.alert.bg-error-pressed                → Error.700

atom.border.default.border-default                    → Neutral.200
atom.border.default.border-divider                    → Neutral.200
atom.border.default.border-default-brand              → Primary.900
atom.border.default.border-muted                      → Opacity.40%

atom.border.states.border-disabled                    → Neutral.200
atom.border.states.border-pressed                     → Primary.800
atom.border.states.border-hover                       → Primary.700
atom.border.states.border-interactive                 → Primary.600
atom.border.states.no-interaction                     → Neutral.white

atom.border.selection-and-focus.border-primary-focus  → Primary.900
atom.border.selection-and-focus.border-selected       → Primary.900
atom.border.selection-and-focus.border-brand-hover    → Primary.900
atom.border.selection-and-focus.border-secondary-focus → Opacity.20%

atom.border.feedback.border-error                     → Error.500
atom.border.feedback.border-warning                   → Warning.600
atom.border.feedback.success-border-color             → Success.500
atom.border.feedback.border-info                      → Info.600

atom.progress-indicator.active-color                  → Neutral.white
```

(Source: [`scripts/atom-token-map.ts`](../scripts/atom-token-map.ts).)

## Validation against dragonpass

The validator at [`scripts/validate-dragonpass.ts`](../scripts/validate-dragonpass.ts) runs the generator with the dragonpass anchors as seeds and asserts byte-for-byte equality against `resolvedPalette.Dragonpass` and `resolvedSemanticTokens.Dragonpass` from the source JSON.

```
$ npm run gen:tokens
Generator emitted 90 primitives + 67 atom tokens.
✓ PASS: all 90 primitives + 67 atom tokens match dragonpass byte-for-byte.
```

This is achieved via a fast-path: when a seed equals its family's reference anchor, the generator emits the reference ramp verbatim (no OKLCH round-trip, no rounding error). For seeds that differ, the slow-path applies the OKLCH transformation described in Step 1.

## How to onboard a new brand

1. **Pick the 6 seeds.** Choose hex codes such that:
   - `primary` is the colour you want at Primary.600 (the interactive blue/orange/etc.).
   - `secondary` is the colour you want at Secondary.500 (the accent).
   - `neutral` is your mid-grey (Neutral.500).
   - `success` / `warning` / `error` are at their respective `.500` stops.

2. **Run the generator.** From a Node script:
   ```ts
   import { generateBrandTokens } from './scripts/generate-brand-tokens';
   const { resolvedPalette, resolvedSemanticTokens } = generateBrandTokens({
     primary: '#ea580c',
     secondary: '#f59e0b',
     neutral: '#737373',
     success: '#22c55e',
     warning: '#eab308',
     error: '#dc2626',
   });
   ```

3. **Eyeball the output.** The generator preserves ramp *shape* but adopts brand *hue*. Some stops may not look exactly how you expected — particularly Primary.900 (which becomes the dominant `bg-primary-default` colour). If you want a specific hex at a specific stop, use the override mechanism.

4. **Override individual primitives if needed.** Pass a second argument to nail down specific stops:
   ```ts
   generateBrandTokens(seeds, {
     'colors.Primary.900': '#cf4500',  // pin the brand's button colour
     'colors.Neutral.700': '#262626',  // pin the body-text grey
   });
   ```
   Overrides apply *after* ramp generation and propagate automatically through the atom token mapping (so `bg-primary-default` will pick up the override).

5. **Compare against existing brand JSON if migrating.** For brands already defined in `brand-switcher-variables.json`, run the generator with adjusted seeds and diff the output against the existing values. Discuss with the design lead which divergences are acceptable, which need overrides, and which need a different seed pick.

### Migration notes for existing brands

These trade-offs apply when migrating Mastercard, Investec, Visa, greyscale, or Assurant to the universal recipe. The user has accepted that minor visual shifts are OK to make a single recipe work; per-brand exceptions can use overrides.

- **Mastercard** today uses `bg-primary-default = #cf4500` (Primary.700 in their custom mapping). Under the universal recipe that token is Primary.900. Pick the seed so that Primary.900 lands on `#cf4500` (or override `colors.Primary.900` directly).
- **Visa & greyscale** today set `bg-primary-default = #000000`. Their Primary seed must produce a near-black `.900` — easy for greyscale; for Visa pick a darker Primary seed than today.
- **Investec** today uses `fg-link = #ac6846` (a warm tan from the Tertiary ramp). Under the universal recipe `fg-link` is Primary.600. To preserve the look, Investec needs a Primary seed that lands a warm tan at Primary.600 — a meaningful design conversation, not a transparent migration.

## File reference

| File | Purpose | Lines |
|---|---|---|
| [`scripts/reference-palette.ts`](../scripts/reference-palette.ts) | Dragonpass primitives + family anchors + opacity-base rules | 195 |
| [`scripts/atom-token-map.ts`](../scripts/atom-token-map.ts) | The 67-row universal atom-to-primitive mapping | 110 |
| [`scripts/generate-brand-tokens.ts`](../scripts/generate-brand-tokens.ts) | The generator (`generateBrandTokens(seeds, overrides?)`) | 200 |
| [`scripts/validate-dragonpass.ts`](../scripts/validate-dragonpass.ts) | Byte-for-byte assertion against the source JSON | 80 |
| [`scripts/demo-cross-brand.ts`](../scripts/demo-cross-brand.ts) | Cross-brand smoke + override + out-of-gamut demos | 90 |

## Out of scope

- **Refactoring `src/index.css`** to compute values at build time. This deliverable is pure tooling — wiring the generator into the React runtime is a follow-up.
- **Migrating existing brands** (Mastercard etc.) onto the universal recipe — each is a design conversation about acceptable visual drift.
- **Adding the AeroBlue brand to the React app** — separate task, but the generator unlocks it (provide 6 seeds, get the palette).
