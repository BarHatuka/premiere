// ─────────────────────────────────────────────
// פונקציות של לוח השידורים: קיבוץ לפי שעה, תיאור פרק ותאריך בעברית.
// משתמשים בו ב: TodayPage, ובבדיקות schedule.test.ts.
// ─────────────────────────────────────────────

// הטיפוס של שידור אחד
import type { ScheduleEntry } from '../types/tvmaze'

// קבוצה של שידורים באותה שעה
export type HourGroup = {
  hour: string // "20:00", או "" לשידורים בלי שעה קבועה
  // השידורים של השעה הזאת
  entries: ScheduleEntry[]
}

// מקבץ את השידורים לפי השעה העגולה: 20:00 ו-20:30 נכנסים שניהם תחת "20:00".
// השעות ממוינות מהמוקדמת למאוחרת, ושידורים בלי שעה יורדים לסוף.
export function groupByHour(entries: ScheduleEntry[]): HourGroup[] {
  // [...entries]: עותק, כדי ש-sort לא ישנה את המערך המקורי. ממיינים לפי השעה כטקסט ("09:00" לפני "20:00")
  const sorted = [...entries].sort((a, b) => sortKey(a.airtime).localeCompare(sortKey(b.airtime)))
  // כאן נאסוף את הקבוצות
  const groups: HourGroup[] = []

  // עוברים על השידורים, כבר ממוינים
  for (const entry of sorted) {
    // "20:30" → "20:00". בלי שעה → ""
    const hour = entry.airtime ? `${entry.airtime.slice(0, 2)}:00` : ''
    // הקבוצה האחרונה שנוצרה. at(-1): האיבר האחרון במערך
    const last = groups.at(-1)
    // אותה שעה כמו הקבוצה האחרונה: מוסיפים אליה
    if (last && last.hour === hour) last.entries.push(entry)
    // שעה חדשה: פותחים קבוצה חדשה
    else groups.push({ hour, entries: [entry] })
  }
  // מחזירים את הקבוצות
  return groups
}

// "" (בלי שעה) צריך לבוא אחרי "23:59", ולכן ממיינים אותו כ-"99:99"
function sortKey(airtime: string): string {
  // ||: אם airtime ריק, משתמשים ב-"99:99"
  return airtime || '99:99'
}

// "עונה 2, פרק 5". פרק מיוחד בלי מספר → "עונה 2, פרק מיוחד".
export function describeEpisode(entry: Pick<ScheduleEntry, 'season' | 'number'>): string {
  // אין מספר פרק: "פרק מיוחד". יש: המספר
  return entry.number === null ? `עונה ${entry.season}, פרק מיוחד` : `עונה ${entry.season}, פרק ${entry.number}`
}

// "2026-10-17" → "יום שבת, 17 באוקטובר".
// בונים את התאריך מהחלקים שלו, כדי שאזור הזמן של המחשב לא יזיז אותו ביום.
// Intl.DateTimeFormat: כלי מובנה שמנסח תאריך בעברית
const hebrewDate = new Intl.DateTimeFormat('he', { weekday: 'long', day: 'numeric', month: 'long' })
// מחזירה את התאריך כטקסט בעברית
export function formatAirdate(airdate: string): string {
  // מפרקים "2026-10-17" לשלושה מספרים
  const [year, month, day] = airdate.split('-').map(Number)
  // month - 1: ב-JavaScript החודשים מתחילים מ-0 (ינואר = 0)
  return hebrewDate.format(new Date(year, month - 1, day))
}
