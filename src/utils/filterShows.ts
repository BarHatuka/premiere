import type { Show } from '../types/tvmaze'

export type ShowFilters = {
  query: string
  genre: string | null // null = כל הז'אנרים
}

export function filterShows<T extends Show>(shows: T[], { query, genre }: ShowFilters): T[] {
  const search = normalize(query)

  return shows.filter((show) => {
    const matchesName = normalize(show.name).includes(search)
    const matchesGenre = genre === null || show.genres.includes(genre)
    return matchesName && matchesGenre
  })
}

// " Pokémon" → "pokemon", כך ש-"cafe" מוצא גם את "Café"
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export type GenreCount = { name: string; count: number }

// כמה סדרות יש בכל ז'אנר: [{ name: 'Drama', count: 140 }, ...], מהנפוץ לנדיר.
export function countGenres(shows: Show[]): GenreCount[] {
  const counts: Record<string, number> = {}
  for (const show of shows) {
    for (const genre of show.genres) {
      counts[genre] = (counts[genre] ?? 0) + 1
    }
  }

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

// ההודעה כשאין תוצאות. total = כמה סדרות נטענו (החיפוש לא עובר על כל הקטלוג, ראו "Not now" ב-PRD).
export function describeNoResults({ query, genre }: ShowFilters, total: number): string {
  const search = query.trim()

  // השמות ב-TVmaze באנגלית, אז חיפוש בעברית לא ימצא כלום
  if (/[א-ת]/.test(search)) {
    return `שמות הסדרות כאן באנגלית, כמו בשידור המקורי. נסו לכתוב את "${search}" באנגלית.`
  }
  if (search) {
    const inGenre = genre === null ? '' : " בז'אנר הזה"
    return `לא מצאנו סדרה עם "${search}" בשם${inGenre}. החיפוש עובר על ${total} הסדרות שבאתר, לא על כל TVmaze.`
  }
  return 'אין כאן סדרות שמתאימות לסינון שבחרתם.'
}
