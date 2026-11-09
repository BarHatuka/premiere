// useState: זוכר אם התמונה נטענת, נטענה, או נכשלה
import { useState } from 'react'
// העיצוב של הפוסטר
import './Poster.css'

// ה-props של הפוסטר
type PosterProps = {
  // כתובת התמונה
  src: string
  // טקסט חלופי לקורא מסך
  alt: string
  // הטקסט שמוצג אם התמונה לא נטענת (שם הסדרה)
  fallbackText: string
}

// אם התמונה לא נטענת, מציגים במקומה את שם הסדרה.
export default function Poster({ src, alt, fallbackText }: PosterProps) {
  // המצב של התמונה. מתחיל ב-'loading'
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')

  // התמונה נכשלה: מציגים מלבן עם שם הסדרה
  if (status === 'failed') {
    // בלי alt (בכרטיס) מסתירים מקורא המסך, כי השם כבר כתוב מתחת
    return alt ? (
      // יש alt: role="img" אומר לקורא מסך שזו תמונה, ו-aria-label הוא התיאור שלה
      <span className="poster poster--missing" role="img" aria-label={alt}>
        <span dir="ltr">{fallbackText}</span>
      </span>
    ) : (
      // אין alt: aria-hidden מסתיר את המלבן מקורא המסך
      <span className="poster poster--missing" aria-hidden="true">
        <span dir="ltr">{fallbackText}</span>
      </span>
    )
  }

  // התמונה עצמה
  return (
    <img
      // class לעיצוב
      className="poster"
      // data-status: ה-CSS משתמש בו כדי להציג את התמונה בהדרגה כשהיא נטענת
      data-status={status}
      // כתובת התמונה
      src={src}
      // טקסט חלופי
      alt={alt}
      // lazy: הדפדפן טוען את התמונה רק כשהיא מתקרבת למסך
      loading="lazy"
      // מפענחים את התמונה ברקע, בלי לעכב את הדף
      decoding="async"
      // התמונה נטענה: מעדכנים את המצב
      onLoad={() => setStatus('loaded')}
      // התמונה נכשלה: מעדכנים את המצב, ו-React יצייר את המלבן עם השם
      onError={() => setStatus('failed')}
    />
  )
}
