// ─────────────────────────────────────────────
// המסגרת הקבועה של כל העמודים: כותרת, ניווט, תחתית, ו-Outlet שבו מוצג העמוד הנוכחי.
// משתמשים בו ב: App.tsx, כ-Route שעוטף את כל העמודים.
// ההבדל בין NavLink ל-Link: ‏NavLink יודע אם הכתובת שלו היא העמוד הנוכחי, ואז מוסיף לעצמו class="active". ככה מסמנים בתפריט את העמוד שנמצאים בו.
// ─────────────────────────────────────────────

// Link: קישור פנימי בלי טעינת דף. NavLink: קישור שיודע אם הוא העמוד הפעיל. Outlet: המקום שבו יוצג העמוד
import { Link, NavLink, Outlet } from 'react-router'
// הרשימה השמורה, בשביל המספר שליד "הרשימה שלי"
import { useMyList } from '../hooks/useMyList'
// רכיב שגולל לראש הדף במעבר עמוד
import ScrollToTop from './ScrollToTop'
// העיצוב של המסגרת
import './Layout.css'

// המסגרת של כל עמוד: כותרת, ניווט, העמוד עצמו ותחתית
export default function Layout() {
  // קוראים את "הרשימה שלי" מה-Context
  const myList = useMyList()

  // מה שהרכיב מציג
  return (
    // div שעוטף את כל הדף
    <div className="layout">
      {/* לא מציג כלום, רק גולל למעלה במעבר בין עמודים */}
      <ScrollToTop />

      {/* הכותרת העליונה */}
      <header className="site-header">
        {/* שם האתר והמשפט שמתחתיו */}
        <div className="site-header__brand">
          {/* לחיצה על השם מחזירה לקיר */}
          <Link to="/" className="site-header__title">
            פרמיירה
          </Link>
          {/* המשפט שמתחת לשם */}
          <p className="site-header__tagline">הסדרה הבאה שלך מתחילה כאן.</p>
        </div>

        {/* תפריט הניווט. aria-label נותן לו שם בשביל קורא מסך */}
        <nav className="site-nav" aria-label="ניווט ראשי">
          {/* end: הקישור מסומן רק כשהכתובת היא בדיוק "/". ב-React Router קישור ל-"/" מתנהג כך גם בלי end, אז כאן זה רק מבהיר את הכוונה */}
          <NavLink to="/" end>
            כל הסדרות
          </NavLink>
          {/* הקישור לרשימה, עם מספר הסדרות השמורות */}
          <NavLink to="/my-list">
            הרשימה שלי <span className="site-nav__count">{myList.shows.length}</span>
          </NavLink>
          {/* הקישור ללוח השידורים */}
          <NavLink to="/today">היום בטלוויזיה</NavLink>
        </nav>
      </header>

      {/* התוכן הראשי של הדף */}
      <main className="layout__main">
        {/* כאן React Router מציג את העמוד שמתאים לכתובת (HomePage, ‏ShowPage וכו') */}
        <Outlet />
      </main>

      {/* התחתית: קרדיט ל-TVmaze, כפי שהרישיון שלהם דורש */}
      <footer className="site-footer">
        <p>
          המידע והתמונות מ-<a href="https://www.tvmaze.com">TVmaze</a>, ברישיון{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>.
        </p>
        {/* שורה על הפרויקט */}
        <p>נבנה על ידי בר חתוכה · פרויקט גמר במכללת אונו · 2026.</p>
      </footer>
    </div>
  )
}
