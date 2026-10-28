const BASE_URL = 'https://api.tvmaze.com'

// עמוד 0 של הקטלוג, בערך 240 סדרות
export const SHOWS_URL = `${BASE_URL}/shows`

// embed=cast: השחקנים מגיעים באותה בקשה
export function showUrl(id: string): string {
  return `${BASE_URL}/shows/${id}?embed=cast`
}

// לוח השידורים של היום בארה"ב
export const SCHEDULE_URL = `${BASE_URL}/schedule?country=US`

// ל-404 יש שגיאה משלו, כדי שעמוד הסדרה יציג "לא נמצא" ולא הודעה על תקלה ברשת
export class NotFoundError extends Error {}

// fetch זורק שגיאה רק כשאין רשת. על 404 או 500 צריך לבדוק את הסטטוס לבד.
export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (response.status === 404) throw new NotFoundError(`Not found: ${url}`)
  if (!response.ok) throw new Error(`TVmaze responded with status ${response.status}`)

  return (await response.json()) as T
}
