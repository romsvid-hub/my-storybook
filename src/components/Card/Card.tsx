import type { AnchorHTMLAttributes, HTMLAttributes } from 'react'

export type CardProps = Omit<HTMLAttributes<HTMLElement>, 'title'> &
  Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> & {
    /** Card title. */
    title: string
    /** Longer text under the title (Figma `Type=Podcast`). */
    description?: string
    /** Meta line under the title, e.g. `['5 lectures', '1 hour']`; items are separated by a dot. */
    meta?: string[]
    /** Image URL. Without it a neutral placeholder block is shown. */
    image?: string
    /** Alt text for the image. Leave empty when the image is decorative. */
    imageAlt?: string
    /** Makes the card a link (Figma `State=Hover / Press / Focus`). */
    href?: string
    /** Figma `State=Dissabled`: dimmed, not interactive. */
    disabled?: boolean
  }

// Typography, spacing, radius and colours all come from the design tokens (tokens.css / preset).
const root =
  'group box-border flex w-full flex-col gap-m-space-16 no-underline outline-none ' +
  'st-focus:outline-solid st-focus:outline-[length:var(--spacing-xs-space-4)] st-focus:outline-Semantic-Border-border_focus'

const image =
  'relative h-[224px] w-full shrink-0 overflow-hidden rounded-[var(--spacing-semantic-radius-radius-modal)] ' +
  'bg-Semantic-Background-bg_disabled'

const font = 'm-0 font-[family-name:var(--typography-font-family-base),sans-serif]'

const titleBase =
  `${font} font-[number:var(--typography-raw-weight-semibold)] ` +
  'text-[length:var(--typography-raw-size-size-20)] leading-[var(--typography-raw-line-height-lh-28)] ' +
  'decoration-from-font underline-offset-auto'
const titleEnabled =
  'text-Semantic-Text-Text_main st-in-hover:underline st-in-press:underline st-in-press:text-Semantic-Text-Text_secondary'

const descriptionBase =
  `${font} font-[number:var(--typography-raw-weight-regular)] ` +
  'text-[length:var(--typography-raw-size-size-18)] leading-[var(--typography-raw-line-height-lh-26)]'

const metaBase =
  `${font} flex items-center gap-s-space-8 font-[number:var(--typography-raw-weight-regular)] ` +
  'text-[length:var(--typography-raw-size-size-16)] leading-[var(--typography-raw-line-height-lh-24)]'

const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ')

export function Card({
  title, description, meta, image: src, imageAlt = '', href, disabled = false, className, target, rel, ...rest
}: CardProps) {
  const linkProps = href && !disabled ? { href, target, rel } : {}
  const Root = (href && !disabled ? 'a' : 'div') as 'a'

  return (
    <Root
      {...linkProps}
      aria-disabled={disabled || undefined}
      className={join(root, className)}
      {...(rest as object)}
    >
      <div className={join(image, disabled && 'opacity-50')}>
        {src && <img src={src} alt={imageAlt} className="absolute inset-0 size-full object-cover" />}
      </div>
      <div className="flex flex-col gap-s-space-8">
        <h3 className={join(titleBase, disabled ? 'text-Semantic-Text-Text_dissable' : titleEnabled)}>{title}</h3>
        {description && (
          <p className={join(descriptionBase, disabled ? 'text-Semantic-Text-Text_dissable' : 'text-Semantic-Text-Text_secondary')}>
            {description}
          </p>
        )}
        {meta && meta.length > 0 && (
          <div className={join(metaBase, disabled ? 'text-Semantic-Text-Text_dissable' : 'text-Semantic-Text-Text_tetriary')}>
            {meta.map((item, index) => (
              <span key={`${item}-${index}`} className="flex items-center gap-s-space-8">
                {index > 0 && <span aria-hidden className="size-xs-space-6 shrink-0 rounded-full bg-current" />}
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </Root>
  )
}
