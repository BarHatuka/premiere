// ─────────────────────────────────────────────
// ה-hook שכל העמודים טוענים איתו מידע: מחזיר loading / error / ready, ופונקציה ל"נסו שוב".
// משתמשים בו ב: HomePage, ‏ShowPage, ‏TodayPage.
// הזרימה: url משתנה ← ה-effect שולח בקשה ← התשובה נשמרת ב-cache וב-state ← רינדור חדש מחשב את המצב.
// אם המרצה שואל "למה הבקשה ב-useEffect ולא ישר בגוף הרכיב?": גוף הרכיב רץ בכל רינדור. בקשה שם הייתה נשלחת שוב ושוב, ו-setState אחריה היה גורם לרינדור נוסף בלי סוף.
// אם המרצה שואל "מה יקרה אם נמחק את attempt מהתלויות?": אחרי "נסו שוב" העמוד ייתקע על "טוענים", כי ה-effect לא ירוץ שוב.
// ─────────────────────────────────────────────

// useEffect: קוד שרץ אחרי הציור (כאן: בקשת הרשת). useState: זיכרון של הרכיב בין ציורים
import { useEffect, useState } from 'react'
// fetchJson שולחת את הבקשה, ו-NotFoundError מזהה תשובת 404
import { fetchJson, NotFoundError } from '../api/tvmaze'

// שלושת המצבים האפשריים של בקשה. | אומר "אחד מהבאים" (union type)
export type FetchState<T> =
  // עדיין מחכים לתשובה
  | { status: 'loading' }
  // משהו נכשל. notFound אומר אם זה 404, ו-message הוא הטקסט של השגיאה
  | { status: 'error'; notFound: boolean; message: string }
  // הכול הגיע. data הוא המידע עצמו, מהטיפוס T
  | { status: 'ready'; data: T }

// התשובה האחרונה, יחד עם הכתובת והניסיון שהיא שייכת אליהם
type Answer<T> = { url: string; attempt: number; state: FetchState<T> }

// תשובות שכבר הגיעו, לפי כתובת. החזרה לקיר מעמוד של סדרה לא טוענת אותו שוב.
// Map: מילון של כתובת ← תשובה. הוא מחוץ ל-hook, ולכן משותף לכל הרכיבים ונמחק רק ברענון
const cache = new Map<string, unknown>()

// לבדיקות: כל בדיקה מתחילה בלי תשובות מהבדיקה הקודמת
export function clearFetchCache() {
  // מרוקנים את המילון
  cache.clear()
}

// url = null: אין מה לטעון (למשל מזהה סדרה לא תקין בכתובת)
// hook משלנו: פונקציה שמתחילה ב-use ומשתמשת ב-hooks של React. HomePage, ‏ShowPage ו-TodayPage משתמשים בו
export function useFetch<T>(url: string | null) {
  const [attempt, setAttempt] = useState(0) // "נסו שוב" מעלה אותו ב-1, וזה מריץ את ה-effect מחדש
  // התשובה האחרונה שהגיעה. בהתחלה null, כי עוד לא הגיע כלום
  const [answer, setAnswer] = useState<Answer<T> | null>(null)

  // ה-effect רץ אחרי הציור, ושוב בכל פעם ש-url או attempt משתנים (ראו המערך בסוף)
  useEffect(() => {
    // אין כתובת, או שהתשובה כבר ב-cache: לא שולחים בקשה
    if (url === null || cache.has(url)) return

    // תשובה שמגיעה אחרי שהכתובת השתנתה, או אחרי שהרכיב ירד מהמסך, לא נכנסת ל-state
    let ignore = false

    // שולחים את הבקשה. then רץ כשהיא מצליחה, ו-catch כשהיא נכשלת
    fetchJson<T>(url)
      // הצלחה: data הוא המידע שהגיע
      .then((data) => {
        // שומרים ב-cache, כדי לא לבקש שוב את אותה כתובת
        cache.set(url, data)
        // מעדכנים את ה-state רק אם התשובה עדיין רלוונטית
        if (!ignore) setAnswer({ url, attempt, state: { status: 'ready', data } })
      })
      // כישלון: אין רשת, 404, 500 וכו'
      .catch((error: unknown) => {
        // מוציאים את הטקסט של השגיאה. unknown: TypeScript מחייב לבדוק מה זה לפני שמשתמשים
        const message = error instanceof Error ? error.message : String(error)
        // true אם זו השגיאה המיוחדת של 404
        const notFound = error instanceof NotFoundError
        // שומרים את השגיאה ב-state, שוב רק אם התשובה עדיין רלוונטית
        if (!ignore) setAnswer({ url, attempt, state: { status: 'error', notFound, message } })
      })

    // פונקציית ניקוי (cleanup): React מריץ אותה לפני ה-effect הבא, או כשהרכיב יורד מהמסך
    return () => {
      // מסמנים שהתשובה של הבקשה הזאת כבר לא מעניינת אותנו
      ignore = true
    }
    // מערך התלויות: ה-effect רץ מחדש רק כשאחד מהם משתנה
  }, [url, attempt])

  // המצב מחושב בכל רינדור ולא נשמר ב-state נוסף
  // ברירת המחדל: טוענים
  let state: FetchState<T> = { status: 'loading' }
  // אם התשובה כבר ב-cache, היא מוכנה מיד, בלי לחכות
  if (url !== null && cache.has(url)) {
    // מוציאים אותה מה-cache. as T: אנחנו יודעים איזה טיפוס שמרנו שם
    state = { status: 'ready', data: cache.get(url) as T }
    // אחרת, משתמשים בתשובה שב-state, אבל רק אם היא של הכתובת והניסיון הנוכחיים
  } else if (answer && answer.url === url && answer.attempt === attempt) {
    // זו התשובה הנכונה: מצליחה או שגיאה
    state = answer.state
  }

  // מחזירים את המצב, ופונקציה ל"נסו שוב" שמעלה את attempt ב-1
  return { state, retry: () => setAttempt((count) => count + 1) }
}
