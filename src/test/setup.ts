import '@testing-library/jest-dom/vitest'
import { IDBFactory } from 'fake-indexeddb'
import { beforeEach } from 'vitest'
import { site } from '@/shared/config/site'

beforeEach(() => {
  // A fresh database and storage per test, so nothing leaks between tests.
  globalThis.indexedDB = new IDBFactory()
  localStorage.clear()
  site.features.uploads = false
  sessionStorage.clear()
  delete document.documentElement.dataset.theme
})

// jsdom doesn't implement object URLs, which photo previews rely on.
URL.createObjectURL = () => 'blob:preview'
URL.revokeObjectURL = () => {}

// jsdom doesn't implement matchMedia, which the theme hook reads.
window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {},
})) as unknown as typeof window.matchMedia

// jsdom doesn't implement scrolling; pages scroll to the top when you navigate.
window.scrollTo = () => {}

// jsdom doesn't implement element scrolling either.
Element.prototype.scrollTo ??= () => {}
Element.prototype.scrollIntoView ??= () => {}
