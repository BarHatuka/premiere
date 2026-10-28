// ז'אנרים, ימים ושפות מגיעים מה-API באנגלית. מה שלא מופיע כאן מוצג כמו שהוא.
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

const DAY_LABELS: Record<string, string> = {
  Sunday: 'ראשון',
  Monday: 'שני',
  Tuesday: 'שלישי',
  Wednesday: 'רביעי',
  Thursday: 'חמישי',
  Friday: 'שישי',
  Saturday: 'שבת',
}

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

export function genreLabel(genre: string): string {
  return GENRE_LABELS[genre] ?? genre
}

export function dayLabel(day: string): string {
  return DAY_LABELS[day] ?? day
}

export function languageLabel(language: string): string {
  return LANGUAGE_LABELS[language] ?? language
}
