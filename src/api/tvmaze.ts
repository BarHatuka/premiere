// ─────────────────────────────────────────────
// כל הדיבור עם TVmaze במקום אחד: הכתובות, ופונקציה אחת ששולחת בקשה.
// משתמשים בו ב: useFetch.ts (fetchJson), ‏HomePage, ‏ShowPage ו-TodayPage (הכתובות).
// אם המרצה שואל "למה צריך לבדוק response.ok?": fetch נכשל רק כשאין רשת. 404 ו-500 נחשבים "תשובה", ולכן בודקים את הסטטוס בעצמנו.
// ─────────────────────────────────────────────

// הכתובת הבסיסית של ה-API. כל הכתובות האחרות נבנות ממנה
const BASE_URL = 'https://api.tvmaze.com'

// עמוד 0 של הקטלוג, בערך 240 סדרות
// export: כדי שקבצים אחרים (HomePage) יוכלו להשתמש בכתובת
export const SHOWS_URL = `${BASE_URL}/shows`

// embed=cast: השחקנים מגיעים באותה בקשה
// מקבלת מזהה סדרה ומחזירה את הכתובת של העמוד שלה, למשל showUrl('2')
export function showUrl(id: string): string {
  // template string: מכניסים את המזהה לתוך הכתובת
  return `${BASE_URL}/shows/${id}?embed=cast`
}

// לוח השידורים של היום בארה"ב
export const SCHEDULE_URL = `${BASE_URL}/schedule?country=US`

// ל-404 יש שגיאה משלו, כדי שעמוד הסדרה יציג "לא נמצא" ולא הודעה על תקלה ברשת
// extends Error: סוג שגיאה חדש, שאפשר לזהות אחר כך עם instanceof
export class NotFoundError extends Error {}

// fetch זורק שגיאה רק כשאין רשת. על 404 או 500 צריך לבדוק את הסטטוס לבד.
// <T>: גנרי. מי שקורא לפונקציה אומר איזה טיפוס הוא מצפה לקבל (למשל Show[])
// async: הפונקציה מחזירה Promise, ואפשר להשתמש בתוכה ב-await
export async function fetchJson<T>(url: string): Promise<T> {
  // שולחים את הבקשה ומחכים לתשובה מהשרת
  const response = await fetch(url)

  // 404: הסדרה לא קיימת. זורקים את השגיאה המיוחדת שלנו
  if (response.status === 404) throw new NotFoundError(`Not found: ${url}`)
  // כל סטטוס אחר שאינו הצלחה (200–299), למשל 500: זורקים שגיאה רגילה
  if (!response.ok) throw new Error(`TVmaze responded with status ${response.status}`)

  // הופכים את גוף התשובה מטקסט JSON לאובייקט. as T: אנחנו סומכים על TVmaze שהמבנה נכון
  return (await response.json()) as T
}
