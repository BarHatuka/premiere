import { Link } from 'react-router'
import { useMyList } from '../hooks/useMyList'
import type { Show } from '../types/tvmaze'
import { formatRating, getYear } from '../utils/format'
import Icon from './Icon'
import Poster from './Poster'
import './ShowCard.css'

type ShowCardProps = {
  show: Show
}

export default function ShowCard({ show }: ShowCardProps) {
  const rating = formatRating(show.rating.average)
  const saved = useMyList().isSaved(show.id)

  return (
    <Link to={`/shows/${show.id}`} className="show-card">
      <span className="show-card__frame">
        {/* alt ריק: השם כתוב מתחת לפוסטר, וקורא מסך לא צריך לשמוע אותו פעמיים */}
        {show.image ? (
          <Poster src={show.image.medium} alt="" fallbackText={show.name} />
        ) : (
          <span className="poster poster--missing" aria-hidden="true">
            <span dir="ltr">{show.name}</span>
          </span>
        )}
        {saved && (
          <span className="show-card__saved">
            <Icon name="heart" filled />
            <span className="visually-hidden">ברשימה שלי</span>
          </span>
        )}
      </span>

      <span className="show-card__name" dir="ltr">
        {show.name}
      </span>

      <span className="show-card__meta">
        <span>{getYear(show.premiered)}</span>
        {rating && (
          <span className="show-card__rating">
            <span className="visually-hidden">דירוג </span>
            <Icon name="star" filled />
            {rating}
          </span>
        )}
      </span>
    </Link>
  )
}
