// ─────────────────────────────────────────────
// פונקציות של "הרשימה שלי" בלי React: טעינה ושמירה ב-localStorage, והוספה או הסרה של סדרה.
// משתמשים בו ב: MyListProvider, ובבדיקות myList.test.ts.
// אם המרצה שואל "למה toggleShow מחזירה מערך חדש?": React משווה את ה-state הישן לחדש לפי הפניה בזיכרון. אם משנים את אותו מערך (push), הוא לא מזהה שינוי ולא מצייר מחדש.
// ─────────────────────────────────────────────

// הטיפוס של סדרה
import type { Show } from '../types/tvmaze'

// המפתח שתחתיו הרשימה נשמרת ב-localStorage
const STORAGE_KEY = 'premiere:my-list'

// שומרים רק את השדות של הכרטיס, כך שהעמוד /my-list לא צריך בקשה ל-TVmaze
export function toSavedShow(show: Show): Show {
  // destructuring: מוציאים מהאובייקט רק את השדות האלה
  const { id, name, genres, premiered, rating, image } = show
  // מחזירים אובייקט חדש רק איתם
  return { id, name, genres, premiered, rating, image }
}

// אין רשימה שמורה, או שהמידע פגום: מתחילים מרשימה ריקה
export function loadMyList(): Show[] {
  // try: אם JSON.parse נכשל על מידע פגום, עוברים ל-catch במקום שהאתר יקרוס
  try {
    // קוראים את הטקסט מ-localStorage. ?? '[]': אם אין כלום, משתמשים במערך ריק
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    // אם זה מערך, מחזירים אותו. אחרת, מחזירים רשימה ריקה
    return Array.isArray(saved) ? (saved as Show[]) : []
    // המידע פגום: מתחילים מרשימה ריקה
  } catch {
    // מתחילים מרשימה ריקה
    return []
  }
}

// שומרת את הרשימה ב-localStorage
export function storeMyList(shows: Show[]) {
  // try: שמירה יכולה להיכשל, למשל בגלישה פרטית
  try {
    // localStorage שומר רק טקסט, ולכן הופכים את המערך ל-JSON
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shows))
  } catch {
    // גלישה פרטית או אחסון מלא: הרשימה עובדת, רק לא תישמר לפעם הבאה.
  }
}

// מחזיר מערך חדש ולא משנה את הקודם, כדי ש-React יזהה שה-state השתנה
export function toggleShow(shows: Show[], show: Show): Show[] {
  // אם הסדרה כבר שמורה...
  return shows.some((saved) => saved.id === show.id)
    // ...מחזירים רשימה בלעדיה (filter)
    ? shows.filter((saved) => saved.id !== show.id)
    // ...אחרת מחזירים את הרשימה הקיימת, ובסופה הסדרה החדשה (spread: ...)
    : [...shows, toSavedShow(show)]
}
