// ─────────────────────────────────────────────
// הכפתור "חזרה" בעמוד של סדרה.
// משתמשים בו ב: ShowPage.
// אם המרצה שואל "למה לא תמיד navigate(-1)?": מי שנכנס ישר מקישור אין לו עמוד קודם באתר, ו-navigate(-1) היה מוציא אותו מהאתר. אז במקרה הזה מציגים קישור לקיר.
// ─────────────────────────────────────────────

// Link: קישור פנימי. useLocation: הכתובת הנוכחית. useNavigate: מעבר עמוד מתוך קוד
import { Link, useLocation, useNavigate } from 'react-router'
// רכיב האייקונים
import Icon from './Icon'
// העיצוב של הכפתור
import './BackLink.css'

// כניסה ישירה לכתובת (key === 'default'): אין עמוד קודם באפליקציה, אז מקשרים לקיר.
// אחרת חוזרים צעד אחד, והקיר חוזר עם החיפוש והסינון שהיו בו.
export default function BackLink() {
  // הכתובת הנוכחית. ל-location יש key, ו-'default' אומר שזה העמוד הראשון שנפתח
  const location = useLocation()
  // פונקציה שמעבירה עמוד. navigate(-1) זה כמו "אחורה" בדפדפן
  const navigate = useNavigate()

  // נכנסו ישר לכתובת הזאת: אין לאן לחזור באפליקציה
  if (location.key === 'default') {
    // מציגים קישור רגיל לקיר
    return (
      <Link to="/" className="back-link">
        {/* חץ */}
        <Icon name="back" />
        לכל הסדרות
      </Link>
    )
  }

  // הגענו מעמוד אחר באפליקציה: כפתור שחוזר צעד אחד אחורה בהיסטוריה
  return (
    <button type="button" className="back-link" onClick={() => navigate(-1)}>
      {/* חץ */}
      <Icon name="back" />
      חזרה
    </button>
  )
}
