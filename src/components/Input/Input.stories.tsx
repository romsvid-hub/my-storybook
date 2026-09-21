import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Input } from './Input'
import imageIcon from './image-icon.svg'

// Icon asset exported from the Figma "Text field" component (elemBeforeInput).
const Icon = () => <img src={imageIcon} alt="" className="size-full" />

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-60">
        <Story />
      </div>
    ),
  ],
  args: {
    placeholder: 'Placeholder',
    onChange: fn(),
  },
  argTypes: {
    placeholder: { control: 'text', description: 'Placeholder text (default / focus / disabled states).' },
    defaultValue: { control: 'text', description: 'Initial value. Filled / typing states show it.' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url'],
      description: 'Native input type.',
    },
    invalid: { control: 'boolean', description: 'Error state (Figma `isInvalid`): error border.' },
    disabled: { control: 'boolean', description: 'Disabled state (Figma `isDisabled`).' },
    iconBefore: {
      control: 'select',
      options: ['none', 'image'],
      mapping: { none: undefined, image: <Icon /> },
      description: 'Element before the text (Figma `elemBeforeInput`).',
    },
    iconAfter: {
      control: 'select',
      options: ['none', 'image'],
      mapping: { none: undefined, image: <Icon /> },
      description: 'Element after the text (Figma `elemAfterInput` slot).',
    },
    className: { control: 'text', description: 'Class names for the outer wrapper.' },
    onChange: { action: 'changed', description: 'Native change handler.' },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox')
    await userEvent.click(input)
    await expect(input).toHaveFocus()
  },
}

export const Typing: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox')
    await userEvent.type(input, 'Value')
    await expect(input).toHaveValue('Value')
  },
}

export const Filled: Story = {
  args: { defaultValue: 'Value' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const ErrorState: Story = {
  name: 'Error',
  args: { invalid: true, defaultValue: 'Value' },
}

export const WithIcon: Story = {
  args: { iconBefore: <Icon /> },
}

export const WithIconAfter: Story = {
  args: { iconAfter: <Icon />, defaultValue: 'Value' },
}
