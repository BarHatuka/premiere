import { Link } from 'react-router'
import './NotFoundPage.css'

// מופיע בכל כתובת שאין לה עמוד, וגם כשמבקשים סדרה שלא קיימת.
export default function NotFoundPage() {
  return (
    <section className="not-found">
      <title>העמוד לא נמצא | פרמיירה</title>
      <span className="not-found__frame" aria-hidden="true" />
      <h1 className="page-title">העמוד הזה לא בתוכנית</h1>
      <p>אולי הקישור השתנה, ואולי הסדרה ירדה מהלוח.</p>
      <Link to="/" className="button">
        חזרה לכל הסדרות
      </Link>
    </section>
  )
}
