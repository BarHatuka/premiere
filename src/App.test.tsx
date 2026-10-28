import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, expect, test, vi } from 'vitest'
import App from './App'
import { defaultAnswers, fakeTvmaze } from './test/shows'

// בדיקות להתנהגות שמעבר לשורות הקבלה (שנמצאות ב-acceptance.test.tsx).

beforeEach(() => {
  vi.stubGlobal('fetch', fakeTvmaze(defaultAnswers))
})

// MemoryRouter: ראוטר שמחזיק את הכתובת בזיכרון במקום בשורת הכתובת, כך שבבדיקה אפשר להתחיל מכל כתובת.
function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

const wallItems = async () => within(await screen.findByRole('region', { name: 'כל הסדרות' })).getAllByRole('listitem')

test('an address that does not exist shows the not-found page', () => {
  renderAt('/xyz')
  expect(screen.getByRole('heading', { name: 'העמוד הזה לא בתוכנית' })).toBeInTheDocument()
})

test('a show that TVmaze does not know (404), or an id that is not a number, shows the not-found page', async () => {
  const { unmount } = renderAt('/shows/999999')
  expect(await screen.findByRole('heading', { name: 'העמוד הזה לא בתוכנית' })).toBeInTheDocument()
  unmount()

  renderAt('/shows/abc')
  expect(screen.getByRole('heading', { name: 'העמוד הזה לא בתוכנית' })).toBeInTheDocument()
})

test('a shared link opens the same filtered wall, because the genre and the search come from the address', async () => {
  renderAt('/?genre=Comedy&q=new')

  const items = await wallItems()
  expect(items).toHaveLength(1)
  expect(items[0]).toHaveTextContent('New Girl')
  expect(screen.getByRole('searchbox', { name: 'חיפוש סדרה לפי שם' })).toHaveValue('new')
  expect(screen.getByRole('button', { name: /קומדיה/ })).toHaveAttribute('aria-pressed', 'true')
})

test('"חזרה" on a show page returns to the wall with the same filter', async () => {
  const user = userEvent.setup()
  renderAt('/?genre=Crime')

  await user.click((await screen.findAllByRole('link', { name: /Person of Interest/ }))[0])
  await user.click(await screen.findByRole('button', { name: 'חזרה' }))

  expect(screen.getByRole('button', { name: /פשע/ })).toHaveAttribute('aria-pressed', 'true')
  expect(await wallItems()).toHaveLength(2) // Person of Interest ו-NCIS: New Orleans
})

test('a search with no results explains why, and "הצגת כל הסדרות" brings the whole wall back', async () => {
  const user = userEvent.setup()
  renderAt('/?q=friends')

  expect(await screen.findByText(/לא מצאנו סדרה עם "friends" בשם/)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'הצגת כל הסדרות' }))
  expect(await wallItems()).toHaveLength(6)
})

test('the browser tab shows the name of the show', async () => {
  renderAt('/shows/2')
  await screen.findByRole('heading', { level: 1, name: 'Person of Interest' })
  expect(document.title).toBe('Person of Interest | פרמיירה')
})

test('a show can be removed from "הרשימה שלי", and an empty list explains how to add one', async () => {
  const user = userEvent.setup()
  renderAt('/shows/2')
  await user.click(await screen.findByRole('button', { name: 'שמירה לרשימה שלי' }))
  expect(screen.getByRole('link', { name: /הרשימה שלי 1/ })).toBeInTheDocument()

  await user.click(screen.getByRole('link', { name: /הרשימה שלי/ }))
  await user.click(screen.getByRole('button', { name: 'הסרת Person of Interest מהרשימה' }))

  expect(screen.getByText(/הרשימה שלך עוד ריקה/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /הרשימה שלי 0/ })).toBeInTheDocument()
})
