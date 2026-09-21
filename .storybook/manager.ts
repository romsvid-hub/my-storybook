// Adds a "Back to Chromatic" link at the bottom of the left sidebar.
// Storybook has no public slot for this, so the link is appended to the sidebar's bottom wrapper
// and re-added if the manager UI re-renders it away.
const CHROMATIC_URL = 'https://www.chromatic.com/builds?appId=6ab0e9f0401fecede9b64d98'
const LINK_ID = 'back-to-chromatic'

function mountLink() {
  const wrapper = document.getElementById('sidebar-bottom-wrapper')
  if (!wrapper) return

  // The sidebar is transparent over the page background; give the link that same opaque
  // background so the story list does not show through it (also follows light/dark theme).
  const existing = document.getElementById(LINK_ID)
  if (existing) {
    existing.style.backgroundColor = getComputedStyle(document.body).backgroundColor
    return
  }

  const link = document.createElement('a')
  link.id = LINK_ID
  link.href = CHROMATIC_URL
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.textContent = '← Back to Chromatic'
  Object.assign(link.style, {
    display: 'block',
    padding: '12px 16px',
    fontSize: '13px',
    color: 'inherit',
    textDecoration: 'none',
    borderTop: '1px solid color-mix(in srgb, currentColor 20%, transparent)',
    backgroundColor: getComputedStyle(document.body).backgroundColor,
  })
  wrapper.appendChild(link)
}

new MutationObserver(mountLink).observe(document.body, { childList: true, subtree: true })
mountLink()
