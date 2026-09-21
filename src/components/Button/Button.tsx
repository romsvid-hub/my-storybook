import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'primary-light' | 'secondary' | 'secondary-light' | 'text'
export type ButtonSize = 'm' | 's'
/** Figma `Interface`. Figma defines `destructive` only for size S and only for primary, secondary and primary-light. */
export type ButtonIntent = 'business' | 'searcher' | 'destructive'

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** Figma `Type`. */
  variant?: ButtonVariant
  /** Figma `Size`: M is 48px high, S is 40px. */
  size?: ButtonSize
  /** Figma `Interface`: colour family of the button. */
  intent?: ButtonIntent
  /** Figma `State=Selected` (sets `aria-pressed`). */
  selected?: boolean
  /** Element before the label (Figma `Icon=Left`). */
  iconLeft?: ReactNode
  /** Element after the label (Figma `Icon=Right`). With both icons: `Icon=Two sides`. */
  iconRight?: ReactNode
  /** Label. Without a label the button is icon-only (Figma `Icon=Icon`). */
  children?: ReactNode
}

// Colours are CSS variables from tokens.css (Figma variable names in the comments).
const token = (name: string) => `var(--color-semantic-${name})`
const white = token('text-text-inverse') // Semantic/Text/Text_inverse
const mixWhite = (percent: number) => `color-mix(in srgb, ${white} ${percent}%, transparent)`
const focusBorder = token('border-border-focus')
const cardBg = token('background-bg-card')
const disabledBg = token('background-bg-disabled')
const disabledText = token('text-text-dissable')
const disabledIcon = token('icon-icon-dissabled')
const none = 'transparent'
const stroke1 = 'var(--spacing-stroke-stroke-1)'
const stroke2 = 'var(--spacing-stroke-stroke-2)'
const noStroke = 'var(--spacing-xs-space-0)'

type Palette = { main: string; dark: string; light: string; soft: string; accent: string; disabledStroke: string }

const palettes: Record<ButtonIntent, Palette> = {
  business: {
    main: token('brand-colors-accent-accnt-bus-main'),
    dark: token('brand-colors-accent-accnt-bus-txt'),
    light: token('brand-colors-accent-accnt-bus-bg-light'),
    soft: token('brand-colors-accent-accnt-bus-stroke-soft'),
    accent: token('brand-colors-accent-accnt-bus-main'),
    disabledStroke: token('border-dissabled'),
  },
  searcher: {
    main: token('brand-colors-accent-accnt-user-main'),
    dark: token('brand-colors-accent-accnt-user-txt'),
    light: token('brand-colors-accent-accnt-user-bg-light'),
    soft: token('brand-colors-accent-accnt-user-stroke-soft'),
    accent: token('text-text-main'),
    disabledStroke: token('border-border-input-text-area'),
  },
  destructive: {
    main: token('status-status-error-bg-inverse'),
    dark: token('status-status-error-txt'),
    light: token('status-status-error-bg'),
    soft: token('status-status-error-border'),
    accent: token('status-status-error-bg-inverse'),
    disabledStroke: token('border-dissabled'),
  },
}

type Look = { bg: string; hover: string; press: string; fg: string; border: string; borderWidth: string }

function look(variant: ButtonVariant, intent: ButtonIntent, selected: boolean, disabled: boolean): Look {
  const p = palettes[intent]
  const filled = variant === 'primary' || variant === 'primary-light'
  const outlined = variant === 'secondary' || variant === 'secondary-light'

  if (disabled) {
    return filled
      ? { bg: disabledBg, hover: disabledBg, press: disabledBg, fg: disabledText, border: none, borderWidth: noStroke }
      : {
          bg: none, hover: none, press: none, fg: disabledIcon,
          border: outlined ? p.disabledStroke : none, borderWidth: outlined ? stroke1 : noStroke,
        }
  }

  if (selected) {
    const fg = variant === 'primary' || variant === 'secondary-light' ? white : p.accent
    const bg =
      variant === 'primary' ? (intent === 'searcher' ? p.dark : p.main)
      : variant === 'primary-light' ? white
      : variant === 'text' && intent === 'searcher' ? cardBg
      : none
    return { bg, hover: bg, press: bg, fg, border: focusBorder, borderWidth: stroke2 }
  }

  switch (variant) {
    case 'primary':
      return { bg: p.main, hover: p.dark, press: p.dark, fg: white, border: none, borderWidth: noStroke }
    case 'primary-light':
      return { bg: white, hover: p.light, press: p.soft, fg: p.accent, border: none, borderWidth: noStroke }
    case 'secondary':
      return { bg: none, hover: p.light, press: p.soft, fg: p.accent, border: p.accent, borderWidth: stroke1 }
    case 'secondary-light':
      return { bg: none, hover: mixWhite(20), press: mixWhite(40), fg: white, border: white, borderWidth: stroke1 }
    case 'text':
      return { bg: none, hover: p.light, press: p.soft, fg: p.accent, border: none, borderWidth: noStroke }
  }
}

const base =
  'box-border inline-flex shrink-0 cursor-pointer items-center justify-center gap-s-space-8 whitespace-nowrap ' +
  'border-solid border-[length:var(--button-border-width)] border-(color:--button-border) ' +
  'rounded-[var(--spacing-semantic-radius-radius-button)] ' +
  'bg-(--button-bg) st-hover:bg-(--button-hover) st-press:bg-(--button-press) text-(color:--button-fg) ' +
  'font-[family-name:var(--typography-font-family-base),sans-serif] ' +
  'font-[number:var(--typography-raw-weight-medium)] leading-[var(--typography-raw-line-height-lh-24)] ' +
  'disabled:cursor-not-allowed'

const sizes = {
  m: {
    box: 'h-xl-space-48 text-[length:var(--typography-raw-size-size-18)]',
    padding: {
      none: 'px-l-space-24', left: 'pl-m-space-20 pr-l-space-24', right: 'pl-l-space-24 pr-m-space-20',
      two: 'px-m-space-20', only: 'p-s-space-12',
    },
  },
  s: {
    box: 'h-xl-space-40 text-[length:var(--typography-raw-size-size-16)]',
    padding: {
      none: 'px-m-space-16', left: 'pl-s-space-12 pr-m-space-16', right: 'pl-m-space-16 pr-s-space-12',
      two: 'px-s-space-12', only: 'p-s-space-8',
    },
  },
} as const

const slot = 'flex size-l-space-24 shrink-0 items-center justify-center'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary', size = 'm', intent = 'business', selected = false, iconLeft, iconRight,
    children, className, style, disabled = false, type = 'button', ...rest
  },
  ref,
) {
  const hasLabel = children !== undefined && children !== null && children !== ''
  const pad =
    !hasLabel && (iconLeft || iconRight) ? 'only'
    : iconLeft && iconRight ? 'two'
    : iconLeft ? 'left'
    : iconRight ? 'right'
    : 'none'
  const l = look(variant, intent, selected, disabled)
  const vars = {
    '--button-bg': l.bg, '--button-hover': l.hover, '--button-press': l.press,
    '--button-fg': l.fg, '--button-border': l.border, '--button-border-width': l.borderWidth,
  } as CSSProperties

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-pressed={selected ? true : undefined}
      className={[base, sizes[size].box, sizes[size].padding[pad], className].filter(Boolean).join(' ')}
      style={{ ...vars, ...style }}
      {...rest}
    >
      {iconLeft && <span className={slot} aria-hidden>{iconLeft}</span>}
      {hasLabel && <span>{children}</span>}
      {iconRight && <span className={slot} aria-hidden>{iconRight}</span>}
    </button>
  )
})
