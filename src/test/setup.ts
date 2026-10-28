import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import { clearFetchCache } from '../hooks/useFetch'

// ב-jsdom אין גלילה אמיתית. ScrollToTop קורא ל-scrollTo, אז מחליפים אותו בפונקציה ריקה.
window.scrollTo = vi.fn()

// כל בדיקה מתחילה נקייה: בלי מה שהבדיקה הקודמת השאירה במסך, ב-useFetch, ב-localStorage או ב-fetch
afterEach(() => {
  cleanup()
  clearFetchCache()
  localStorage.clear()
  vi.unstubAllGlobals()
})
