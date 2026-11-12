// ─────────────────────────────────────────────
// הסינון והחיפוש של הקיר, בלי React. פונקציות טהורות: אותו קלט נותן תמיד אותו פלט, ולכן קל לבדוק אותן.
// משתמשים בו ב: HomePage, ‏GenreFilter (הטיפוס), ובבדיקות filterShows.test.ts.
// החיפוש לא עובר על כל TVmaze, רק על כ-240 הסדרות שנטענו לקיר. זה כתוב ב-PRD, תחת "Not now".
// ─────────────────────────────────────────────

// הטיפוס של סדרה
import type { Show } from '../types/tvmaze'

// מה מסננים: טקסט חיפוש וז'אנר
export type ShowFilters = {
  // הטקסט שהוקלד
  query: string
  genre: string | null // null = כל הז'אנרים
}

// מחזירה רק את הסדרות שמתאימות לחיפוש ולז'אנר. פונקציה טהורה: בלי React, ולכן קל לבדוק אותה
export function filterShows<T extends Show>(shows: T[], { query, genre }: ShowFilters): T[] {
  // מנרמלים את טקסט החיפוש פעם אחת, לפני הלולאה
  const search = normalize(query)

  // filter: משאיר רק את הסדרות שהפונקציה מחזירה עליהן true
  return shows.filter((show) => {
    // השם מכיל את טקסט החיפוש? (חיפוש ריק תמיד מתאים)
    const matchesName = normalize(show.name).includes(search)
    // לא נבחר ז'אנר, או שהסדרה בז'אנר שנבחר
    const matchesGenre = genre === null || show.genres.includes(genre)
    // הסדרה נשארת רק אם שני התנאים מתקיימים
    return matchesName && matchesGenre
  })
}

// " Pokémon" → "pokemon", כך ש-"cafe" מוצא גם את "Café"
export function normalize(text: string): string {
  // מתחילים מהטקסט
  return text
    // NFD: מפרק אות עם סימן (é) לאות + סימן נפרד
    .normalize('NFD')
    // מוחק את הסימנים הנפרדים, ונשארת אות רגילה (e)
    .replace(/[\u0300-\u036f]/g, '')
    // אותיות קטנות, כדי שהחיפוש לא יהיה רגיש לגודל אות
    .toLowerCase()
    // מוחק רווחים בהתחלה ובסוף
    .trim()
}

// ז'אנר ומספר הסדרות בו
export type GenreCount = { name: string; count: number }

// כמה סדרות יש בכל ז'אנר: [{ name: 'Drama', count: 140 }, ...], מהנפוץ לנדיר.
export function countGenres(shows: Show[]): GenreCount[] {
  // מילון: שם ז'אנר ← כמות
  const counts: Record<string, number> = {}
  // עוברים על כל סדרה
  for (const show of shows) {
    // ועל כל ז'אנר שלה
    for (const genre of show.genres) {
      // מוסיפים 1. ?? 0: אם הז'אנר עוד לא במילון, מתחילים מ-0
      counts[genre] = (counts[genre] ?? 0) + 1
    }
  }

  // Object.entries: הופך את המילון למערך של זוגות [שם, כמות]
  return Object.entries(counts)
    // הופכים כל זוג לאובייקט { name, count }
    .map(([name, count]) => ({ name, count }))
    // מהכמות הגבוהה לנמוכה. בתיקו: לפי סדר האלף-בית
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

// ההודעה כשאין תוצאות. total = כמה סדרות נטענו (החיפוש לא עובר על כל הקטלוג, ראו "Not now" ב-PRD).
export function describeNoResults({ query, genre }: ShowFilters, total: number): string {
  // הטקסט בלי רווחים מיותרים
  const search = query.trim()

  // השמות ב-TVmaze באנגלית, אז חיפוש בעברית לא ימצא כלום
  // הביטוי הרגולרי בודק אם יש בטקסט אות עברית
  if (/[א-ת]/.test(search)) {
    // מציעים לכתוב באנגלית
    return `שמות הסדרות כאן באנגלית, כמו בשידור המקורי. נסו לכתוב את "${search}" באנגלית.`
  }
  // יש טקסט חיפוש שלא מצא כלום
  if (search) {
    // אם נבחר גם ז'אנר, מוסיפים את זה למשפט
    const inGenre = genre === null ? '' : " בז'אנר הזה"
    // מסבירים שהחיפוש עובר רק על הסדרות שבאתר
    return `לא מצאנו סדרה עם "${search}" בשם${inGenre}. החיפוש עובר על ${total} הסדרות שבאתר, לא על כל TVmaze.`
  }
  // אין חיפוש, רק ז'אנר בלי סדרות
  return 'אין כאן סדרות שמתאימות לסינון שבחרתם.'
}
