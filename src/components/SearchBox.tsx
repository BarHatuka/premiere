// ─────────────────────────────────────────────
// תיבת החיפוש בקיר.
// משתמשים בו ב: HomePage.
// אם המרצה שואל "מה זה controlled input?": הערך של השדה מגיע מ-props (value), וכל הקלדה מדווחת למעלה (onChange). כך הערך תמיד שווה למה שבכתובת.
// ─────────────────────────────────────────────

// אייקונים: זכוכית מגדלת ואיקס
import Icon from './Icon'
// העיצוב של תיבת החיפוש
import './SearchBox.css'

// ה-props: הערך הנוכחי, ופונקציה שמדווחת על שינוי
type SearchBoxProps = {
  value: string
  onChange: (value: string) => void
}

// תיבת החיפוש בקיר. controlled input: הערך מגיע מבחוץ (מהכתובת), והרכיב רק מדווח על שינוי
export default function SearchBox({ value, onChange }: SearchBoxProps) {
  // מה שהרכיב מציג
  return (
    // עוטף את השדה ואת האייקונים, כדי למקם אותם בתוכו
    <div className="search-box">
      {/* label מוסתר מהעין אבל לא מקורא המסך. htmlFor מחבר אותו לשדה עם id="show-search" */}
      <label className="visually-hidden" htmlFor="show-search">
        חיפוש סדרה לפי שם
      </label>
      {/* האייקון בתוך השדה */}
      <span className="search-box__icon">
        <Icon name="search" />
      </span>
      {/* שדה הטקסט */}
      <input
        // ה-id שה-label מצביע עליו
        id="show-search"
        // class לעיצוב
        className="search-box__input"
        // type="search": שדה חיפוש, וקורא מסך מזהה אותו ככזה
        type="search"
        // כיוון הכתיבה לפי מה שמקלידים, עברית או אנגלית
        dir="auto"
        // הערך מגיע מה-props (controlled)
        value={value}
        // הטקסט האפור כשהשדה ריק
        placeholder="חיפוש לפי שם הסדרה, באנגלית"
        // בלי הצעות השלמה של הדפדפן
        autoComplete="off"
        // בלי סימון שגיאות כתיב בשמות של סדרות
        spellCheck={false}
        // בכל הקלדה מעבירים את הטקסט החדש למעלה, ל-HomePage
        onChange={(event) => onChange(event.target.value)}
      />
      {/* כפתור הניקוי מופיע רק כשיש טקסט */}
      {value && (
        // aria-label: לכפתור יש רק אייקון, אז נותנים לו שם בשביל קורא מסך
        <button type="button" className="search-box__clear" aria-label="ניקוי החיפוש" onClick={() => onChange('')}>
          {/* איקס */}
          <Icon name="close" />
        </button>
      )}
    </div>
  )
}
