import type { ShowDetails } from '../types/tvmaze'
import { dayLabel } from './labels'

// "2011-09-22" → "2011". בלי תאריך → מחרוזת ריקה.
export function getYear(date: string | null): string {
  return date ? date.slice(0, 4) : ''
}

// 8.8 → "8.8", ו-8 → "8.0", כדי שכל הדירוגים ייראו באותו אורך. בלי דירוג → null.
export function formatRating(average: number | null): string | null {
  return average === null ? null : average.toFixed(1)
}

// ["דרמה", "פשע", "מתח"] → "דרמה, פשע ומתח", לפי כללי העברית של הדפדפן.
const hebrewList = new Intl.ListFormat('he', { style: 'long', type: 'conjunction' })
export function formatList(items: string[]): string {
  return hebrewList.format(items)
}

// התקציר מגיע כ-HTML. DOMParser מוציא ממנו רק את הטקסט, כך שלא צריך dangerouslySetInnerHTML.
export function htmlToText(html: string | null): string {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent ?? '').trim()
}

// "כ-60 דקות". לסדרות בלי אורך קבוע יש רק averageRuntime.
export function formatRuntime(show: Pick<ShowDetails, 'runtime' | 'averageRuntime'>): string | null {
  const minutes = show.runtime ?? show.averageRuntime
  return minutes ? `כ-${minutes} דקות` : null
}

// משפט אחד על השידור, למשל:
// "שודרה בין 2011 ל-2016 ב-CBS, בימי שלישי בשעה 22:00 (לפי שעון הרשת)."
export function describeBroadcast(show: ShowDetails): string {
  const start = getYear(show.premiered)
  const end = getYear(show.ended)
  const channel = show.network?.name ?? show.webChannel?.name
  const onChannel = channel ? ` ב-${channel}` : ''

  let sentence: string
  if (!start) {
    sentence = 'עוד לא עלתה לשידור'
  } else if (show.status === 'Running') {
    sentence = `משודרת מאז ${start}${onChannel}`
  } else if (show.status === 'Ended' && end && end !== start) {
    sentence = `שודרה בין ${start} ל-${end}${onChannel}`
  } else if (show.status === 'Ended') {
    sentence = `שודרה בשנת ${start}${onChannel}`
  } else {
    sentence = `עלתה לשידור בשנת ${start}${onChannel}`
  }

  const slot = describeSlot(show.schedule)
  return slot ? `${sentence}, ${slot}.` : `${sentence}.`
}

// "בימי שלישי בשעה 22:00 (לפי שעון הרשת)". השעה ב-TVmaze היא לפי אזור הזמן של הרשת, לא של ישראל.
function describeSlot(schedule: ShowDetails['schedule']): string {
  if (schedule.days.length === 0) return ''

  const days = schedule.days.length === 7 ? 'כל יום' : `בימי ${formatList(schedule.days.map(dayLabel))}`
  const time = schedule.time ? ` בשעה ${schedule.time} (לפי שעון הרשת)` : ''
  return days + time
}
