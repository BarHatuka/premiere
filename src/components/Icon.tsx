// ─────────────────────────────────────────────
// כל האייקונים של האתר, כ-SVG בתוך הקוד, בלי ספרייה חיצונית.
// משתמשים בו ב: ShowCard, ‏ShowDetail, ‏BackLink, ‏SearchBox, ‏SaveButton.
// ─────────────────────────────────────────────

// ReactNode: כל דבר ש-React יודע לצייר
import type { ReactNode } from 'react'

// הצורות של האייקונים, בפורמט SVG. כל שם מקבל ציור משלו
const SHAPES = {
  // זכוכית מגדלת: עיגול וקו
  search: (
    // <> ... </> (Fragment): עוטף כמה אלמנטים בלי להוסיף אלמנט לדף
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  // איקס, לניקוי החיפוש
  close: <path d="M6 6l12 12M18 6 6 18" />,
  // חץ חזרה
  back: <path d="M9 5.5l6.5 6.5L9 18.5" />,
  // קישור חיצוני: ריבוע עם חץ
  external: (
    <>
      <path d="M14 4.5h5.5V10" />
      <path d="M19.5 4.5 11 13" />
      <path d="M17.5 14v4.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1H10" />
    </>
  ),
  // לב
  heart: <path d="M12 19.5s-7.5-4.6-7.5-10.2A4.1 4.1 0 0 1 12 7a4.1 4.1 0 0 1 7.5 2.3c0 5.6-7.5 10.2-7.5 10.2z" />,
  // כוכב
  star: <path d="m12 3.8 2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z" />,
  // satisfies: TypeScript בודק שכל אייקון הוא משהו ש-React יודע לצייר (ReactNode), וגם זוכר את השמות של האייקונים
} satisfies Record<string, ReactNode>

// keyof typeof SHAPES: רק אחד מהשמות שברשימה למעלה ('search', 'close' וכו'). שם אחר נותן שגיאה ב-build
export type IconName = keyof typeof SHAPES

// ה-props של האייקון
type IconProps = {
  // איזה אייקון
  name: IconName
  // ? אומר שהשדה לא חובה. מלא או קו מתאר בלבד
  filled?: boolean
}

// מציג אייקון לפי השם. filled = false: ערך ברירת מחדל
export default function Icon({ name, filled = false }: IconProps) {
  // מה שהרכיב מציג
  return (
    // תגית svg. כל מאפיין מוסבר בשורה שמעליו
    <svg
      // class לעיצוב
      className="icon"
      // מערכת הצירים של הציור: 24 על 24
      viewBox="0 0 24 24"
      // 1em: האייקון בגודל הטקסט שלידו
      width="1em"
      height="1em"
      // currentColor: צבע הטקסט. מלא רק אם filled
      fill={filled ? 'currentColor' : 'none'}
      // צבע הקו
      stroke="currentColor"
      // עובי הקו
      strokeWidth="1.6"
      // קצוות וחיבורים מעוגלים
      strokeLinecap="round"
      strokeLinejoin="round"
      // האייקון לקישוט בלבד: קורא מסך מתעלם ממנו
      aria-hidden="true"
      // לא מקבל פוקוס במקלדת
      focusable="false"
    >
      {/* הציור של האייקון שנבחר */}
      {SHAPES[name]}
    </svg>
  )
}
