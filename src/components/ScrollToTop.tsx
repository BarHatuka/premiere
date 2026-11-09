// useEffect: קוד שרץ אחרי הציור
import { useEffect } from 'react'
// useLocation: הכתובת הנוכחית. useNavigationType: איך הגענו אליה (קישור, או "אחורה")
import { useLocation, useNavigationType } from 'react-router'

// במעבר לעמוד חדש גוללים לראש הדף. ב"אחורה" (POP) הדפדפן מחזיר לבד את המקום שבו היינו.
export default function ScrollToTop() {
  // pathname: החלק של הכתובת אחרי שם האתר, למשל "/shows/2"
  const { pathname } = useLocation()
  // 'PUSH' כשלוחצים על קישור, 'POP' כשלוחצים "אחורה" או "קדימה"
  const navigationType = useNavigationType()

  // רץ בכל פעם שהכתובת או סוג הניווט משתנים
  useEffect(() => {
    // אם זה לא "אחורה", גוללים לראש הדף
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [pathname, navigationType])

  // הרכיב לא מציג כלום על המסך
  return null
}
