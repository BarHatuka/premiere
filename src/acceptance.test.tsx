import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router'
import { beforeEach, expect, test, vi } from 'vitest'
import App from './App'
import { clearFetchCache } from './hooks/useFetch'
import { defaultAnswers, fakeTvmaze } from './test/shows'

// כל בדיקה כאן היא שורת קבלה אחת מ-PRD.md, באותו נוסח.
// fetch מוחלף בתשובות קבועות (src/test/shows.ts), כך שהבדיקות לא תלויות ברשת.

beforeEach(() => {
  vi.stubGlobal('fetch', fakeTvmaze(defaultAnswers))
})

// מציג את הכתובת הנוכחית, כדי שהבדיקה תוכל לבדוק אותה (ב-MemoryRouter אין שורת כתובת אמיתית)
function CurrentAddress() {
  const location = useLocation()
  return <output aria-label="הכתובת">{location.pathname + location.search}</output>
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
      <CurrentAddress />
    </MemoryRouter>,
  )
}

// "רענון" בבדיקה: מורידים את האפליקציה, מוחקים את מה ש-useFetch זוכר, ומעלים מחדש. localStorage נשאר.
function refresh(unmount: () => void, path: string) {
  unmount()
  clearFetchCache()
  return renderAt(path)
}

const wallItems = async () => within(await screen.findByRole('region', { name: 'כל הסדרות' })).getAllByRole('listitem')
const address = () => screen.getByRole('status', { name: 'הכתובת' })

test('When I open the app, I see "טוענים את הסדרות…" and then a wall of posters, highest rated first; when the network is offline, I see an error message and a "נסו שוב" button, not a blank screen', async () => {
  const { unmount } = renderAt('/')

  expect(screen.getByText('טוענים את הסדרות…')).toBeInTheDocument()
  const items = await wallItems()
  expect(items[0]).toHaveTextContent('Person of Interest') // 8.8
  expect(items[1]).toHaveTextContent('The Big Bang Theory') // 8.0
  expect(items.at(-1)).toHaveTextContent('Death Note') // בלי דירוג, ולכן אחרונה

  vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'))
  refresh(unmount, '/')
  expect(await screen.findByRole('alert')).toHaveTextContent('לא הצלחנו לטעון את הסדרות')
  await userEvent.click(screen.getByRole('button', { name: 'נסו שוב' }))
  expect(await wallItems()).toHaveLength(6)
})

test('When I click "Person of Interest", I see the address /shows/2, its rating 8.8, the line "שודרה בין 2011 ל-2016 ב-CBS" and its cast — and I see the same after refreshing the page', async () => {
  const user = userEvent.setup()
  const { unmount } = renderAt('/')

  await user.click(await screen.findByRole('link', { name: /Person of Interest/ }))

  async function expectShowPage() {
    expect(await screen.findByRole('heading', { level: 1, name: 'Person of Interest' })).toBeInTheDocument()
    expect(address()).toHaveTextContent('/shows/2')
    expect(screen.getByText('8.8')).toBeInTheDocument()
    expect(screen.getByText(/שודרה בין 2011 ל-2016 ב-CBS/)).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'שחקנים' })).getByText('Michael Emerson')).toBeInTheDocument()
  }

  await expectShowPage()
  refresh(unmount, '/shows/2')
  await expectShowPage()
})

test('When I pick the "קומדיה" genre and type "new" in the search box, I see only comedies with "new" in their name, like New Girl, and the address ends with ?genre=Comedy&q=new', async () => {
  const user = userEvent.setup()
  renderAt('/')
  await wallItems()

  await user.click(screen.getByRole('button', { name: /קומדיה/ }))
  await user.type(screen.getByRole('searchbox', { name: 'חיפוש סדרה לפי שם' }), 'new')

  const items = await wallItems()
  expect(items).toHaveLength(1)
  expect(items[0]).toHaveTextContent('New Girl')
  expect(address().textContent).toMatch(/\?genre=Comedy&q=new$/)
})

test('When I save a show and refresh the page, I see it in "הרשימה שלי"', async () => {
  const user = userEvent.setup()
  const { unmount } = renderAt('/shows/2')

  await user.click(await screen.findByRole('button', { name: 'שמירה לרשימה שלי' }))

  refresh(unmount, '/')
  await user.click(screen.getByRole('link', { name: /הרשימה שלי/ }))

  expect(screen.getByRole('heading', { level: 1, name: 'הרשימה שלי' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Person of Interest/ })).toHaveAttribute('href', '/shows/2')
})

test('When I open "היום בטלוויזיה", I see today\'s shows by hour, and clicking a show opens its page', async () => {
  const user = userEvent.setup()
  renderAt('/')

  await user.click(screen.getByRole('link', { name: 'היום בטלוויזיה' }))

  const hours = await screen.findAllByRole('heading', { level: 2 })
  expect(hours.map((hour) => hour.textContent)).toEqual(['20:00', '22:00']) // ב-API הן מגיעות הפוך

  await user.click(screen.getByRole('link', { name: 'Person of Interest' }))
  expect(await screen.findByRole('heading', { level: 1, name: 'Person of Interest' })).toBeInTheDocument()
  expect(address()).toHaveTextContent('/shows/2')
})
