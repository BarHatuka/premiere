import { Link } from 'react-router'
import ShowCard from '../components/ShowCard'
import { useMyList } from '../hooks/useMyList'
import './MyListPage.css'

export default function MyListPage() {
  const myList = useMyList()

  return (
    <section className="my-list" aria-labelledby="my-list-title">
      <title>הרשימה שלי | פרמיירה</title>
      <h1 id="my-list-title" className="page-title">
        הרשימה שלי
      </h1>

      {myList.shows.length === 0 ? (
        <div className="my-list__empty">
          <p>הרשימה שלך עוד ריקה. מצאתם סדרה שבא לכם לראות? פתחו אותה ולחצו "שמירה לרשימה שלי".</p>
          <Link to="/" className="button">
            לכל הסדרות
          </Link>
        </div>
      ) : (
        <>
          <p className="my-list__count">
            {myList.shows.length === 1 ? 'סדרה אחת שמורה' : `${myList.shows.length} סדרות שמורות`}, לפי סדר השמירה.
          </p>
          <ul className="my-list__grid">
            {myList.shows.map((show) => (
              <li key={show.id}>
                <ShowCard show={show} />
                <button
                  type="button"
                  className="my-list__remove"
                  aria-label={`הסרת ${show.name} מהרשימה`}
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
