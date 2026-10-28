import { expect, test } from 'vitest'
import { dayLabel, genreLabel, languageLabel } from './labels'

test('translates genres, days and languages from TVmaze to Hebrew', () => {
  expect(genreLabel('Science-Fiction')).toBe('מדע בדיוני')
  expect(dayLabel('Saturday')).toBe('שבת')
  expect(languageLabel('Hebrew')).toBe('עברית')
})

test('keeps a value it has no translation for, so nothing disappears from the screen', () => {
  expect(genreLabel('Reality')).toBe('Reality')
  expect(languageLabel('Welsh')).toBe('Welsh')
})
