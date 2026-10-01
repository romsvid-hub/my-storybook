import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { Toggle, type ToggleProps, type ToggleSize, type ToggleTone } from './Toggle'

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    checked: false,
    size: 'regular',
    tone: 'business',
    disabled: false,
    loading: false,
    'aria-label': 'Сповіщення',
    onChange: fn(),
  },
  argTypes: {
    checked: { control: 'boolean', description: 'Figma `isChecked`. Controlled value.' },
    size: { control: 'inline-radio', options: ['regular', 'large'], description: 'Figma `size`: 32×16 or 48×24.' },
    tone: { control: 'inline-radio', options: ['business', 'user'], description: 'ON-track colour.' },
    disabled: { control: 'boolean', description: 'Figma `isDisabled`.' },
    loading: { control: 'boolean', description: 'Figma `isLoading`.' },
    label: { control: 'text', description: 'Visible label (Figma `Toggle With label`).' },
    labelPosition: { control: 'inline-radio', options: ['end', 'start'] },
  },
  // Clicking flips the story's own state so the toggle can be tried out; `onChange` is still reported.
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked)
    return (
      <Toggle
        {...args}
        checked={checked}
        onChange={(next) => {
          setChecked(next)
          return args.onChange?.(next)
        }}
      />
    )
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

const getSwitch = (canvasElement: HTMLElement) => within(canvasElement).getByRole('switch')

// ----- States (Figma `state`, `isChecked`, `isLoading`, `isDisabled`) -----
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const sw = getSwitch(canvasElement)
    await expect(sw).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(sw)
    await expect(args.onChange).toHaveBeenCalledTimes(1)
    await expect(args.onChange).toHaveBeenCalledWith(true)
    await expect(sw).toHaveAttribute('aria-checked', 'true')
  },
}

export const On: Story = { args: { checked: true } }

export const Hover: Story = { render: (args) => <Toggle {...args} data-force-state="hover" /> }

export const Focus: Story = { render: (args) => <Toggle {...args} data-force-state="focus" /> }

export const Keyboard: Story = {
  name: 'Keyboard (Space / Enter)',
  play: async ({ canvasElement }) => {
    const sw = getSwitch(canvasElement)
    await userEvent.tab()
    await expect(sw).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(sw).toHaveAttribute('aria-checked', 'true')
    await userEvent.keyboard('{Enter}')
    await expect(sw).toHaveAttribute('aria-checked', 'false')
  },
}

export const Loading: Story = {
  args: { loading: true, checked: true },
  play: async ({ canvasElement, args }) => {
    const sw = getSwitch(canvasElement)
    await userEvent.click(sw)
    await expect(args.onChange).not.toHaveBeenCalled()
    await expect(sw).toHaveAttribute('aria-busy', 'true')
    await expect(within(canvasElement).getByTestId('toggle-spinner')).toBeInTheDocument()
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    const sw = getSwitch(canvasElement)
    await userEvent.click(sw)
    await userEvent.tab()
    await expect(args.onChange).not.toHaveBeenCalled()
    await expect(sw).not.toHaveFocus()
    await expect(sw).toBeDisabled()
  },
}

export const DisabledOn: Story = { args: { disabled: true, checked: true } }

export const DisabledWinsOverLoading: Story = {
  args: { disabled: true, loading: true },
  play: async ({ canvasElement }) => {
    await expect(getSwitch(canvasElement)).not.toHaveAttribute('aria-busy')
    await expect(within(canvasElement).queryByTestId('toggle-spinner')).not.toBeInTheDocument()
  },
}

// ----- Size & tone -----
export const Large: Story = { args: { size: 'large', checked: true } }

export const UserTone: Story = { args: { tone: 'user', checked: true } }

// ----- Toggle With label -----
export const WithLabel: Story = {
  args: { label: 'Підлягає обговоренню', size: 'large', 'aria-label': undefined },
  play: async ({ canvasElement }) => {
    const sw = within(canvasElement).getByRole('switch', { name: 'Підлягає обговоренню' })
    await userEvent.click(within(canvasElement).getByText('Підлягає обговоренню'))
    await expect(sw).toHaveAttribute('aria-checked', 'true')
  },
}

