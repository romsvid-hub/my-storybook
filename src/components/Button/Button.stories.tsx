import type { ComponentType } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button, type ButtonIntent, type ButtonVariant } from './Button'
import imageIcon from '../Input/image-icon.svg'

// The Figma icon asset drawn through a mask, so it takes the button's text colour in every state.
// Vite may inline the small SVG as a data: URI, so the URL must be a quoted CSS string.
const maskUrl = `url(${JSON.stringify(imageIcon)})`

const Icon = () => (
  <span
    aria-hidden
    className="block size-full bg-current"
    style={{
      maskImage: maskUrl,
      maskSize: 'contain',
      maskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskImage: maskUrl,
      WebkitMaskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
    }}
  />
)

const iconOptions = { none: undefined, image: <Icon /> }

// Light variants are built for dark surfaces.
const onDark = (Story: ComponentType) => (
  <div className="bg-Semantic-Background-bg_inverse p-m-space-16">
    <Story />
  </div>
)

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { children: 'Button', onClick: fn() },
  argTypes: {
    children: { control: 'text', description: 'Label. Leave empty (with an icon) for an icon-only button.' },
    variant: {
      control: 'select',
      options: ['primary', 'primary-light', 'secondary', 'secondary-light', 'text'],
      description: 'Figma `Type`. The light variants are meant for dark backgrounds.',
    },
    size: { control: 'inline-radio', options: ['m', 's'], description: 'Figma `Size`: M = 48px, S = 40px.' },
    intent: {
      control: 'inline-radio',
      options: ['business', 'searcher', 'destructive'],
      description: 'Figma `Interface`. `destructive` is specified in Figma for size S only.',
    },
    selected: { control: 'boolean', description: 'Figma `State=Selected` (`aria-pressed`).' },
    disabled: { control: 'boolean', description: 'Figma `State=Dissabled`.' },
    iconLeft: { control: 'select', options: ['none', 'image'], mapping: iconOptions, description: 'Figma `Icon=Left`.' },
    iconRight: { control: 'select', options: ['none', 'image'], mapping: iconOptions, description: 'Figma `Icon=Right`.' },
    className: { control: 'text' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// ----- States (Figma `State`) -----
export const Default: Story = {}

export const Hover: Story = {
  render: (args) => <Button {...args} data-force-state="hover" />,
}

export const Press: Story = {
  render: (args) => <Button {...args} data-force-state="press" />,
}

export const Disabled: Story = { args: { disabled: true } }

export const Selected: Story = { args: { selected: true } }

// ----- Types (Figma `Type`) -----
export const PrimaryLight: Story = { args: { variant: 'primary-light' }, decorators: [onDark] }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const SecondaryLight: Story = { args: { variant: 'secondary-light' }, decorators: [onDark] }
export const Text: Story = { args: { variant: 'text' } }

// ----- Size and interface -----
export const Small: Story = { args: { size: 's' } }
export const Searcher: Story = { args: { intent: 'searcher' } }
export const Destructive: Story = { args: { intent: 'destructive', size: 's' } }

// ----- Icons (Figma `Icon`) -----
export const IconLeft: Story = { args: { iconLeft: <Icon /> } }
export const IconRight: Story = { args: { iconRight: <Icon /> } }
export const IconTwoSides: Story = { args: { iconLeft: <Icon />, iconRight: <Icon /> } }
export const IconOnly: Story = { args: { children: undefined, iconLeft: <Icon />, 'aria-label': 'Button' } }

// ----- Everything at once, for visual review in Chromatic -----
const variants: ButtonVariant[] = ['primary', 'primary-light', 'secondary', 'secondary-light', 'text']
const states = ['default', 'hover', 'press', 'disabled', 'selected'] as const

export const AllStates: Story = {
  parameters: { layout: 'padded' },
  argTypes: { variant: { control: false }, selected: { control: false }, disabled: { control: false } },
  args: { intent: 'business' as ButtonIntent },
  render: ({ intent, size }) => (
    <div className="flex flex-col gap-s-space-8">
      {variants.map((variant) => {
        const light = variant === 'primary-light' || variant === 'secondary-light'
        return (
          <div
            key={variant}
            className={`flex items-center gap-m-space-16 p-s-space-12 ${light ? 'bg-Semantic-Background-bg_inverse' : ''}`}
          >
            {states.map((state) => (
              <Button
                key={state}
                variant={variant}
                intent={intent}
                size={size}
                disabled={state === 'disabled'}
                selected={state === 'selected'}
                data-force-state={state === 'hover' || state === 'press' ? state : undefined}
              >
                {variant}
              </Button>
            ))}
          </div>
        )
      })}
    </div>
  ),
}
