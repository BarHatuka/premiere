// הטיפוס של פרטי סדרה
import type { ShowDetails } from '../types/tvmaze'
// מתרגם שם יום לעברית
import { dayLabel } from './labels'

// "2011-09-22" → "2011". בלי תאריך → מחרוזת ריקה.
export function getYear(date: string | null): string {
  // slice(0, 4): ארבעת התווים הראשונים, כלומר השנה
  return date ? date.slice(0, 4) : ''
}

// 8.8 → "8.8", ו-8 → "8.0", כדי שכל הדירוגים ייראו באותו אורך. בלי דירוג → null.
export function formatRating(average: number | null): string | null {
  // toFixed(1): מספר עם ספרה אחת אחרי הנקודה
  return average === null ? null : average.toFixed(1)
}

// ["דרמה", "פשע", "מתח"] → "דרמה, פשע ומתח", לפי כללי העברית של הדפדפן.
// Intl.ListFormat: כלי מובנה בדפדפן שמחבר רשימה עם פסיקים ו"ו" לפני האחרון
const hebrewList = new Intl.ListFormat('he', { style: 'long', type: 'conjunction' })
// מחזירה את הרשימה כמשפט
export function formatList(items: string[]): string {
  return hebrewList.format(items)
}

// התקציר מגיע כ-HTML. DOMParser מוציא ממנו רק את הטקסט, כך שלא צריך dangerouslySetInnerHTML.
export function htmlToText(html: string | null): string {
  // אין HTML: מחזירים מחרוזת ריקה
  if (!html) return ''
  // הדפדפן מפרק את ה-HTML למסמך, בלי להריץ ממנו קוד
  const doc = new DOMParser().parseFromString(html, 'text/html')
  // textContent: כל הטקסט בלי התגיות. trim: בלי רווחים בקצוות
  return (doc.body.textContent ?? '').trim()
}

// "כ-60 דקות". לסדרות בלי אורך קבוע יש רק averageRuntime.
// Pick: הפונקציה צריכה רק את שני השדות האלה, ולכן גם הבדיקות יכולות להעביר רק אותם
export function formatRuntime(show: Pick<ShowDetails, 'runtime' | 'averageRuntime'>): string | null {
  // runtime, ואם הוא null אז averageRuntime
  const minutes = show.runtime ?? show.averageRuntime
  // יש מספר: משפט. אין: null
  return minutes ? `כ-${minutes} דקות` : null
}

// משפט אחד על השידור, למשל:
// "שודרה בין 2011 ל-2016 ב-CBS, בימי שלישי בשעה 22:00 (לפי שעון הרשת)."
export function describeBroadcast(show: ShowDetails): string {
  // שנת ההתחלה
  const start = getYear(show.premiered)
  // שנת הסיום
  const end = getYear(show.ended)
  // ?. (optional chaining): אם network הוא null, לא נזרקת שגיאה. אין רשת? לוקחים את שירות הסטרימינג
  const channel = show.network?.name ?? show.webChannel?.name
  // " ב-CBS", או כלום אם אין ערוץ
  const onChannel = channel ? ` ב-${channel}` : ''

  // המשפט, לפי מצב הסדרה
  let sentence: string
  // אין שנת התחלה: הסדרה עוד לא עלתה
  if (!start) {
    sentence = 'עוד לא עלתה לשידור'
    // משודרת עכשיו
  } else if (show.status === 'Running') {
    sentence = `משודרת מאז ${start}${onChannel}`
    // הסתיימה, ושנת הסיום שונה משנת ההתחלה
  } else if (show.status === 'Ended' && end && end !== start) {
    sentence = `שודרה בין ${start} ל-${end}${onChannel}`
    // הסתיימה באותה שנה שהתחילה
  } else if (show.status === 'Ended') {
    sentence = `שודרה בשנת ${start}${onChannel}`
    // כל מצב אחר
  } else {
    sentence = `עלתה לשידור בשנת ${start}${onChannel}`
  }

  // ימים ושעה, אם ידועים
  const slot = describeSlot(show.schedule)
  // מחברים את שני החלקים, ומסיימים בנקודה
  return slot ? `${sentence}, ${slot}.` : `${sentence}.`
}

// "בימי שלישי בשעה 22:00 (לפי שעון הרשת)". השעה ב-TVmaze היא לפי אזור הזמן של הרשת, לא של ישראל.
// ShowDetails['schedule']: הטיפוס של השדה schedule בלבד
function describeSlot(schedule: ShowDetails['schedule']): string {
  // אין ימי שידור: אין מה לכתוב
  if (schedule.days.length === 0) return ''

  // כל 7 הימים: "כל יום". אחרת: "בימי שני ורביעי"
  const days = schedule.days.length === 7 ? 'כל יום' : `בימי ${formatList(schedule.days.map(dayLabel))}`
  // השעה, אם יש
  const time = schedule.time ? ` בשעה ${schedule.time} (לפי שעון הרשת)` : ''
  // מחברים
  return days + time
}
