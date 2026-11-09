// describe מקבץ כמה בדיקות תחת שם אחד
import { describe, expect, test } from 'vitest'
// סדרות לדוגמה, ופונקציה שיוצרת סדרה
import { makeShow, testShows } from '../test/shows'
// הפונקציות שבודקים
import { countGenres, describeNoResults, filterShows, normalize } from './filterShows'

// פונקציית עזר: מערך סדרות ← מערך שמות, כדי שקל להשוות
const names = (shows: { name: string }[]) => shows.map((show) => show.name)

// הבדיקות של filterShows
describe('filterShows', () => {
  // בלי חיפוש ובלי ז'אנר, כל הסדרות נשארות
  test('without a search or a genre, every show stays', () => {
    // אותו מספר סדרות כמו בהתחלה
    expect(filterShows(testShows, { query: '', genre: null })).toHaveLength(testShows.length)
  })

  // החיפוש לא מבחין בין אותיות גדולות לקטנות
  test('search ignores upper and lower case', () => {
    // GLEE באותיות גדולות מוצא את Glee
    expect(names(filterShows(testShows, { query: 'GLEE', genre: null }))).toEqual(['Glee'])
  })

  // החיפוש מתעלם מסימנים מעל האותיות
  test('search ignores accents, so "pokemon" finds "Pokémon"', () => {
    // שתי סדרות, אחת עם é
    const shows = [makeShow({ id: 1, name: 'Pokémon' }), makeShow({ id: 2, name: 'Glee' })]
    // pokemon בלי הסימן מוצא את Pokémon
    expect(names(filterShows(shows, { query: 'pokemon', genre: null }))).toEqual(['Pokémon'])
  })

  // ז'אנר וחיפוש ביחד, כמו בשורת הקבלה ב-PRD
  test('genre and search work together', () => {
    // קומדיה + new = רק New Girl
    expect(names(filterShows(testShows, { query: 'new', genre: 'Comedy' }))).toEqual(['New Girl'])
  })
})

// בדיקה ל-normalize: בלי סימנים, אותיות קטנות, בלי רווחים בקצוות
test('normalize removes accents, case and outer spaces', () => {
  // '  Café ' הופך ל-'cafe'
  expect(normalize('  Café ')).toBe('cafe')
})

// בדיקה: ספירת הז'אנרים, מהנפוץ לנדיר
test('countGenres counts every genre, the most common first', () => {
  // שלוש סדרות: דרמה מופיעה פעמיים
  const shows = [
    makeShow({ id: 1, genres: ['Drama', 'Crime'] }),
    makeShow({ id: 2, genres: ['Drama'] }),
    makeShow({ id: 3, genres: ['Comedy'] }),
  ]
  // דרמה ראשונה. קומדיה ופשע בתיקו, ולכן לפי האלף-בית
  expect(countGenres(shows)).toEqual([
    { name: 'Drama', count: 2 },
    { name: 'Comedy', count: 1 },
    { name: 'Crime', count: 1 },
  ])
})

// הבדיקות של ההודעה כשאין תוצאות
describe('describeNoResults', () => {
  // חיפוש בעברית: מסבירים שהשמות באנגלית
  test('a Hebrew search explains that the names are in English', () => {
    // גם הרווחים בקצוות נמחקים מהמשפט
    expect(describeNoResults({ query: ' חברים ', genre: null }, 240)).toBe(
      'שמות הסדרות כאן באנגלית, כמו בשידור המקורי. נסו לכתוב את "חברים" באנגלית.',
    )
  })

  // חיפוש באנגלית: כמה סדרות נבדקו, והז'אנר רק אם נבחר
  test('an English search says how many shows were searched, and mentions the genre only when one is picked', () => {
    // בלי ז'אנר
    expect(describeNoResults({ query: 'friends', genre: null }, 240)).toBe(
      'לא מצאנו סדרה עם "friends" בשם. החיפוש עובר על 240 הסדרות שבאתר, לא על כל TVmaze.',
    )
    // עם ז'אנר: מופיע "בז'אנר הזה"
    expect(describeNoResults({ query: 'zzz', genre: 'Comedy' }, 240)).toContain("בשם בז'אנר הזה.")
  })

  // בלי חיפוש: משפט על הסינון
  test('without a search, it talks about the filter', () => {
    // רק ז'אנר
    expect(describeNoResults({ query: '', genre: 'Comedy' }, 240)).toBe('אין כאן סדרות שמתאימות לסינון שבחרתם.')
  })
})
