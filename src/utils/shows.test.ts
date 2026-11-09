// ─────────────────────────────────────────────
// בדיקות של סדר הקיר.
// ─────────────────────────────────────────────

// test מגדיר בדיקה, ו-expect בודק שהתוצאה היא מה שציפינו
import { expect, test } from 'vitest'
// makeShow: יוצר סדרה מזויפת לבדיקות
import { makeShow } from '../test/shows'
// הפונקציה שבודקים
import { wallOrder } from './shows'

// בדיקה: המיון מהדירוג הגבוה לנמוך, וסדרה בלי דירוג בסוף
test('the wall is ordered from the highest rating down, and a show without a rating goes last', () => {
  // שלוש סדרות בסדר מעורבב
  const shows = [
    // דירוגים 7.1, בלי דירוג, ו-8.8
    makeShow({ id: 1, rating: { average: 7.1 } }),
    makeShow({ id: 2, rating: { average: null } }),
    makeShow({ id: 3, rating: { average: 8.8 } }),
  ]
  // מצפים לסדר: 8.8, ‏7.1, ובלי דירוג
  expect(wallOrder(shows).map((show) => show.id)).toEqual([3, 1, 2])
})

// בדיקה: סדרה בלי פוסטר לא נכנסת, והמערך המקורי לא משתנה
test('shows without a poster are left out, and the original array is not changed', () => {
  // סדרה עם פוסטר וסדרה בלי
  const shows = [makeShow({ id: 1 }), makeShow({ id: 2, image: null })]
  // נשארה רק הראשונה
  expect(wallOrder(shows).map((show) => show.id)).toEqual([1])
  // והמערך המקורי עדיין עם שתיהן
  expect(shows).toHaveLength(2)
})
