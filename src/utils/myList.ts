import type { Show } from '../types/tvmaze'

const STORAGE_KEY = 'premiere:my-list'

// שומרים רק את השדות של הכרטיס, כך שהעמוד /my-list לא צריך בקשה ל-TVmaze
export function toSavedShow(show: Show): Show {
  const { id, name, genres, premiered, rating, image } = show
  return { id, name, genres, premiered, rating, image }
}

// אין רשימה שמורה, או שהמידע פגום: מתחילים מרשימה ריקה
export function loadMyList(): Show[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(saved) ? (saved as Show[]) : []
  } catch {
    return []
  }
}

export function storeMyList(shows: Show[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shows))
  } catch {
    // גלישה פרטית או אחסון מלא: הרשימה עובדת, רק לא תישמר לפעם הבאה.
  }
}

// מחזיר מערך חדש ולא משנה את הקודם, כדי ש-React יזהה שה-state השתנה
export function toggleShow(shows: Show[], show: Show): Show[] {
  return shows.some((saved) => saved.id === show.id)
    ? shows.filter((saved) => saved.id !== show.id)
    : [...shows, toSavedShow(show)]
}
