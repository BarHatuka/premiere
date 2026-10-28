import type { Show } from '../types/tvmaze'

// רק סדרות עם פוסטר, מהדירוג הגבוה לנמוך. סדרה בלי דירוג יורדת לסוף.
// filter מחזיר מערך חדש, ולכן sort לא משנה את המערך שקיבלנו.
export function wallOrder<T extends Show>(shows: T[]): T[] {
  return shows
    .filter((show) => show.image !== null)
    .sort((a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0))
}
