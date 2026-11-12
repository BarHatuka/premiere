// ─────────────────────────────────────────────
// העמוד /shows/:id: קורא את המזהה מהכתובת, טוען את הסדרה, ומעביר אותה ל-ShowDetail.
// משתמשים בו ב: App.tsx.
// מה קורה בכתובת לא תקינה: ‎/shows/abc הוא לא מספר, ולכן מוצג "לא נמצא" בלי לשלוח בקשה. ‎/shows/999999 נשלח ל-TVmaze, הוא מחזיר 404, וגם אז מוצג "לא נמצא".
// ─────────────────────────────────────────────

// useParams: קורא את הפרמטרים מהכתובת, כאן את :id
import { useParams } from 'react-router'
// בונה את הכתובת של הסדרה ב-TVmaze
import { showUrl } from '../api/tvmaze'
// הקישור "חזרה"
import BackLink from '../components/BackLink'
// התצוגה של הסדרה
import ShowDetail from '../components/ShowDetail'
// הודעות טעינה ושגיאה
import StatusMessage from '../components/StatusMessage'
// ה-hook שטוען מידע
import { useFetch } from '../hooks/useFetch'
// הטיפוס של סדרה עם שחקנים
import type { ShowWithCast } from '../types/tvmaze'
// עמוד "לא נמצא"
import NotFoundPage from './NotFoundPage'

// העמוד /shows/:id: טוען סדרה לפי המזהה שבכתובת, ומעביר אותה ל-ShowDetail
export default function ShowPage() {
  // המזהה מהכתובת. = '': אם הוא חסר, מחרוזת ריקה
  const { id = '' } = useParams()
  // ביטוי רגולרי: רק ספרות. "abc" לא עובר
  const isValidId = /^\d+$/.test(id)

  // useFetch נקרא לפני ה-if-ים: hooks חייבים לרוץ בכל רינדור, באותו סדר
  // העמוד טוען את הסדרה לפי המזהה שבכתובת, ולכן הוא עובד גם בכניסה ישירה ואחרי רענון
  const { state, retry } = useFetch<ShowWithCast>(isValidId ? showUrl(id) : null)

  // מזהה לא תקין: עמוד "לא נמצא", בלי לשלוח בקשה
  if (!isValidId) return <NotFoundPage />
  // עדיין טוענים
  if (state.status === 'loading') return <StatusMessage type="loading" text="טוענים את הסדרה…" />
  // שגיאה: יש שני מקרים
  if (state.status === 'error') {
    // 404: הסדרה לא קיימת ב-TVmaze
    if (state.notFound) return <NotFoundPage />
    // כל שגיאה אחרת: הודעה עם "נסו שוב"
    return <StatusMessage type="error" title="לא הצלחנו לטעון את הסדרה" details={state.message} onRetry={retry} />
  }

  // מכאן הסדרה הגיעה
  const show = state.data

  // מה שהעמוד מציג
  return (
    // Fragment: כמה אלמנטים בלי עטיפה
    <>
      {/* הכותרת של הלשונית, עם שם הסדרה */}
      <title>{`${show.name} | פרמיירה`}</title>
      {/* הקישור "חזרה" או "לכל הסדרות" */}
      <BackLink />
      {/* key: לסדרה אחרת יש רכיב חדש, כך שמצב הפוסטר של הקודמת לא עובר אליה */}
      <ShowDetail key={show.id} show={show} />
    </>
  )
}
