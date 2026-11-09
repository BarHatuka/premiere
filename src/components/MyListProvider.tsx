// useEffect לשמירה ב-localStorage, ‏useState להחזקת הרשימה, ו-ReactNode הוא הטיפוס של children
import { useEffect, useState, type ReactNode } from 'react'
// הערוץ שדרכו הרשימה מגיעה לכל הרכיבים
import { MyListContext } from '../hooks/useMyList'
// הטיפוס של סדרה
import type { Show } from '../types/tvmaze'
// הפונקציות שטוענות, שומרות ומעדכנות את הרשימה
import { loadMyList, storeMyList, toggleShow } from '../utils/myList'

// ה-props של הרכיב: רק children, כלומר כל מה שהוא עוטף
type MyListProviderProps = {
  children: ReactNode
}

// הרכיב שמחזיק את "הרשימה שלי". ב-App.tsx הוא עוטף את כל האפליקציה
export default function MyListProvider({ children }: MyListProviderProps) {
  // loadMyList בלי סוגריים: React קורא לה רק ברינדור הראשון.
  // shows: הרשימה. setShows: הדרך היחידה לשנות אותה
  const [shows, setShows] = useState<Show[]>(loadMyList)

  // בכל פעם שהרשימה משתנה, שומרים אותה ב-localStorage
  useEffect(() => {
    // שומרים את הרשימה בדפדפן, כדי שתישאר אחרי רענון
    storeMyList(shows)
    // רץ רק כש-shows משתנה
  }, [shows])

  // מה שכל רכיב יקבל מ-useMyList
  const value = {
    // הרשימה עצמה
    shows,
    // some: האם יש לפחות סדרה אחת עם המזהה הזה
    isSaved: (id: number) => shows.some((show) => show.id === id),
    // מעדכנים לפי הרשימה הנוכחית (current), ו-toggleShow מחזירה רשימה חדשה
    toggle: (show: Show) => setShows((current) => toggleShow(current, show)),
  }

  // Provider מעביר את value לכל הרכיבים שבתוכו, ומציג את children כמו שהם
  return <MyListContext.Provider value={value}>{children}</MyListContext.Provider>
}
