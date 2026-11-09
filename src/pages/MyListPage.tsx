// Link: קישור פנימי לקיר, כשהרשימה ריקה
import { Link } from 'react-router'
// אותו כרטיס כמו בקיר
import ShowCard from '../components/ShowCard'
// "הרשימה שלי" מה-Context
import { useMyList } from '../hooks/useMyList'
// העיצוב של העמוד
import './MyListPage.css'

// העמוד /my-list: הסדרות ששמרתי
export default function MyListPage() {
  // הרשימה והפונקציות שלה
  const myList = useMyList()

  // מה שהעמוד מציג
  return (
    <section className="my-list" aria-labelledby="my-list-title">
      {/* הכותרת של הלשונית בדפדפן. React 19 מעביר את התגית הזאת ל-head לבד */}
      <title>הרשימה שלי | פרמיירה</title>
      {/* הכותרת של העמוד */}
      <h1 id="my-list-title" className="page-title">
        הרשימה שלי
      </h1>

      {/* הרשימה ריקה? הסבר וקישור לקיר. יש סדרות? מציגים אותן */}
      {myList.shows.length === 0 ? (
        <div className="my-list__empty">
          {/* ההסבר */}
          <p>הרשימה שלך עוד ריקה. מצאתם סדרה שבא לכם לראות? פתחו אותה ולחצו "שמירה לרשימה שלי".</p>
          {/* קישור לקיר */}
          <Link to="/" className="button">
            לכל הסדרות
          </Link>
        </div>
      ) : (
        // Fragment: שני אלמנטים בלי עטיפה נוספת
        <>
          {/* כמה סדרות שמורות, ביחיד או ברבים */}
          <p className="my-list__count">
            {myList.shows.length === 1 ? 'סדרה אחת שמורה' : `${myList.shows.length} סדרות שמורות`}, לפי סדר השמירה.
          </p>
          {/* רשת הכרטיסים */}
          <ul className="my-list__grid">
            {/* כרטיס וכפתור הסרה לכל סדרה. key: המזהה של הסדרה */}
            {myList.shows.map((show) => (
              <li key={show.id}>
                {/* הכרטיס, עם קישור לעמוד הסדרה */}
                <ShowCard show={show} />
                {/* כפתור ההסרה */}
                <button
                  // לא שולח טופס
                  type="button"
                  // class לעיצוב
                  className="my-list__remove"
                  // קורא מסך שומע גם את שם הסדרה, ולא רק "הסרה"
                  aria-label={`הסרת ${show.name} מהרשימה`}
                  // toggle על סדרה שמורה מסיר אותה
                  onClick={() => myList.toggle(show)}
                >
                  הסרה
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
