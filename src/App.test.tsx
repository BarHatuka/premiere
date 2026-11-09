// ─────────────────────────────────────────────
// בדיקות של התנהגות שמעבר לשורות הקבלה: 404, קישור משותף, "חזרה", חיפוש בלי תוצאות, כותרת הלשונית, הסרה מהרשימה, וז'אנר כקישור.
// מריצים עם npm test.
// ─────────────────────────────────────────────

// render מצייר, screen מחפש במסך, within מחפש בתוך אלמנט
import { render, screen, within } from '@testing-library/react'
// userEvent: מדמה משתמש אמיתי שלוחץ ומקליד
import userEvent from '@testing-library/user-event'
// ראוטר לבדיקות, שמתחיל בכתובת שבוחרים
import { MemoryRouter } from 'react-router'
// כלי הבדיקה של Vitest
import { beforeEach, expect, test, vi } from 'vitest'
// בודקים את כל האפליקציה
import App from './App'
// fetch מזויף עם תשובות קבועות, כדי שהבדיקות לא יהיו תלויות ברשת
import { defaultAnswers, fakeTvmaze } from './test/shows'

// בדיקות להתנהגות שמעבר לשורות הקבלה (שנמצאות ב-acceptance.test.tsx).

// לפני כל בדיקה מחליפים את fetch בגרסה המזויפת
beforeEach(() => {
  // stubGlobal: מחליף את fetch הגלובלי
  vi.stubGlobal('fetch', fakeTvmaze(defaultAnswers))
})

