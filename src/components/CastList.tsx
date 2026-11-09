// ─────────────────────────────────────────────
// רשימת השחקנים בעמוד הסדרה, עד 8 שחקנים.
// משתמשים בו ב: ShowDetail.
// אם המרצה מבקש "תציג 12 שחקנים": משנים את MAX_CAST. זה המקום היחיד.
// ─────────────────────────────────────────────

// הטיפוס של שחקן ברשימה
import type { CastMember } from '../types/tvmaze'
// העיצוב של הרשימה
import './CastList.css'

// ה-props: מערך השחקנים
type CastListProps = {
  cast: CastMember[]
}

// TVmaze מחזיר את השחקנים לפי החשיבות שלהם בסדרה, אז מציגים את הראשונים.
// קבוע אחד, ואם רוצים להציג יותר שחקנים משנים רק אותו
const MAX_CAST = 8

// רשימת השחקנים בעמוד הסדרה
export default function CastList({ cast }: CastListProps) {
  // אין שחקנים: לא מציגים כלום (null), אפילו לא את הכותרת
  if (cast.length === 0) return null

  // מה שהרכיב מציג
  return (
    // section עם שם לקורא מסך: aria-labelledby מצביע על הכותרת שלמטה
    <section className="cast" aria-labelledby="cast-title">
      {/* הכותרת. ה-id שלה הוא השם של ה-section */}
      <h2 id="cast-title">שחקנים</h2>
      {/* הרשימה עצמה */}
      <ul className="cast__list">
        {/* אותו שחקן יכול לשחק כמה דמויות, ולכן ה-key משלב שחקן ודמות */}
        {/* slice(0, MAX_CAST): רק 8 הראשונים. map: פריט לכל שחקן. ({ person, character }) מפרק את האובייקט */}
        {cast.slice(0, MAX_CAST).map(({ person, character }) => (
          // key: מזהה השחקן ומזהה הדמות ביחד, כי שחקן יכול לשחק כמה דמויות
          <li key={`${person.id}-${character.id}`}>
            {/* שם השחקן, באנגלית */}
            <span className="cast__person" dir="ltr">
              {person.name}
            </span>
            {/* שם הדמות */}
            <span className="cast__character">
              בתפקיד <span dir="ltr">{character.name}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
