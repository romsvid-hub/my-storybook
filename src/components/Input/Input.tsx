import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** Error state (Figma `isInvalid`). */
  invalid?: boolean
  /** Element rendered before the text, e.g. an icon (Figma `elemBeforeInput`). */
  iconBefore?: ReactNode
  /** Element rendered after the text (Figma `elemAfterInput` slot). */
  iconAfter?: ReactNode
  /** Class names for the outer wrapper (the visible field box). */
  className?: string
}

// Every value below comes from the design tokens (src/styles/tokens.css and tailwind.preset.js).
// Colors and spacing use the Tailwind preset keys; typography, radius and border width are not in
// the preset, so they read the CSS variables from tokens.css directly.
const box =
  'group box-border flex w-full items-center gap-xs-space-6 h-xl-space-48 px-m-space-16 ' +
  'border border-solid border-[length:var(--spacing-stroke-stroke-1)] ' +
  'rounded-[var(--spacing-semantic-radius-radius-input)]'

const boxEnabled =
  'bg-Semantic-Background-bg_card not-focus-within:hover:bg-Semantic-Background-bg_soft'
const boxBorder =
  'border-Semantic-Border-border_input_text_area focus-within:border-Semantic-Status-status_select_border'
const boxInvalid = 'border-Semantic-Status-status_error_txt'
const boxDisabled = 'bg-Semantic-Background-bg_disabled border-Semantic-Background-bg_disabled'

const field =
  'min-w-0 flex-1 m-0 p-0 border-0 bg-transparent outline-none ' +
  'font-[family-name:var(--typography-font-family-base),sans-serif] ' +
  'text-[length:var(--typography-raw-size-size-18)] ' +
  'font-[number:var(--typography-raw-weight-regular)] ' +
  'leading-[var(--typography-raw-line-height-lh-24)] ' +
  'group-focus-within:font-[number:var(--typography-raw-weight-medium)] ' +
  'group-focus-within:leading-[var(--typography-raw-line-height-lh-26)]'

const fieldEnabled =
  'text-Semantic-Text-Text_main caret-Semantic-Text-Text_main placeholder:text-Semantic-Text-Text_tetriary'
const fieldDisabled = 'text-Semantic-Text-Text_dissable placeholder:text-Semantic-Text-Text_dissable'

const slot = 'flex size-l-space-24 shrink-0 items-center justify-center'

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ')

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, disabled = false, iconBefore, iconAfter, className, type = 'text', ...rest },
  ref,
) {
  return (
    <div
      className={join(
        box,
        disabled ? boxDisabled : join(boxEnabled, invalid ? boxInvalid : boxBorder),
        className,
      )}
    >
      {iconBefore && <span className={slot}>{iconBefore}</span>}
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={join(field, disabled ? fieldDisabled : fieldEnabled)}
        {...rest}
      />
      {iconAfter && <span className={slot}>{iconAfter}</span>}
    </div>
  )
})
