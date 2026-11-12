// ─────────────────────────────────────────────
// העמוד הראשי (/): קיר הסדרות, עם חיפוש וסינון לפי ז'אנר.
// משתמשים בו ב: App.tsx, ב-Route ה-index.
// הזרימה: useFetch טוען ← wallOrder ממיין ← filterShows מסנן לפי q ו-genre מהכתובת ← ShowList מציג.
// למה replace: true: כדי שכל אות בחיפוש לא תוסיף רשומה להיסטוריה של הדפדפן. בלי זה, כל לחיצה על "אחורה" הייתה מוחקת אות אחת.
// ─────────────────────────────────────────────

// useSearchParams: קורא וכותב את החלק של הכתובת אחרי ה-? (למשל ?genre=Comedy&q=new)
import { useSearchParams } from 'react-router'
// הכתובת של רשימת הסדרות ב-TVmaze
import { SHOWS_URL } from '../api/tvmaze'
// הרכיבים שהעמוד מורכב מהם
import GenreFilter from '../components/GenreFilter'
import SearchBox from '../components/SearchBox'
import ShowList from '../components/ShowList'
import StatusMessage from '../components/StatusMessage'
// ה-hook שטוען מידע מהרשת
import { useFetch } from '../hooks/useFetch'
// הטיפוס של סדרה
import type { Show } from '../types/tvmaze'
// פונקציות הסינון
import { countGenres, describeNoResults, filterShows } from '../utils/filterShows'
// המיון של הקיר
import { wallOrder } from '../utils/shows'
// העיצוב של העמוד
import './HomePage.css'

// העמוד הראשי: קיר הסדרות, עם חיפוש וסינון
export default function HomePage() {
  // טוענים את רשימת הסדרות. state: טעינה / שגיאה / מוכן. retry: "נסו שוב"
  const { state, retry } = useFetch<Show[]>(SHOWS_URL)

  // החיפוש והז'אנר נשמרים בכתובת ולא ב-useState, כדי שאפשר יהיה לחזור לקיר המסונן ולשלוח אליו קישור.
  const [searchParams, setSearchParams] = useSearchParams()
  // הטקסט של החיפוש מהכתובת (?q=...). אם אין, מחרוזת ריקה
  const query = searchParams.get('q') ?? ''
  // הז'אנר מהכתובת (?genre=...). אם אין, null
  const genre = searchParams.get('genre')

  // replace: הקלדה בשדה החיפוש לא מוסיפה רשומה להיסטוריה על כל אות.
  // מעדכנת פרמטר אחד בכתובת: q או genre
  function updateParam(name: 'q' | 'genre', value: string | null) {
    // מקבלים את הפרמטרים הנוכחיים ומחזירים חדשים
    setSearchParams(
      // פונקציה שמקבלת את הפרמטרים הנוכחיים
      (current) => {
        // עותק של הפרמטרים, כדי לא לשנות את המקור
        const next = new URLSearchParams(current)
        // יש ערך: מעדכנים אותו
        if (value) next.set(name, value)
        // אין ערך: מוחקים את הפרמטר מהכתובת
        else next.delete(name)
        // מחזירים את הפרמטרים החדשים, ו-React Router מעדכן את הכתובת
        return next
      },
      // מחליפים את הרשומה הנוכחית בהיסטוריה במקום להוסיף חדשה
      { replace: true },
    )
  }

  // עדיין טוענים: הודעת טעינה עם פוסטרים ריקים
  if (state.status === 'loading') return <StatusMessage type="loading" text="טוענים את הסדרות…" posters />
  // שגיאה: הודעה עם כפתור "נסו שוב"
  if (state.status === 'error') {
    return <StatusMessage type="error" title="לא הצלחנו לטעון את הסדרות" details={state.message} onRetry={retry} />
  }

  // מכאן המידע הגיע. ממיינים לפי דירוג, ורק סדרות עם פוסטר
  const wall = wallOrder(state.data)
  // מסננים לפי החיפוש והז'אנר. התוצאה מחושבת מחדש בכל רינדור, ולכן לא צריך לשמור אותה ב-useState
  const visible = filterShows(wall, { query, genre })
  // המשפט שמעל הקיר. יחיד או רבים, לפי הכמות
  const countText =
    visible.length === 1 ? `מוצגת סדרה אחת מתוך ${wall.length}` : `מוצגות ${visible.length} מתוך ${wall.length} סדרות`

  // מה שהעמוד מציג
  return (
    // aria-labelledby: הכותרת home-title היא השם של ה-section
    <section className="home" aria-labelledby="home-title">
      {/* כותרת שרק קורא מסך שומע. לכל עמוד יש h1 */}
      <h1 id="home-title" className="visually-hidden">
        כל הסדרות
      </h1>

      {/* החלק העליון: חיפוש, ז'אנרים ומספר התוצאות */}
      <div className="home__toolbar">
        {/* החיפוש. הערך מהכתובת, וכל הקלדה מעדכנת את הכתובת */}
        <SearchBox value={query} onChange={(value) => updateParam('q', value)} />
        {/* הז'אנרים, עם מספר הסדרות בכל אחד */}
        <GenreFilter
          // countGenres סופר כמה סדרות יש בכל ז'אנר
          genres={countGenres(wall)}
          // הז'אנר הנבחר, מהכתובת
          selected={genre}
          // סך כל הסדרות, בשביל "הכול"
          total={wall.length}
          // לחיצה על ז'אנר מעדכנת את הכתובת
          onSelect={(value) => updateParam('genre', value)}
        />
        {/* aria-live="polite": קורא מסך מקריא את המספר כשהוא משתנה */}
        <p className="home__count" aria-live="polite">
          {countText}
          {visible.length > 1 && ', מהמדורגת ביותר ומטה'}
        </p>
      </div>

      {/* יש תוצאות: מציגים את הקיר. אין: הסבר וכפתור לאיפוס */}
      {visible.length > 0 ? (
        // יש תוצאות: הקיר
        <ShowList shows={visible} />
      ) : (
        // אין תוצאות
        <div className="home__empty">
          {/* משפט שמסביר למה אין תוצאות */}
          <p>{describeNoResults({ query, genre }, wall.length)}</p>
          {/* מוחק את כל הפרמטרים מהכתובת, וחוזרים לכל הסדרות */}
          <button type="button" className="button" onClick={() => setSearchParams({}, { replace: true })}>
            הצגת כל הסדרות
          </button>
        </div>
      )}
    </section>
  )
}
