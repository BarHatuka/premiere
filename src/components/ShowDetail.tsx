// Link: קישור פנימי, בשביל הז'אנרים
import { Link } from 'react-router'
// הטיפוס של סדרה עם השחקנים
import type { ShowWithCast } from '../types/tvmaze'
// פונקציות שמנסחות טקסט לתצוגה
import { describeBroadcast, formatRating, formatRuntime, htmlToText } from '../utils/format'
// תרגום ז'אנרים ושפות לעברית
import { genreLabel, languageLabel } from '../utils/labels'
// הרכיבים שהעמוד מורכב מהם
import CastList from './CastList'
import Icon from './Icon'
import Poster from './Poster'
import SaveButton from './SaveButton'
// העיצוב של עמוד הסדרה
import './ShowDetail.css'

// ה-props: הסדרה, כפי ש-ShowPage טען אותה
type ShowDetailProps = {
  show: ShowWithCast
}

// התצוגה של עמוד סדרה. הרכיב לא טוען מידע, רק מציג את מה שקיבל ב-props
export default function ShowDetail({ show }: ShowDetailProps) {
  // הדירוג כטקסט, או null
  const rating = formatRating(show.rating.average)
  // אורך פרק כטקסט, למשל "כ-60 דקות", או null
  const runtime = formatRuntime(show)

  // מה שהרכיב מציג
  return (
    // article: יחידת תוכן שלמה, עמוד של סדרה אחת
    <article className="show-detail">
      {/* הצד של הפוסטר */}
      <div className="show-detail__poster">
        {/* יש תמונה? מציגים את הגדולה (original). אין? מציגים את השם */}
        {show.image ? (
          // כאן alt מלא, כי זו התמונה הראשית של העמוד
          <Poster src={show.image.original} alt={`הפוסטר של ${show.name}`} fallbackText={show.name} />
        ) : (
          // אין תמונה: מלבן עם שם הסדרה
          <span className="poster poster--missing" dir="ltr">
            {show.name}
          </span>
        )}
      </div>

      {/* הצד של הפרטים */}
      <div className="show-detail__info">
        {/* שם הסדרה, הכותרת הראשית של העמוד */}
        <h1 className="show-detail__name" dir="ltr">
          {show.name}
        </h1>

        {/* הדירוג */}
        <p className="show-detail__rating">
          {/* יש דירוג: כוכב, מספר והסבר. אין: משפט במקום */}
          {rating ? (
            // Fragment: כמה אלמנטים בלי עטיפה נוספת
            <>
              <Icon name="star" filled />
              <span className="show-detail__rating-value">{rating}</span>
              <span className="show-detail__rating-label">מתוך 10, לפי צופי TVmaze</span>
            </>
          ) : (
            // אין דירוג
            <span className="show-detail__rating-label">עוד אין דירוג צופים</span>
          )}
        </p>

        {/* משפט על השידור, למשל "שודרה בין 2011 ל-2016 ב-CBS" */}
        <p className="show-detail__broadcast">{describeBroadcast(show)}</p>

        {/* dl: רשימת הגדרות. dt הוא השם, ו-dd הוא הערך */}
        <dl className="show-detail__facts">
          {/* ז'אנרים, רק אם יש */}
          {show.genres.length > 0 && (
            <>
              <dt>ז'אנר</dt>
             <dd className="show-detail__genres">
                {/* כל ז'אנר הוא קישור לקיר מסונן לפי אותו ז'אנר */}
                {show.genres.map((genre) => (
                  // encodeURIComponent: תווים מיוחדים בשם לא ישברו את הכתובת. key: שם הז'אנר
                  <Link key={genre} to={`/?genre=${encodeURIComponent(genre)}`}>
                    {/* השם בעברית, למשל Crime יוצג "פשע" */}
                    {genreLabel(genre)}
                  </Link>
                ))}
              </dd>
            </>
          )}
          {/* אורך פרק, רק אם ידוע */}
          {runtime && (
            <>
              <dt>אורך פרק</dt>
              <dd>{runtime}</dd>
            </>
          )}
          {/* שפה, רק אם ידועה */}
          {show.language && (
            <>
              <dt>שפה</dt>
              <dd>{languageLabel(show.language)}</dd>
            </>
          )}
        </dl>

        {/* התקציר, רק אם יש. TVmaze שולח HTML, ו-htmlToText הופך אותו לטקסט רגיל */}
        {show.summary && (
          <p className="show-detail__summary" dir="ltr" lang="en">
            {htmlToText(show.summary)}
          </p>
        )}

        {/* כפתור השמירה והקישורים */}
        <div className="show-detail__actions">
          {/* שמירה לרשימה שלי */}
          <SaveButton show={show} />
          {/* קישורים חיצוניים. target="_blank": בלשונית חדשה. rel="noreferrer": בלי לחשוף את האתר שלנו לאתר שנפתח */}
          <p className="show-detail__links">
            <a href={show.url} target="_blank" rel="noreferrer">
              לעמוד הסדרה ב-TVmaze
              <Icon name="external" />
            </a>
            {/* האתר הרשמי, רק אם יש */}
            {show.officialSite && (
              <a href={show.officialSite} target="_blank" rel="noreferrer">
                לאתר הרשמי
                <Icon name="external" />
              </a>
            )}
          </p>
        </div>

        {/* רשימת השחקנים. TVmaze שם אותם ב-_embedded.cast */}
        <CastList cast={show._embedded.cast} />
      </div>
    </article>
  )
}
