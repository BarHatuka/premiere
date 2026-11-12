// ─────────────────────────────────────────────
// העמוד /today: לוח השידורים של היום בארה"ב, מקובץ לפי שעה.
// משתמשים בו ב: App.tsx.
// למה השעות לא לפי שעון ישראל: TVmaze נותן את השעה לפי אזור הזמן של הרשת המשדרת, ולכן כתוב בעמוד "לפי שעון הרשת".
// ─────────────────────────────────────────────

// Link: כל שידור מקשר לעמוד של הסדרה
import { Link } from 'react-router'
// הכתובת של לוח השידורים
import { SCHEDULE_URL } from '../api/tvmaze'
// הודעות טעינה ושגיאה
import StatusMessage from '../components/StatusMessage'
// ה-hook שטוען מידע מהרשת
import { useFetch } from '../hooks/useFetch'
// הטיפוס של שידור אחד
import type { ScheduleEntry } from '../types/tvmaze'
// פונקציות: תיאור פרק, תאריך בעברית וקיבוץ לפי שעה
import { describeEpisode, formatAirdate, groupByHour } from '../utils/schedule'
// העיצוב של העמוד
import './TodayPage.css'

// העמוד /today: לוח השידורים של היום בארה"ב, לפי שעה
export default function TodayPage() {
  // טוענים את הלוח
  const { state, retry } = useFetch<ScheduleEntry[]>(SCHEDULE_URL)

  // עדיין טוענים
  if (state.status === 'loading') return <StatusMessage type="loading" text="טוענים את לוח השידורים…" />
  // שגיאה, עם "נסו שוב"
  if (state.status === 'error') {
    return <StatusMessage type="error" title="לא הצלחנו לטעון את לוח השידורים" details={state.message} onRetry={retry} />
  }

  // השידורים שהגיעו
  const entries = state.data
  // מקבצים אותם לקבוצות לפי שעה עגולה
  const groups = groupByHour(entries)

  // מה שהעמוד מציג
  return (
    // section עם שם לקורא מסך: הכותרת today-title
    <section className="today" aria-labelledby="today-title">
      {/* הכותרת של הלשונית */}
      <title>היום בטלוויזיה | פרמיירה</title>
      {/* הכותרת של העמוד */}
      <h1 id="today-title" className="page-title">
        היום בטלוויזיה
      </h1>
      {/* התאריך (מהשידור הראשון) והסבר על השעות */}
      <p className="today__intro">
        {entries.length > 0 && `${formatAirdate(entries[0].airdate)} · `}
        לוח השידורים בארה"ב. השעות לפי שעון הרשת, ולא לפי שעון ישראל.
      </p>

      {/* אם אין שידורים בכלל, אומרים את זה */}
      {groups.length === 0 && <p>היום אין שידורים בלוח של TVmaze.</p>}

      {/* section לכל שעה. key: השעה, שלא חוזרת */}
      {groups.map((group) => (
        // קבוצה של שעה אחת
        <section key={group.hour} className="today__hour">
          {/* כותרת השעה. מחרוזת ריקה היא שידורים בלי שעה קבועה */}
          <h2 className="today__hour-title">{group.hour || 'בלי שעה קבועה'}</h2>
          {/* השידורים של השעה הזאת */}
          <ul className="today__list">
            {/* שורה לכל שידור. key: המזהה של הפרק */}
            {group.entries.map((entry) => (
              // שידור אחד
              <li key={entry.id} className="today__entry">
                {/* השעה המדויקת */}
                <span className="today__time">{entry.airtime}</span>
                {/* שם הסדרה, קישור לעמוד שלה */}
                <Link to={`/shows/${entry.show.id}`} className="today__show" dir="ltr">
                  {entry.show.name}
                </Link>
                {/* עונה ופרק, ושם הפרק אם יש */}
                <span className="today__episode">
                  {describeEpisode(entry)}
                  {/* אם לפרק יש שם, מוסיפים נקודה ואת השם */}
                  {entry.name && (
                    <>
                      {' · '}
                      <span dir="ltr">{entry.name}</span>
                    </>
                  )}
                </span>
                {/* הרשת, אם ידועה */}
                {entry.show.network && (
                  // שם הרשת, באנגלית
                  <span className="today__network" dir="ltr">
                    {entry.show.network.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  )
}
