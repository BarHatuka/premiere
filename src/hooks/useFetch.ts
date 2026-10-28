import { useEffect, useState } from 'react'
import { fetchJson, NotFoundError } from '../api/tvmaze'

export type FetchState<T> =
  | { status: 'loading' }
  | { status: 'error'; notFound: boolean; message: string }
  | { status: 'ready'; data: T }

// התשובה האחרונה, יחד עם הכתובת והניסיון שהיא שייכת אליהם
type Answer<T> = { url: string; attempt: number; state: FetchState<T> }

// תשובות שכבר הגיעו, לפי כתובת. החזרה לקיר מעמוד של סדרה לא טוענת אותו שוב.
const cache = new Map<string, unknown>()

// לבדיקות: כל בדיקה מתחילה בלי תשובות מהבדיקה הקודמת
export function clearFetchCache() {
  cache.clear()
}

// url = null: אין מה לטעון (למשל מזהה סדרה לא תקין בכתובת)
export function useFetch<T>(url: string | null) {
  const [attempt, setAttempt] = useState(0) // "נסו שוב" מעלה אותו ב-1, וזה מריץ את ה-effect מחדש
  const [answer, setAnswer] = useState<Answer<T> | null>(null)

  useEffect(() => {
    if (url === null || cache.has(url)) return

    // תשובה שמגיעה אחרי שהכתובת השתנתה, או אחרי שהרכיב ירד מהמסך, לא נכנסת ל-state
    let ignore = false

    fetchJson<T>(url)
      .then((data) => {
        cache.set(url, data)
        if (!ignore) setAnswer({ url, attempt, state: { status: 'ready', data } })
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error)
        const notFound = error instanceof NotFoundError
        if (!ignore) setAnswer({ url, attempt, state: { status: 'error', notFound, message } })
      })

    return () => {
      ignore = true
    }
  }, [url, attempt])

  // המצב מחושב בכל רינדור ולא נשמר ב-state נוסף
  let state: FetchState<T> = { status: 'loading' }
  if (url !== null && cache.has(url)) {
    state = { status: 'ready', data: cache.get(url) as T }
  } else if (answer && answer.url === url && answer.attempt === attempt) {
    state = answer.state
  }

  return { state, retry: () => setAttempt((count) => count + 1) }
}
