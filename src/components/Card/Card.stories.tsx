import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[377px]">
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'Інклюзія та різноманіття в робочому просторі. Основи',
    meta: ['5 лекцій', '1 година'],
    href: '#card',
  },
  argTypes: {
    title: { control: 'text', description: 'Card title.' },
    description: { control: 'text', description: 'Longer text under the title (Figma `Type=Podcast`).' },
    meta: { control: 'object', description: 'Meta line items, separated by a dot.' },
    image: { control: 'text', description: 'Image URL. Without it a neutral placeholder block is shown.' },
    imageAlt: { control: 'text', description: 'Alt text for the image.' },
    href: { control: 'text', description: 'Makes the card a link.' },
    disabled: { control: 'boolean', description: 'Figma `State=Dissabled`.' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

// ----- Type=Courses (default) in each State -----
export const Default: Story = {}

export const Hover: Story = { render: (args) => <Card {...args} data-force-state="hover" /> }

export const Press: Story = { render: (args) => <Card {...args} data-force-state="press" /> }

export const Focus: Story = { render: (args) => <Card {...args} data-force-state="focus" /> }

export const Disabled: Story = { args: { disabled: true } }

// ----- Types -----
export const Blog: Story = {
  args: { title: 'Інклюзія та різноманіття в робочому просторі. Основи', meta: ['Ольга Новикова', '12/09/25'] },
}

export const Podcast: Story = {
  args: {
    title: 'Марина Левченко | ДІЛА',
    description:
      'Епізод з Мариною Левченко, Директоркою з розвитку бренду та управління репутацією в компанії Dila. Ми поговорили про те, як компанія впроваджує архітектурну доступність у понад 240 відділеннях, про найм ветеранів та людей з інвалідністю, про навчання в компанії та про багато іншого цікавого.',
    meta: ['1 година', '12/09/25'],
  },
}

export const PodcastDisabled: Story = {
  args: { ...Podcast.args, disabled: true },
}
