// ─────────────────────────────────────────────
// שורת הכפתורים של הז'אנרים בקיר.
// משתמשים בו ב: HomePage.
// הז'אנר הנבחר לא נשמר כאן. הוא נמצא בכתובת (?genre=...). הרכיב מקבל אותו ב-props, ומדווח על לחיצה עם onSelect. הכלל: ה-state למעלה, וה-props יורדים למטה.
// ─────────────────────────────────────────────

// הטיפוס של ז'אנר עם מספר הסדרות בו
import type { GenreCount } from '../utils/filterShows'
// מתרגם את שם הז'אנר לעברית
import { genreLabel } from '../utils/labels'
// העיצוב של הכפתורים
import './GenreFilter.css'

// ה-props: הרכיב לא מחזיק state משלו. הוא מקבל הכול מ-HomePage ומדווח לו על לחיצה
type GenreFilterProps = {
  // רשימת הז'אנרים והכמות בכל אחד
  genres: GenreCount[]
  selected: string | null // null = "הכול"
  // כמה סדרות יש בסך הכול, בשביל הכפתור "הכול"
  total: number
  // פונקציה ש-HomePage מעביר. הרכיב קורא לה כשלוחצים על ז'אנר
  onSelect: (genre: string | null) => void
}

// שורת הכפתורים של הז'אנרים
export default function GenreFilter({ genres, selected, total, onSelect }: GenreFilterProps) {
  // מה שהרכיב מציג
  return (
    // role="group" ו-aria-label: קורא מסך מבין שזו קבוצת כפתורים של סינון
    <div className="genre-filter" role="group" aria-label="סינון לפי ז'אנר">
      {/* הכפתור "הכול". aria-pressed אומר אם הוא הנבחר. לחיצה שולחת null */}
      <button type="button" className="genre-filter__option" aria-pressed={selected === null} onClick={() => onSelect(null)}>
        הכול <span className="genre-filter__count">{total}</span>
      </button>

      {/* כפתור לכל ז'אנר */}
      {genres.map((genre) => (
        // כפתור אחד לז'אנר. כל ה-props שלו מוסברים בשורות שמתחת
        <button
          // key: שם הז'אנר, שלא חוזר פעמיים
          key={genre.name}
          // type="button": לא שולח טופס
          type="button"
          // class לעיצוב
          className="genre-filter__option"
          // מסומן אם זה הז'אנר הנבחר. ה-CSS צובע לפי זה
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
