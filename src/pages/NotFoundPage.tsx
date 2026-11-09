// ─────────────────────────────────────────────
// עמוד "לא נמצא", עם הכתובת שביקשו.
// משתמשים בו ב: App.tsx (לכל כתובת אחרת, path="*") וב-ShowPage (סדרה שלא קיימת).
// ─────────────────────────────────────────────

// Link: קישור חזרה לקיר. useLocation: הכתובת שביקשו
import { Link, useLocation } from 'react-router'
// העיצוב של העמוד
import './NotFoundPage.css'

// מופיע בכל כתובת שאין לה עמוד, וגם כשמבקשים סדרה שלא קיימת.
export default function NotFoundPage() {
  // pathname: הכתובת שביקשו, למשל "/xyz"
  const { pathname } = useLocation()
  // מה שהעמוד מציג
  return (
    // section שעוטף את כל העמוד
    <section className="not-found">
      {/* הכותרת של הלשונית בדפדפן */}
      <title>העמוד לא נמצא | פרמיירה</title>
      {/* מסגרת לקישוט בלבד. aria-hidden: קורא מסך מתעלם ממנה */}
      <span className="not-found__frame" aria-hidden="true" />
      {/* הכותרת של העמוד */}
      <h1 className="page-title">העמוד הזה לא בתוכנית</h1>
      {/* המשפט עם הכתובת. dir="ltr" שומר על סדר התווים של הכתובת בתוך משפט בעברית */}
      <p>
  אין לנו עמוד בכתובת <span dir="ltr">{pathname}</span>.
  אולי הקישור השתנה, ואולי הסדרה ירדה מהלוח.
</p>
      {/* קישור חזרה לקיר */}
      <Link to="/" className="button">
        חזרה לכל הסדרות
      </Link>
    </section>
  )
}
