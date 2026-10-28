import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router'

// במעבר לעמוד חדש גוללים לראש הדף. ב"אחורה" (POP) הדפדפן מחזיר לבד את המקום שבו היינו.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return null
}