export const WithLabelStart: Story = {
  args: { label: 'Підлягає обговоренню', size: 'large', labelPosition: 'start', checked: true, 'aria-label': undefined },
}

export const LongLabel: Story = {
  args: {
    label: 'Надсилати сповіщення про нові коментарі, згадки та зміни статусу задач, до яких я підписаний',
    size: 'large',
    'aria-label': undefined,
  },
  decorators: [(Story) => <div className="w-[320px]"><Story /></div>],
}

// ----- Async onChange: loading while pending, rollback on error -----
export const AsyncSuccess: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState(false)
    return (
      <Toggle
        {...args}
        checked={checked}
        onChange={(next) => new Promise<void>((resolve) => setTimeout(() => { setChecked(next); resolve() }, 300))}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const sw = getSwitch(canvasElement)
    await userEvent.click(sw)
    await expect(sw).toHaveAttribute('aria-busy', 'true')
    await userEvent.click(sw) // ignored while pending
    await waitFor(() => expect(sw).not.toHaveAttribute('aria-busy'))
    await expect(sw).toHaveAttribute('aria-checked', 'true')
  },
}

export const AsyncErrorRollback: Story = {
  args: { onError: fn() },
  render: function Render(args) {
    const [checked, setChecked] = useState(false)
    const [error, setError] = useState<string | null>(null)
    return (
      <div className="flex flex-col items-center gap-s-space-8">
        <Toggle
          {...args}
          checked={checked}
          onChange={(next) =>
            new Promise<void>((_, reject) => setTimeout(() => reject(new Error('Не вдалося зберегти зміну')), 300)).then(() =>
              setChecked(next),
            )
          }
          onError={(e) => {
            setError((e as Error).message)
            args.onError?.(e)
          }}
        />
        {error && <p className="m-0 text-Semantic-Status-status_error_txt">{error}</p>}
      </div>
    )
  },
  play: async ({ canvasElement, args }) => {
    const sw = getSwitch(canvasElement)
    await userEvent.click(sw)
    await waitFor(() => expect(args.onError).toHaveBeenCalled())
    await expect(sw).toHaveAttribute('aria-checked', 'false')
    await expect(within(canvasElement).getByText('Не вдалося зберегти зміну')).toBeInTheDocument()
  },
}

// ----- Full matrix as in the Figma component set (408:85844) -----
const states: { name: string; props: Partial<ToggleProps> }[] = [
  { name: 'state=default', props: {} },
  { name: 'state=hover', props: { 'data-force-state': 'hover' } as Partial<ToggleProps> },
  { name: 'state=focus', props: { 'data-force-state': 'focus' } as Partial<ToggleProps> },
  { name: 'isLoading=true', props: { loading: true } },
  { name: 'isDisabled=true', props: { disabled: true } },
]

export const AllStates: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-l-space-32">
      {(['business', 'user'] as ToggleTone[]).map((tone) =>
        (['regular', 'large'] as ToggleSize[]).map((size) => (
          <div key={`${tone}-${size}`} className="flex flex-col gap-s-space-12">
            <p className="m-0 font-mono text-xs text-Semantic-Text-Text_tetriary">tone={tone} · size={size}</p>
            <div className="grid grid-cols-[64px_64px_1fr] items-center gap-y-m-space-16">
              {states.map(({ name, props }) => (
                <div key={name} className="contents">
                  <Toggle aria-label={`${name} off`} checked={false} size={size} tone={tone} {...props} />
                  <Toggle aria-label={`${name} on`} checked size={size} tone={tone} {...props} />
                  <span className="font-mono text-xs text-Semantic-Text-Text_tetriary">{name}</span>
                </div>
              ))}
            </div>
          </div>
        )),
      )}
    </div>
  ),
}