// מצייר את האפליקציה כאילו פתחנו את הכתובת path
function renderAt(path: string) {
  // render מצייר את מה שבסוגריים בתוך דף מדומה (jsdom)
  return render(
    // initialEntries: הכתובת שבה מתחילים
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

// פונקציית עזר: מחכה לקיר ומחזירה את כל הכרטיסים בו
const wallItems = async () => within(await screen.findByRole('region', { name: 'כל הסדרות' })).getAllByRole('listitem')

// בדיקה: כתובת שלא קיימת מציגה "לא נמצא", עם הכתובת
test('an address that does not exist shows the not-found page', () => {
  // פותחים כתובת שאין לה עמוד
  renderAt('/xyz')
  // הכותרת של עמוד "לא נמצא"
  expect(screen.getByRole('heading', { name: 'העמוד הזה לא בתוכנית' })).toBeInTheDocument()
  // והכתובת עצמה מופיעה בעמוד
  expect(screen.getByText('/xyz')).toBeInTheDocument()
})

// בדיקה: סדרה שלא קיימת (404) או מזהה שאינו מספר מציגים "לא נמצא"
test('a show that TVmaze does not know (404), or an id that is not a number, shows the not-found page', async () => {
  // סדרה שה-fetch המזויף מחזיר עליה 404
  const { unmount } = renderAt('/shows/999999')
  // find מחכה לתשובה, כי היא אסינכרונית
  expect(await screen.findByRole('heading', { name: 'העמוד הזה לא בתוכנית' })).toBeInTheDocument()
  // מורידים את האפליקציה מהמסך לפני הבדיקה הבאה
  unmount()

  // מזהה שאינו מספר
  renderAt('/shows/abc')
  // get ולא find: כאן אין בקשה, אז העמוד מופיע מיד
  expect(screen.getByRole('heading', { name: 'העמוד הזה לא בתוכנית' })).toBeInTheDocument()
})

// בדיקה: קישור עם סינון פותח את אותו קיר מסונן
test('a shared link opens the same filtered wall, because the genre and the search come from the address', async () => {
  // פותחים כתובת עם ז'אנר וחיפוש
  renderAt('/?genre=Comedy&q=new')

  // הכרטיסים בקיר
  const items = await wallItems()
  // רק אחד
  expect(items).toHaveLength(1)
  // והוא New Girl
  expect(items[0]).toHaveTextContent('New Girl')
  // תיבת החיפוש מציגה את new
  expect(screen.getByRole('searchbox', { name: 'חיפוש סדרה לפי שם' })).toHaveValue('new')
  // והכפתור קומדיה מסומן
  expect(screen.getByRole('button', { name: /קומדיה/ })).toHaveAttribute('aria-pressed', 'true')
})

// בדיקה: "חזרה" מעמוד סדרה מחזיר לאותו קיר מסונן
test('"חזרה" on a show page returns to the wall with the same filter', async () => {
  // משתמש מדומה
  const user = userEvent.setup()
  // מתחילים בקיר מסונן לפשע
  renderAt('/?genre=Crime')

  // לוחצים על Person of Interest
  await user.click((await screen.findAllByRole('link', { name: /Person of Interest/ }))[0])
  // ובעמוד שלה לוחצים "חזרה"
  await user.click(await screen.findByRole('button', { name: 'חזרה' }))

  // פשע עדיין מסומן
  expect(screen.getByRole('button', { name: /פשע/ })).toHaveAttribute('aria-pressed', 'true')
  // ובקיר שתי סדרות הפשע
  expect(await wallItems()).toHaveLength(2) // Person of Interest ו-NCIS: New Orleans
})

// בדיקה: חיפוש בלי תוצאות מסביר למה, והכפתור מחזיר את כל הקיר
test('a search with no results explains why, and "הצגת כל הסדרות" brings the whole wall back', async () => {
  // משתמש מדומה
  const user = userEvent.setup()
  // חיפוש שלא מוצא כלום
  renderAt('/?q=friends')

  // ההסבר מופיע
  expect(await screen.findByText(/לא מצאנו סדרה עם "friends" בשם/)).toBeInTheDocument()
  // לוחצים על הכפתור
  await user.click(screen.getByRole('button', { name: 'הצגת כל הסדרות' }))
  // וכל שש הסדרות חוזרות
  expect(await wallItems()).toHaveLength(6)
})

// בדיקה: בלשונית של הדפדפן מופיע שם הסדרה
test('the browser tab shows the name of the show', async () => {
  // פותחים את Person of Interest
  renderAt('/shows/2')
  // מחכים שהעמוד ייטען
  await screen.findByRole('heading', { level: 1, name: 'Person of Interest' })
  // document.title: הכותרת של הלשונית
  expect(document.title).toBe('Person of Interest | פרמיירה')
})

// בדיקה: הסרה מהרשימה, ורשימה ריקה שמסבירה מה לעשות
test('a show can be removed from "הרשימה שלי", and an empty list explains how to add one', async () => {
  // משתמש מדומה
  const user = userEvent.setup()
  // פותחים סדרה
  renderAt('/shows/2')
  // שומרים אותה
  await user.click(await screen.findByRole('button', { name: 'שמירה לרשימה שלי' }))
  // המונה בניווט עלה ל-1
  expect(screen.getByRole('link', { name: /הרשימה שלי 1/ })).toBeInTheDocument()

  // עוברים לעמוד הרשימה
  await user.click(screen.getByRole('link', { name: /הרשימה שלי/ }))
  // מסירים את הסדרה
  await user.click(screen.getByRole('button', { name: 'הסרת Person of Interest מהרשימה' }))

  // מופיע ההסבר של רשימה ריקה
  expect(screen.getByText(/הרשימה שלך עוד ריקה/)).toBeInTheDocument()
  // והמונה חזר ל-0
  expect(screen.getByRole('link', { name: /הרשימה שלי 0/ })).toBeInTheDocument()
})

// בדיקה: לחיצה על ז'אנר בעמוד סדרה פותחת קיר מסונן
test('a genre on a show page opens the wall filtered by that genre', async () => {
  // משתמש מדומה
  const user = userEvent.setup()
  // פותחים את Person of Interest
  renderAt('/shows/2')

  // לוחצים על הז'אנר פשע
  await user.click(await screen.findByRole('link', { name: 'פשע' }))

  // בקיר, הכפתור פשע מסומן (aria-pressed)
  expect(await screen.findByRole('button', { name: /פשע/, pressed: true })).toBeInTheDocument()
})
