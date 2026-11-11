// ─────────────────────────────────────────────
// ההגדרות של Vite (שרת הפיתוח והבנייה) ושל Vitest (הבדיקות).
// ─────────────────────────────────────────────

// התוסף של Vite ל-React: מתרגם JSX ומרענן את הדף בזמן פיתוח
import react from '@vitejs/plugin-react'
// defineConfig: נותן השלמה אוטומטית ובדיקת טיפוסים להגדרות. מ-vitest/config כדי שגם החלק של הבדיקות יוכר
import { defineConfig } from 'vitest/config'

// ההגדרות של Vite ושל Vitest. כל האפשרויות מוסברות בתיעוד: https://vite.dev/config/
export default defineConfig({
  // מפעילים את התוסף של React
  plugins: [react()],
  // ההגדרות של הבדיקות
  test: {
    environment: 'jsdom', // דפדפן מדומה, כדי שאפשר יהיה לצייר רכיבים בבדיקות
    // קובץ שרץ לפני כל קובץ בדיקות
    setupFiles: './src/test/setup.ts',
  },
})
