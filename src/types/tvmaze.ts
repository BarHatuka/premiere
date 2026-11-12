// ─────────────────────────────────────────────
// הטיפוסים של המידע מ-TVmaze. TypeScript בודק לפיהם כל שימוש בשדה.
// משתמשים בו כמעט בכל קובץ.
// מה TypeScript נותן כאן: טעות בשם של שדה (למשל show.raiting) נתפסת עוד לפני שהקוד רץ, ב-npm run build.
// ─────────────────────────────────────────────

// רק השדות מ-TVmaze שהאפליקציה משתמשת בהם. ה-API שולח הרבה יותר.

// מה שכרטיס בקיר צריך
export type Show = {
  // המזהה של הסדרה ב-TVmaze. הוא מופיע בכתובת /shows/:id
  id: number
  // שם הסדרה, באנגלית
  name: string
  // רשימת ז'אנרים, למשל ["Drama", "Crime"]
  genres: string[]
  premiered: string | null // "2011-09-22", או null לסדרה שעוד לא עלתה
  rating: { average: number | null } // null כשאין מספיק מדרגים
  image: { medium: string; original: string } | null // יש סדרות בלי פוסטר
}

// רשת טלוויזיה (CBS) או שירות סטרימינג (Netflix)
export type Channel = {
  // השם של הרשת
  name: string
}

// מה שעמוד של סדרה צריך: כל שדות הכרטיס, ועוד
// &: טיפוס שמחבר את כל השדות של Show עם השדות שכאן
export type ShowDetails = Show & {
  status: string // "Running", "Ended" ועוד
  // תאריך הסיום, או null לסדרה שעדיין משודרת
  ended: string | null
  network: Channel | null // לסדרות סטרימינג אין network, יש webChannel
  // שירות הסטרימינג, אם יש
  webChannel: Channel | null
  // שעת השידור וימי השידור, למשל { time: "21:00", days: ["Thursday"] }
  schedule: { time: string; days: string[] }
  // אורך פרק בדקות. לפעמים חסר, ואז משתמשים ב-averageRuntime
  runtime: number | null
  // אורך פרק ממוצע בדקות
  averageRuntime: number | null
  // שפת הסדרה, למשל "English"
  language: string | null
  summary: string | null // HTML, למשל "<p><b>Glee</b> is…</p>"
  // הקישור לעמוד של הסדרה ב-TVmaze
  url: string
  // האתר הרשמי של הסדרה, אם יש
  officialSite: string | null
}

// שחקן אחד ברשימת השחקנים: מי השחקן, ואת מי הוא משחק
export type CastMember = {
  // השחקן
  person: { id: number; name: string }
  // הדמות שהוא משחק
  character: { id: number; name: string }
}

// התשובה של /shows/:id?embed=cast: הסדרה, והשחקנים בתוך _embedded
export type ShowWithCast = ShowDetails & {
  // TVmaze שם את השחקנים בתוך השדה _embedded
  _embedded: { cast: CastMember[] }
}

// שידור אחד בלוח: פרק של סדרה, מתי הוא עולה, ובאיזו רשת
export type ScheduleEntry = {
  // המזהה של הפרק
  id: number
  name: string // שם הפרק
  // מספר העונה
  season: number
  number: number | null // null לפרק מיוחד
  airdate: string // "2026-10-17"
  airtime: string // "20:00", לפי שעון הרשת. לפעמים ריק
  // הסדרה שהפרק שייך לה, יחד עם הרשת שלה
  show: Show & { network: Channel | null }
}
