import { useSearchParams } from 'react-router'
import { SHOWS_URL } from '../api/tvmaze'
import GenreFilter from '../components/GenreFilter'
import SearchBox from '../components/SearchBox'
import ShowList from '../components/ShowList'
import StatusMessage from '../components/StatusMessage'
import { useFetch } from '../hooks/useFetch'
import type { Show } from '../types/tvmaze'
import { countGenres, describeNoResults, filterShows } from '../utils/filterShows'
import { wallOrder } from '../utils/shows'
import './HomePage.css'

export default function HomePage() {
  const { state, retry } = useFetch<Show[]>(SHOWS_URL)

  // החיפוש והז'אנר נשמרים בכתובת (/?genre=Comedy&q=new) ולא ב-useState:
  // כך "אחורה" מעמוד של סדרה מחזיר לאותו קיר מסונן, ואפשר לשלוח קישור לחבר.
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const genre = searchParams.get('genre')

  // משנה פרמטר אחד בכתובת ומשאיר את השאר. ערך ריק מוחק את הפרמטר.
  // replace: הקלדה לא יוצרת רשומה חדשה בהיסטוריה על כל אות.
  function updateParam(name: 'q' | 'genre', value: string | null) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value) next.set(name, value)
        else next.delete(name)
        return next
      },
      { replace: true },
    )
  }

  if (state.status === 'loading') return <StatusMessage type="loading" text="טוענים את הסדרות…" posters />
  if (state.status === 'error') {
    return <StatusMessage type="error" title="לא הצלחנו לטעון את הסדרות" details={state.message} onRetry={retry} />
  }

  // ערכים שמחושבים מהמידע ומהכתובת בכל רינדור — לא שומרים אותם ב-state נוסף.
  const wall = wallOrder(state.data)
  const visible = filterShows(wall, { query, genre })
  const countText =
    visible.length === 1 ? `מוצגת סדרה אחת מתוך ${wall.length}` : `מוצגות ${visible.length} מתוך ${wall.length} סדרות`

  return (
    <section className="home" aria-labelledby="home-title">
      <h1 id="home-title" className="visually-hidden">
        כל הסדרות
      </h1>

      <div className="home__toolbar">
        <SearchBox value={query} onChange={(value) => updateParam('q', value)} />
        <GenreFilter
          genres={countGenres(wall)}
          selected={genre}
          total={wall.length}
          onSelect={(value) => updateParam('genre', value)}
        />
        <p className="home__count" aria-live="polite">
          {countText}
          {visible.length > 1 && ', מהמדורגת ביותר ומטה'}
        </p>
      </div>

      {visible.length > 0 ? (
        <ShowList shows={visible} />
      ) : (
        <div className="home__empty">
          <p>{describeNoResults({ query, genre }, wall.length)}</p>
          {/* מחיקת כל הפרמטרים מהכתובת = הקיר המלא */}
          <button type="button" className="button" onClick={() => setSearchParams({}, { replace: true })}>
            הצגת כל הסדרות
          </button>
        </div>
      )}
    </section>
  )
}
