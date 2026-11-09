// ─────────────────────────────────────────────
// תרגום לעברית של ז'אנרים, ימים ושפות שמגיעים מ-TVmaze באנגלית.
// משתמשים בו ב: GenreFilter, ‏ShowDetail, ‏format.ts.
// ─────────────────────────────────────────────

// ז'אנרים, ימים ושפות מגיעים מה-API באנגלית. מה שלא מופיע כאן מוצג כמו שהוא.
// מילון ז'אנרים: השם באנגלית מ-TVmaze ← השם בעברית. Record<string, string>: מפתח טקסט וערך טקסט
const GENRE_LABELS: Record<string, string> = {
  Action: 'אקשן',
  Adult: 'מבוגרים',
  Adventure: 'הרפתקאות',
  Anime: 'אנימה',
  Children: 'ילדים',
  Comedy: 'קומדיה',
  Crime: 'פשע',
  DIY: 'עשו זאת בעצמכם',
  Drama: 'דרמה',
  Espionage: 'ריגול',
  Family: 'משפחה',
  Fantasy: 'פנטזיה',
  Food: 'אוכל',
  History: 'היסטוריה',
  Horror: 'אימה',
  Legal: 'משפט',
  Medical: 'רפואה',
  Music: 'מוזיקה',
  Mystery: 'מסתורין',
  Nature: 'טבע',
  Romance: 'רומנטיקה',
  'Science-Fiction': 'מדע בדיוני',
  Sports: 'ספורט',
  Supernatural: 'על-טבעי',
  Thriller: 'מתח',
  Travel: 'טיולים',
  War: 'מלחמה',
  Western: 'מערבון',
}

// מילון ימים: השם באנגלית ← השם בעברית
const DAY_LABELS: Record<string, string> = {
  Sunday: 'ראשון',
  Monday: 'שני',
  Tuesday: 'שלישי',
  Wednesday: 'רביעי',
  Thursday: 'חמישי',
  Friday: 'שישי',
  Saturday: 'שבת',
}

// מילון שפות: השם באנגלית ← השם בעברית
const LANGUAGE_LABELS: Record<string, string> = {
  Arabic: 'ערבית',
  Chinese: 'סינית',
  Danish: 'דנית',
  Dutch: 'הולנדית',
  English: 'אנגלית',
  French: 'צרפתית',
  German: 'גרמנית',
  Hebrew: 'עברית',
  Hindi: 'הינדית',
  Italian: 'איטלקית',
  Japanese: 'יפנית',
  Korean: 'קוריאנית',
  Norwegian: 'נורווגית',
  Portuguese: 'פורטוגזית',
  Russian: 'רוסית',
  Spanish: 'ספרדית',
  Swedish: 'שוודית',
  Turkish: 'טורקית',
}

// מחזירה את שם הז'אנר בעברית
export function genreLabel(genre: string): string {
  // ?? genre: אם הז'אנר לא במילון, מחזירים אותו כמו שהוא, באנגלית
  return GENRE_LABELS[genre] ?? genre
}

// מחזירה את שם היום בעברית
export function dayLabel(day: string): string {
  // יום שלא במילון חוזר כמו שהוא
  return DAY_LABELS[day] ?? day
}

// מחזירה את שם השפה בעברית
export function languageLabel(language: string): string {
  // שפה שלא במילון חוזרת כמו שהיא
  return LANGUAGE_LABELS[language] ?? language
}
