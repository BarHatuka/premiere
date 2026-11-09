// ─────────────────────────────────────────────
// מפת הכתובות של האתר: איזה עמוד מוצג בכל כתובת.
// משתמשים בו ב: main.tsx, ובבדיקות (App.test.tsx, acceptance.test.tsx).
// הזרימה: הכתובת משתנה ← Routes בוחר Route ← העמוד מוצג בתוך ה-Outlet של Layout.
// אם המרצה שואל "איפה ה-state של הסדרה שנבחרה?": אין כזה. הסדרה שנבחרה היא חלק מהכתובת (/shows/:id), ולכן היא שורדת רענון ואפשר לשלוח אותה בקישור.
// ─────────────────────────────────────────────

// Route ו-Routes: מגדירים איזה רכיב מוצג באיזו כתובת
import { Route, Routes } from 'react-router'
// Layout: המסגרת הקבועה, כלומר הכותרת, הניווט והתחתית
import Layout from './components/Layout'
// MyListProvider: מחזיק את "הרשימה שלי" ומשתף אותה עם כל האפליקציה
import MyListProvider from './components/MyListProvider'
// ארבעת העמודים, ועמוד "לא נמצא"
import HomePage from './pages/HomePage'
// שאר העמודים: הרשימה שלי, לא נמצא, עמוד סדרה ולוח השידורים
import MyListPage from './pages/MyListPage'
import NotFoundPage from './pages/NotFoundPage'
import ShowPage from './pages/ShowPage'
import TodayPage from './pages/TodayPage'

// הרכיב הראשי של האפליקציה: מפת הכתובות של האתר
export default function App() {
  // מה שהרכיב מציג
  return (
    // MyListProvider עוטף את הכול, כך שכל עמוד יכול לקרוא את "הרשימה שלי" עם useMyList
    <MyListProvider>
      {/* Routes בוחר את ה-Route הראשון שמתאים לכתובת הנוכחית */}
      <Routes>
        {/* Route בלי path: כל העמודים שבתוכו מוצגים בתוך Layout, במקום ה-Outlet שלו */}
        <Route element={<Layout />}>
          {/* index: הכתובת / , כלומר קיר הסדרות */}
          <Route index element={<HomePage />} />
          {/* :id הוא פרמטר. בכתובת /shows/2 הערך שלו הוא "2", ו-ShowPage קורא אותו עם useParams */}
          <Route path="shows/:id" element={<ShowPage />} />
          {/* /my-list: הסדרות ששמרתי */}
          <Route path="my-list" element={<MyListPage />} />
          {/* /today: לוח השידורים של היום */}
          <Route path="today" element={<TodayPage />} />
          {/* * תופס כל כתובת אחרת, ומציג "העמוד הזה לא בתוכנית" */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </MyListProvider>
  )
}
