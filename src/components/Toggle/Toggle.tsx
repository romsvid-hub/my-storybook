import { useId, useState, type ButtonHTMLAttributes, type MouseEvent } from 'react'

// Spec (PRD): https://app.notion.com/p/3ec0695cf333818d9ea1df9c4f908736
// Design (Figma): https://www.figma.com/design/a42eTgy6hzjmFWrVymHdfG/ATJ-copy-_Main_design_file?node-id=524-13936

/** Figma `size`: regular track is 32×16, large is 48×24. */
export type ToggleSize = 'regular' | 'large'
/** Colour of the ON track: business (blue) or user (terracotta). */
export type ToggleTone = 'business' | 'user'
export type ToggleLabelPosition = 'start' | 'end'

export type ToggleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'onError' | 'children' | 'role' | 'type'
> & {
  /** Figma `isChecked`. The toggle is controlled: pass the current value and update it in `onChange`. */
  checked: boolean
  /** Called once per click / Space / Enter with the next value. Return a Promise to show the loading state until it settles; if it rejects, `checked` stays as it was. */
  onChange?: (next: boolean) => void | Promise<unknown>
  /** Called when the Promise returned from `onChange` rejects. */
  onError?: (error: unknown) => void
  /** Figma `size`. */
  size?: ToggleSize
  /** ON-track colour. */
  tone?: ToggleTone
  /** Figma `isDisabled`. Wins over `loading`. */
  disabled?: boolean
  /** Figma `isLoading`: shows a spinner in the thumb and ignores clicks. */
  loading?: boolean
  /** Visible label (Figma `Toggle With label`); also the switch's accessible name. */
  label?: string
  /** Label before or after the switch. */
  labelPosition?: ToggleLabelPosition
}

// Geometry comes from the spacing tokens: thumb inset 2, thumb 12 / 20, travel 16 / 24.
const sizes: Record<ToggleSize, { track: string; thumb: string; on: string; spinner: string }> = {
  regular: {
    // The 16px track gets an invisible 24px-high hit area.
    track: 'h-m-space-16 w-l-space-32 before:absolute before:-inset-y-xs-space-4 before:inset-x-xs-space-0',
    thumb: 'size-s-space-12',
    on: 'translate-x-m-space-16 rtl:-translate-x-m-space-16',
    spinner: 'size-s-space-8',
  },
  large: {
    track: 'h-l-space-24 w-xl-space-48',
    thumb: 'size-m-space-20',
    on: 'translate-x-l-space-24 rtl:-translate-x-l-space-24',
    spinner: 'size-s-space-12',
  },
}

const tones: Record<ToggleTone, { on: string; spinner: string }> = {
  business: {
    on: 'bg-Semantic-Brand-colors-Accent-accnt_bus_main', // Semantic/Brand colors/Accent/accnt_bus_main
    spinner: 'text-Semantic-Brand-colors-Accent-accnt_bus_main',
  },
  user: {
    on: 'bg-Semantic-Brand-colors-Accent-accnt_user_main', // Semantic/Brand colors/Accent/accnt_user_main
    spinner: 'text-Semantic-Brand-colors-Accent-accnt_user_main',
  },
}

// There is no preflight in this project, so the native button look is reset here.
const track =
  'group relative m-0 box-border inline-flex shrink-0 appearance-none border-0 p-0 ' +
  'rounded-[var(--spacing-semantic-radius-radius-full)] transition-colors duration-200 motion-reduce:transition-none outline-none ' +
  'st-focus:outline-solid st-focus:outline-[length:var(--spacing-stroke-stroke-2)] ' +
  'st-focus:outline-offset-[var(--spacing-xs-space-2)] st-focus:outline-Semantic-Border-border_focus'

const thumb =
  'pointer-events-none absolute start-xs-space-2 top-xs-space-2 flex items-center justify-center ' +
  'rounded-[var(--spacing-semantic-radius-radius-full)] bg-Semantic-Background-bg_card ' +
  'transition-transform duration-200 motion-reduce:transition-none'

const labelText =
  'm-0 font-[family-name:var(--typography-font-family-base),sans-serif] font-[number:var(--typography-raw-weight-regular)] ' +
  'text-[length:var(--typography-raw-size-size-18)] leading-[var(--typography-raw-line-height-lh-26)] ' +
  'text-Semantic-Text-Text_secondary'

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ')

export function Toggle({
  checked,
  onChange,
  onError,
  size = 'regular',
  tone = 'business',
  disabled = false,
  loading = false,
  label,
  labelPosition = 'end',
  id,
  className,
  onClick,
  ...rest
}: ToggleProps) {
  const generatedId = useId()
  const toggleId = id ?? generatedId

  // Pending state of an async `onChange`; merged with the `loading` prop.
  const [pending, setPending] = useState(false)
  const isLoading = !disabled && (loading || pending)
  const isInteractive = !disabled && !isLoading

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || !isInteractive) return

    const result = onChange?.(!checked)
    if (result instanceof Promise) {
      setPending(true)
      result.catch((error: unknown) => onError?.(error)).finally(() => setPending(false))
    }
  }

  const s = sizes[size]
  const t = tones[tone]
  const trackColor = disabled ? 'bg-Semantic-Background-bg_disabled' : checked ? t.on : 'bg-Semantic-Background-bg_dark_soft'

  const control = (
    <button
      {...rest}
      id={toggleId}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-busy={isLoading || undefined}
      disabled={disabled}
      onClick={handleClick}
      className={join(
        track,
        s.track,
        trackColor,
        // Hover is not distinct in Figma; a slight brightness lift is used until design confirms.
        isInteractive && 'cursor-pointer st-hover:brightness-110',
        disabled && 'cursor-not-allowed',
        isLoading && 'cursor-progress',
        className,
      )}
    >
      <span aria-hidden className={join(thumb, s.thumb, checked ? s.on : 'translate-x-0', isInteractive && 'st-in-hover:shadow-md')}>
        {isLoading && (
          // The loading icon is hidden in Figma; a spinner in the track colour is used until design confirms.
          <svg data-testid="toggle-spinner" viewBox="0 0 24 24" fill="none" className={join('animate-spin', s.spinner, t.spinner)}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        )}
      </span>
    </button>
  )

  if (!label) return control

  // `<label htmlFor>` names the switch and makes the whole label clickable. The switch sits in a box
  // as tall as one label line, so it stays aligned with the first line of a long label.
  return (
    <div className={join('inline-flex items-start gap-s-space-8', labelPosition === 'start' && 'flex-row-reverse')}>
      <span className="flex h-[var(--typography-raw-line-height-lh-26)] items-center">{control}</span>
      <label htmlFor={toggleId} className={join(labelText, disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
        {label}
      </label>
    </div>
  )
}
