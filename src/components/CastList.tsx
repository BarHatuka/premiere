import type { CastMember } from '../types/tvmaze'
import './CastList.css'

type CastListProps = {
  cast: CastMember[]
}

// TVmaze מחזיר את השחקנים לפי החשיבות שלהם בסדרה, אז מציגים את הראשונים.
const MAX_CAST = 8

export default function CastList({ cast }: CastListProps) {
  if (cast.length === 0) return null

  return (
    <section className="cast" aria-labelledby="cast-title">
      <h2 id="cast-title">שחקנים</h2>
      <ul className="cast__list">
        {/* אותו שחקן יכול לשחק כמה דמויות, ולכן ה-key משלב שחקן ודמות */}
        {cast.slice(0, MAX_CAST).map(({ person, character }) => (
          <li key={`${person.id}-${character.id}`}>
            <span className="cast__person" dir="ltr">
              {person.name}
            </span>
            <span className="cast__character">
              בתפקיד <span dir="ltr">{character.name}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
