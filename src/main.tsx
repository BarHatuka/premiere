// StrictMode: מצב בדיקה של React בזמן פיתוח. הוא מריץ כל effect פעמיים כדי לחשוף באגים
import { StrictMode } from 'react'
// createRoot: הפונקציה שמחברת את React לדף ה-HTML
import { createRoot } from 'react-dom/client'
// BrowserRouter: מחבר את React Router לשורת הכתובת של הדפדפן
import { BrowserRouter } from 'react-router'
// App: הרכיב הראשי, שמחליט איזה עמוד להציג
import App from './App.tsx'
// העיצוב הכללי של כל האתר: צבעים, פונטים ומשתנים
import './index.css'

// מוצאים ב-index.html את ה-div עם id="root" ומציירים בתוכו את כל האפליקציה.
// הסימן ! אומר ל-TypeScript שהאלמנט בטוח קיים
createRoot(document.getElementById('root')!).render(
  // עוטפים הכול ב-StrictMode, כדי לקבל אזהרות בזמן פיתוח
  <StrictMode>
    {/* BrowserRouter עוטף את App, כך שכל רכיב יכול לקרוא את הכתובת ולשנות אותה */}
    <BrowserRouter>
      {/* האפליקציה עצמה */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)
