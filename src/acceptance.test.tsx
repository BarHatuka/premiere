// ─────────────────────────────────────────────
// בדיקה אחת לכל שורת קבלה ב-PRD.md, באותו נוסח. זה ההוכחה שהאפליקציה עושה מה שהבטחנו.
// מריצים עם npm test.
// ─────────────────────────────────────────────

// render מצייר, screen מחפש במסך, within מחפש בתוך אלמנט
import { render, screen, within } from '@testing-library/react'
// מדמה משתמש שלוחץ ומקליד
import userEvent from '@testing-library/user-event'
// ראוטר לבדיקות, ו-useLocation בשביל להציג את הכתובת
import { MemoryRouter, useLocation } from 'react-router'
// כלי הבדיקה של Vitest
import { beforeEach, expect, test, vi } from 'vitest'
// בודקים את כל האפליקציה
import App from './App'
// "רענון" בבדיקה מוחק את ה-cache
import { clearFetchCache } from './hooks/useFetch'
// fetch מזויף עם תשובות קבועות
import { defaultAnswers, fakeTvmaze } from './test/shows'

// כל בדיקה כאן היא שורת קבלה אחת מ-PRD.md, באותו נוסח.
// fetch מוחלף בתשובות קבועות (src/test/shows.ts), כך שהבדיקות לא תלויות ברשת.

// לפני כל בדיקה מחליפים את fetch
beforeEach(() => {
  // מחליפים את fetch הגלובלי במזויף
  vi.stubGlobal('fetch', fakeTvmaze(defaultAnswers))
})

// מציג את הכתובת הנוכחית, כדי שהבדיקה תוכל לבדוק אותה (ב-MemoryRouter אין שורת כתובת אמיתית)
// רכיב קטן לבדיקות בלבד
function CurrentAddress() {
  // הכתובת הנוכחית
  const location = useLocation()
  // מציג אותה, כדי שהבדיקה תמצא אותה לפי השם "הכתובת"
  return <output aria-label="הכתובת">{location.pathname + location.search}</output>
}

// מצייר את האפליקציה בכתובת path, יחד עם הצגת הכתובת
function renderAt(path: string) {
  // מציירים את האפליקציה, ולידה את הכתובת הנוכחית
  return render(
    // מתחילים בכתובת path
    <MemoryRouter initialEntries={[path]}>
      <App />
      <CurrentAddress />
    </MemoryRouter>,
  )
}

// "רענון" בבדיקה: מורידים את האפליקציה, מוחקים את מה ש-useFetch זוכר, ומעלים מחדש. localStorage נשאר.
// מדמה רענון של הדף
function refresh(unmount: () => void, path: string) {
  // מורידים את האפליקציה
  unmount()
  // שוכחים את התשובות השמורות, כמו ברענון אמיתי
  clearFetchCache()
  // ומציירים אותה מחדש באותה כתובת
  return renderAt(path)
}

// מחכה לקיר ומחזירה את הכרטיסים שבו
const wallItems = async () => within(await screen.findByRole('region', { name: 'כל הסדרות' })).getAllByRole('listitem')
// מחזירה את האלמנט שמציג את הכתובת
const address = () => screen.getByRole('status', { name: 'הכתובת' })

// שורת קבלה 1: טעינה, קיר מהמדורג ביותר, ושגיאת רשת עם "נסו שוב"
test('When I open the app, I see "טוענים את הסדרות…" and then a wall of posters, highest rated first; when the network is offline, I see an error message and a "נסו שוב" button, not a blank screen', async () => {
  // פותחים את הקיר
  const { unmount } = renderAt('/')

  // קודם רואים הודעת טעינה
  expect(screen.getByText('טוענים את הסדרות…')).toBeInTheDocument()
  // מחכים לקיר
  const items = await wallItems()
  expect(items[0]).toHaveTextContent('Person of Interest') // 8.8
  expect(items[1]).toHaveTextContent('The Big Bang Theory') // 8.0
  expect(items.at(-1)).toHaveTextContent('Death Note') // בלי דירוג, ולכן אחרונה

  // הבקשה הבאה תיכשל, כאילו אין רשת
  vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'))
  // "רענון"
  refresh(unmount, '/')
  // מופיעה הודעת שגיאה
  expect(await screen.findByRole('alert')).toHaveTextContent('לא הצלחנו לטעון את הסדרות')
  // לוחצים "נסו שוב"
  await userEvent.click(screen.getByRole('button', { name: 'נסו שוב' }))
  // והקיר חוזר
  expect(await wallItems()).toHaveLength(6)
})

