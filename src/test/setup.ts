// ─────────────────────────────────────────────
// קובץ שרץ לפני כל קובץ בדיקות (מוגדר ב-vite.config.ts). מנקה בין בדיקה לבדיקה.
// ─────────────────────────────────────────────

// מוסיף ל-expect בדיקות של DOM, כמו toBeInTheDocument ו-toHaveTextContent
import '@testing-library/jest-dom/vitest'
// cleanup: מוחק מהמסך את מה שהבדיקה ציירה
import { cleanup } from '@testing-library/react'
// afterEach: קוד שרץ אחרי כל בדיקה. vi: כלים ליצירת פונקציות מזויפות (mock)
import { afterEach, vi } from 'vitest'
// מרוקן את ה-cache של useFetch
import { clearFetchCache } from '../hooks/useFetch'

// ב-jsdom אין גלילה אמיתית. ScrollToTop קורא ל-scrollTo, אז מחליפים אותו בפונקציה ריקה.
// vi.fn(): פונקציה ריקה שלא עושה כלום
window.scrollTo = vi.fn()

// כל בדיקה מתחילה נקייה: בלי מה שהבדיקה הקודמת השאירה במסך, ב-useFetch, ב-localStorage או ב-fetch
// מגדירים מה קורה אחרי כל בדיקה
afterEach(() => {
  // מנקים את המסך
  cleanup()
  // מוחקים תשובות שמורות
  clearFetchCache()
  // מוחקים את "הרשימה שלי" השמורה
  localStorage.clear()
  // מחזירים את fetch האמיתי, אחרי שבדיקה החליפה אותו במזויף
  vi.unstubAllGlobals()
})
