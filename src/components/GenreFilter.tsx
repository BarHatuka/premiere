import type { GenreCount } from '../utils/filterShows'
import { genreLabel } from '../utils/labels'
import './GenreFilter.css'

type GenreFilterProps = {
  genres: GenreCount[]
  selected: string | null // null = "הכול"
  total: number
  onSelect: (genre: string | null) => void
}

export default function GenreFilter({ genres, selected, total, onSelect }: GenreFilterProps) {
  return (
    <div className="genre-filter" role="group" aria-label="סינון לפי ז'אנר">
      <button type="button" className="genre-filter__option" aria-pressed={selected === null} onClick={() => onSelect(null)}>
        הכול <span className="genre-filter__count">{total}</span>
      </button>

      {genres.map((genre) => (
        <button
          key={genre.name}
          type="button"
          className="genre-filter__option"
          aria-pressed={selected === genre.name}
          // לחיצה על הז'אנר שכבר נבחר מחזירה ל"הכול"
          onClick={() => onSelect(selected === genre.name ? null : genre.name)}
        >
          {genreLabel(genre.name)} <span className="genre-filter__count">{genre.count}</span>
        </button>
      ))}
    </div>
  )
}