// שורת קבלה 2: עמוד סדרה בכתובת משלו, גם אחרי רענון
test('When I click "Person of Interest", I see the address /shows/2, its rating 8.8, the line "שודרה בין 2011 ל-2016 ב-CBS" and its cast, and I see the same after refreshing the page', async () => {
  // משתמש מדומה
  const user = userEvent.setup()
  // מתחילים בקיר
  const { unmount } = renderAt('/')

  // לוחצים על הכרטיס
  await user.click(await screen.findByRole('link', { name: /Person of Interest/ }))

  // כל מה שצריך להופיע בעמוד הסדרה
  async function expectShowPage() {
    // הכותרת היא שם הסדרה
    expect(await screen.findByRole('heading', { level: 1, name: 'Person of Interest' })).toBeInTheDocument()
    // הכתובת היא /shows/2
    expect(address()).toHaveTextContent('/shows/2')
    // הדירוג
    expect(screen.getByText('8.8')).toBeInTheDocument()
    // המשפט על השידור
    expect(screen.getByText(/שודרה בין 2011 ל-2016 ב-CBS/)).toBeInTheDocument()
    // ובאזור "שחקנים" מופיע Michael Emerson
    expect(within(screen.getByRole('region', { name: 'שחקנים' })).getByText('Michael Emerson')).toBeInTheDocument()
  }

  // בודקים פעם אחת אחרי הלחיצה
  await expectShowPage()
  // "מרעננים" בכתובת של הסדרה
  refresh(unmount, '/shows/2')
  // ובודקים שוב
  await expectShowPage()
})

// שורת קבלה 3: ז'אנר וחיפוש, והכתובת מתעדכנת
test('When I pick the "קומדיה" genre and type "new" in the search box, I see only comedies with "new" in their name, like New Girl, and the address ends with ?genre=Comedy&q=new', async () => {
  // משתמש מדומה
  const user = userEvent.setup()
  // פותחים את הקיר
  renderAt('/')
  // מחכים שייטען
  await wallItems()

  // לוחצים על קומדיה
  await user.click(screen.getByRole('button', { name: /קומדיה/ }))
  // מקלידים new בחיפוש
  await user.type(screen.getByRole('searchbox', { name: 'חיפוש סדרה לפי שם' }), 'new')

  // הכרטיסים שנשארו
  const items = await wallItems()
  // רק אחד
  expect(items).toHaveLength(1)
  // New Girl
  expect(items[0]).toHaveTextContent('New Girl')
  // והכתובת נגמרת בפרמטרים הנכונים
  expect(address().textContent).toMatch(/\?genre=Comedy&q=new$/)
})

// שורת קבלה 4: שמירה, רענון, והסדרה ברשימה
test('When I save a show and refresh the page, I see it in "הרשימה שלי"', async () => {
  // משתמש מדומה
  const user = userEvent.setup()
  // פותחים סדרה
  const { unmount } = renderAt('/shows/2')

  // שומרים
  await user.click(await screen.findByRole('button', { name: 'שמירה לרשימה שלי' }))

  // "מרעננים". localStorage נשאר, כמו בדפדפן
  refresh(unmount, '/')
  // עוברים לרשימה
  await user.click(screen.getByRole('link', { name: /הרשימה שלי/ }))

  // אנחנו בעמוד הרשימה
  expect(screen.getByRole('heading', { level: 1, name: 'הרשימה שלי' })).toBeInTheDocument()
  // והסדרה שם, עם קישור לעמוד שלה
  expect(screen.getByRole('link', { name: /Person of Interest/ })).toHaveAttribute('href', '/shows/2')
})

// שורת קבלה 5: לוח השידורים לפי שעה, וקישור לסדרה
test('When I open "היום בטלוויזיה", I see today\'s shows by hour, and clicking a show opens its page', async () => {
  // משתמש מדומה
  const user = userEvent.setup()
  // מתחילים בקיר
  renderAt('/')

  // עוברים ללוח
  await user.click(screen.getByRole('link', { name: 'היום בטלוויזיה' }))

  // כותרות השעות
  const hours = await screen.findAllByRole('heading', { level: 2 })
  // ממוינות מהמוקדמת
  expect(hours.map((hour) => hour.textContent)).toEqual(['20:00', '22:00']) // ב-API הן מגיעות הפוך

  // לוחצים על סדרה בלוח
  await user.click(screen.getByRole('link', { name: 'Person of Interest' }))
  // נפתח העמוד שלה
  expect(await screen.findByRole('heading', { level: 1, name: 'Person of Interest' })).toBeInTheDocument()
  // בכתובת הנכונה
  expect(address()).toHaveTextContent('/shows/2')
})
