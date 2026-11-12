// ─────────────────────────────────────────────
// הודעת טעינה או הודעת שגיאה, משותפת לכל העמודים שטוענים מידע.
// משתמשים בו ב: HomePage, ‏ShowPage, ‏TodayPage.
// ה-type ב-props קובע איזו הודעה זו (union type). אם type הוא 'error', ‏TypeScript מחייב להעביר גם title, ‏details ו-onRetry.
// ─────────────────────────────────────────────

// העיצוב של ההודעות
import './StatusMessage.css'

// שני סוגי הודעות, עם props שונים לכל סוג (union type)
type StatusMessageProps =
  // טעינה: טקסט, ואפשר להציג פוסטרים ריקים בזמן ההמתנה
  | { type: 'loading'; text: string; posters?: boolean }
  // שגיאה: כותרת, פרטי השגיאה, ופונקציה לכפתור "נסו שוב"
  | { type: 'error'; title: string; details: string; onRetry: () => void }

// הודעת טעינה או הודעת שגיאה, לכל העמודים שטוענים מידע
export default function StatusMessage(props: StatusMessageProps) {
  // מצב טעינה. אחרי הבדיקה הזאת TypeScript יודע ש-props הוא מסוג loading
  if (props.type === 'loading') {
    // מה שמוצג בזמן טעינה
    return (
      // role="status": קורא מסך מקריא את ההודעה כשהיא מופיעה
      <div className="status status--loading" role="status">
        {/* הטקסט, למשל "טוענים את הסדרות…" */}
        <p className="status__text">{props.text}</p>
        {/* 12 פוסטרים ריקים שלא משתנים, ולכן key לפי המיקום תקין כאן */}
        {props.posters && (
          // aria-hidden: קורא מסך מדלג על הפוסטרים הריקים
          <ul className="status__skeleton" aria-hidden="true">
            {/* Array.from יוצר מערך של 12 פריטים, ולכל אחד li ריק */}
            {Array.from({ length: 12 }, (_, index) => (
              <li key={index} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  // מצב שגיאה. role="alert": קורא מסך מקריא אותה מיד
  return (
    // div עם role="alert"
    <div className="status status--error" role="alert">
      {/* הכותרת, למשל "לא הצלחנו לטעון את הסדרות" */}
      <h2 className="status__title">{props.title}</h2>
      {/* הסבר כללי למשתמש */}
      <p className="status__text">החיבור ל-TVmaze נכשל. בדקו שיש חיבור לאינטרנט ונסו שוב.</p>
      {/* הטקסט הטכני של השגיאה, באנגלית */}
      <p className="status__details" dir="ltr">
        {props.details}
      </p>
      {/* לחיצה קוראת ל-retry של useFetch */}
      <button type="button" className="button button--primary" onClick={props.onRetry}>
        נסו שוב
      </button>
    </div>
  )
}
