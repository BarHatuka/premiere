// ─────────────────────────────────────────────
// הקיר: רשימה של כרטיסים, אחד לכל סדרה.
// משתמשים בו ב: HomePage.
// למה צריך key: לפי ה-key, ‏React יודע איזה פריט נוסף, נמחק או זז. key לפי המיקום ברשימה (index) יכול לבלבל אותו כשהרשימה מסוננת, ולכן ה-key כאן הוא המזהה של הסדרה.
// ─────────────────────────────────────────────

// הטיפוס של סדרה
import type { Show } from '../types/tvmaze'
// הכרטיס של סדרה אחת
import ShowCard from './ShowCard'
// העיצוב של הרשת
import './ShowList.css'

// ה-props: מערך של סדרות
type ShowListProps = {
  shows: Show[]
}

// הקיר: רשימה של כרטיסים
export default function ShowList({ shows }: ShowListProps) {
  // מה שהרכיב מציג
  return (
    // ul: רשימה, כי זה באמת רשימה של סדרות
    <ul className="show-list">
      {/* map: לכל סדרה במערך יוצרים li עם כרטיס */}
      {shows.map((show) => (
        // key: מזהה ייחודי לכל פריט, כדי ש-React ידע איזה פריט השתנה. המזהה של הסדרה לא חוזר על עצמו
        <li key={show.id}>
          {/* מעבירים לכרטיס את הסדרה ב-props */}
          <ShowCard show={show} />
        </li>
      ))}
    </ul>
  )
}
