// כלי הבדיקה של Vitest
import { expect, test } from 'vitest'
// הפונקציות שבודקים
import { dayLabel, genreLabel, languageLabel } from './labels'

// בדיקה: תרגום מאנגלית לעברית
test('translates genres, days and languages from TVmaze to Hebrew', () => {
  // ז'אנר
  expect(genreLabel('Science-Fiction')).toBe('מדע בדיוני')
  // יום
  expect(dayLabel('Saturday')).toBe('שבת')
  // שפה
  expect(languageLabel('Hebrew')).toBe('עברית')
})

// בדיקה: ערך בלי תרגום מוצג כמו שהוא, ולא נעלם
test('keeps a value it has no translation for, so nothing disappears from the screen', () => {
  // ז'אנר שלא במילון
  expect(genreLabel('Reality')).toBe('Reality')
  // שפה שלא במילון
  expect(languageLabel('Welsh')).toBe('Welsh')
})
