import type { ShowWithCast } from '../types/tvmaze'
import { describeBroadcast, formatList, formatRating, formatRuntime, htmlToText } from '../utils/format'
import { genreLabel, languageLabel } from '../utils/labels'
import CastList from './CastList'
import Icon from './Icon'
import Poster from './Poster'
import SaveButton from './SaveButton'
import './ShowDetail.css'

type ShowDetailProps = {
  show: ShowWithCast
}

export default function ShowDetail({ show }: ShowDetailProps) {
  const rating = formatRating(show.rating.average)
  const runtime = formatRuntime(show)

  return (
    <article className="show-detail">
      <div className="show-detail__poster">
        {show.image ? (
          <Poster src={show.image.original} alt={`הפוסטר של ${show.name}`} fallbackText={show.name} />
        ) : (
          <span className="poster poster--missing" dir="ltr">
            {show.name}
          </span>
        )}
      </div>

      <div className="show-detail__info">
        <h1 className="show-detail__name" dir="ltr">
          {show.name}
        </h1>

        <p className="show-detail__rating">
          {rating ? (
            <>
              <Icon name="star" filled />
              <span className="show-detail__rating-value">{rating}</span>
              <span className="show-detail__rating-label">מתוך 10, לפי צופי TVmaze</span>
            </>
          ) : (
            <span className="show-detail__rating-label">עוד אין דירוג צופים</span>
          )}
        </p>

        <p className="show-detail__broadcast">{describeBroadcast(show)}</p>

        <dl className="show-detail__facts">
          {show.genres.length > 0 && (
            <>
              <dt>ז'אנר</dt>
              <dd>{formatList(show.genres.map(genreLabel))}</dd>
            </>
          )}
          {runtime && (
            <>
              <dt>אורך פרק</dt>
              <dd>{runtime}</dd>
            </>
          )}
          {show.language && (
            <>
              <dt>שפה</dt>
              <dd>{languageLabel(show.language)}</dd>
            </>
          )}
        </dl>

        {show.summary && (
          <p className="show-detail__summary" dir="ltr" lang="en">
            {htmlToText(show.summary)}
          </p>
        )}

        <div className="show-detail__actions">
          <SaveButton show={show} />
          <p className="show-detail__links">
            <a href={show.url} target="_blank" rel="noreferrer">
              לעמוד הסדרה ב-TVmaze
              <Icon name="external" />
            </a>
            {show.officialSite && (
              <a href={show.officialSite} target="_blank" rel="noreferrer">
                לאתר הרשמי
                <Icon name="external" />
              </a>
            )}
          </p>
        </div>

        <CastList cast={show._embedded.cast} />
      </div>
    </article>
  )
}
