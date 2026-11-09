// Link: הכרטיס כולו הוא קישור לעמוד של הסדרה
import { Link } from 'react-router'
// בשביל לבדוק אם הסדרה שמורה
import { useMyList } from '../hooks/useMyList'
// הטיפוס של סדרה
import type { Show } from '../types/tvmaze'
// פונקציות שמעצבות את הדירוג ואת השנה לתצוגה
import { formatRating, getYear } from '../utils/format'
// אייקונים: לב וכוכב
import Icon from './Icon'
// התמונה, עם טיפול בתמונה שלא נטענת
import Poster from './Poster'
// העיצוב של הכרטיס
import './ShowCard.css'

// ה-props של הכרטיס: סדרה אחת
type ShowCardProps = {
  show: Show
}

// כרטיס של סדרה אחת בקיר: פוסטר, שם, שנה ודירוג
export default function ShowCard({ show }: ShowCardProps) {
  // הדירוג כטקסט, למשל "8.8", או null אם אין דירוג
  const rating = formatRating(show.rating.average)
  // האם הסדרה ב"רשימה שלי"
  const saved = useMyList().isSaved(show.id)

  // מה שהרכיב מציג
  return (
    // קישור לכתובת של הסדרה, למשל /shows/2
    <Link to={`/shows/${show.id}`} className="show-card">
      {/* המסגרת של הפוסטר */}
      <span className="show-card__frame">
        {/* alt ריק: השם כתוב מתחת לפוסטר, וקורא מסך לא צריך לשמוע אותו פעמיים */}
        {show.image ? (
          // יש תמונה: מציגים אותה, ואם היא לא נטענת, את השם
          <Poster src={show.image.medium} alt="" fallbackText={show.name} />
        ) : (
          // אין תמונה בכלל: מציגים את השם במקום
          <span className="poster poster--missing" aria-hidden="true">
            <span dir="ltr">{show.name}</span>
          </span>
        )}
        {/* && מציג את הלב רק אם saved הוא true */}
        {saved && (
          <span className="show-card__saved">
            {/* לב מלא */}
            <Icon name="heart" filled />
            {/* טקסט שרק קורא מסך שומע */}
            <span className="visually-hidden">ברשימה שלי</span>
          </span>
        )}
      </span>

      {/* שם הסדרה. dir="ltr" כי השם באנגלית */}
      <span className="show-card__name" dir="ltr">
        {show.name}
      </span>

      {/* השורה שמתחת לשם: שנה ודירוג */}
      <span className="show-card__meta">
        {/* שנת העלייה לאוויר */}
        <span>{getYear(show.premiered)}</span>
        {/* הדירוג, רק אם יש */}
        {rating && (
          <span className="show-card__rating">
            {/* המילה "דירוג" בשביל קורא מסך */}
            <span className="visually-hidden">דירוג </span>
            {/* כוכב */}
            <Icon name="star" filled />
            {rating}
          </span>
        )}
      </span>
    </Link>
  )
}
