// ─────────────────────────────────────────────
// בדיקות של לוח השידורים: קיבוץ לפי שעה, תיאור פרק ותאריך.
// ─────────────────────────────────────────────

// כלי הבדיקה של Vitest
import { expect, test } from 'vitest'
// makeEntry: יוצר שידור מזויף לבדיקות
import { makeEntry } from '../test/shows'
// הפונקציות שבודקים
import { describeEpisode, formatAirdate, groupByHour } from './schedule'

// בדיקה: קיבוץ לפי שעה, מהמוקדמת, ושידורים בלי שעה בסוף
test('entries are grouped by the hour, earliest first, and entries without a time go last', () => {
  // ארבעה שידורים בסדר מעורבב. לאחד אין שעה
  const groups = groupByHour([
    // 21:30, בלי שעה, 20:00 ו-21:00
    makeEntry({ id: 1, airtime: '21:30' }),
    makeEntry({ id: 2, airtime: '' }),
    makeEntry({ id: 3, airtime: '20:00' }),
    makeEntry({ id: 4, airtime: '21:00' }),
  ])

  // שלוש קבוצות, בסדר הנכון
  expect(groups.map((group) => group.hour)).toEqual(['20:00', '21:00', ''])
  // בקבוצה של 21:00: קודם 21:00 ואחר כך 21:30
  expect(groups[1].entries.map((entry) => entry.id)).toEqual([4, 1])
})

// בדיקה: הניסוח של עונה ופרק
test('describeEpisode names the season and the episode', () => {
  // פרק רגיל
  expect(describeEpisode({ season: 2, number: 5 })).toBe('עונה 2, פרק 5')
  // פרק מיוחד, בלי מספר
  expect(describeEpisode({ season: 2, number: null })).toBe('עונה 2, פרק מיוחד')
})

// בדיקה: תאריך בעברית
test('formatAirdate writes the day in Hebrew', () => {
  // 17/10/2026 היה יום שבת
  expect(formatAirdate('2026-10-17')).toBe('יום שבת, 17 באוקטובר')
})
